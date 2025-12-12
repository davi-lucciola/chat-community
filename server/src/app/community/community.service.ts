import mongoose from 'mongoose';
import { DomainError, NotFoundError } from '@/lib/errors';
import { Community, CommunityMember } from './community.model';
import type { UserDTO } from '../user/user.schema';
import type { CommunityDTO, CreateCommunityDTO } from './community.schema';

export class CommunityService {
  constructor(private readonly currentUser: UserDTO) {}

  async findAll(): Promise<CommunityDTO[]> {
    const communities = await Community.find();
    return communities.map(this.communityToDto);
  }

  async findById(communityId: string): Promise<CommunityDTO> {
    if (!this.isValidCommunityId(communityId)) {
      throw new NotFoundError('Community not found');
    }

    const community = await Community.findOne({
      _id: new mongoose.Types.ObjectId(communityId),
    });

    if (!community) {
      throw new NotFoundError('Community not found');
    }

    return this.communityToDto(community);
  }

  async create(communityDto: CreateCommunityDTO): Promise<CommunityDTO> {
    const { title, description } = communityDto;

    const communityExists = await Community.findOne({
      title: title,
    });

    if (communityExists) {
      throw new DomainError('Already exists a community with this title');
    }

    const user = {
      id: new mongoose.Types.ObjectId(this.currentUser.id),
      name: this.currentUser.name,
      imageUrl: this.currentUser.imageUrl,
    };

    const community = await Community.create({
      title,
      description,
      owner: user,
    });

    await CommunityMember.create({
      user,
      communityId: community._id,
    });

    return this.communityToDto(community);
  }

  async becomeMember(communityId: string): Promise<CommunityDTO> {
    if (!this.isValidCommunityId(communityId)) {
      throw new NotFoundError('Community not found');
    }

    const community = await Community.findOne({
      _id: new mongoose.Types.ObjectId(communityId),
    });

    if (!community) {
      throw new NotFoundError('Community not found');
    }

    const user = {
      id: new mongoose.Types.ObjectId(this.currentUser.id),
      name: this.currentUser.name,
      imageUrl: this.currentUser.imageUrl,
    };

    const isCommunityMember = await CommunityMember.findOne({
      communityId: community._id,
      'user.id': user.id,
    });

    if (!isCommunityMember) {
      await CommunityMember.create({
        user,
        communityId: community._id,
      });

      community.membersQuantity += 1;
      await community.save();
    }

    return this.communityToDto(community);
  }

  async stopBeingMember(communityId: string): Promise<CommunityDTO> {
    if (!this.isValidCommunityId(communityId)) {
      throw new NotFoundError('Community not found');
    }

    const community = await Community.findOne({
      _id: new mongoose.Types.ObjectId(communityId),
    });

    if (!community) {
      throw new NotFoundError('Community not found');
    }

    const userId = new mongoose.Types.ObjectId(this.currentUser.id);

    if (community.owner.id.toString() === userId.toString()) {
      throw new DomainError('You cannot stop being a member of your own community.');
    }

    const isCommunityMember = await CommunityMember.findOne({
      communityId: community._id,
      'user.id': userId,
    });

    if (isCommunityMember) {
      await CommunityMember.deleteOne({
        communityId: community.id,
        'user.id': userId,
      });

      community.membersQuantity -= 1;
      await community.save();
    }

    return this.communityToDto(community);
  }

  private isValidCommunityId(communityId: string) {
    return mongoose.Types.ObjectId.isValid(communityId);
  }

  private communityToDto(community: InstanceType<typeof Community>): CommunityDTO {
    return {
      id: community.id.toString(),
      title: community.title,
      owner: {
        id: community.owner.id.toString(),
        name: community.owner.name,
        imageUrl: community.owner.imageUrl,
      },
      description: community.description ?? null,
      membersQuantity: community.membersQuantity,
    };
  }
}
