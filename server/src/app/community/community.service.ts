import mongoose from 'mongoose';
import { DomainError, NotFoundError } from '@/lib/errors';
import type { UserDTO } from '../user/user.schema';
import { Community, type CommunityDocument, CommunityMember } from './community.model';
import type {
  CommunitiesQueryDTO,
  CommunityDTO,
  CreateCommunityDTO,
} from './community.schema';

export class CommunityService {
  constructor(private readonly currentUser: UserDTO) {}

  async findAll(query: CommunitiesQueryDTO): Promise<CommunityDTO[]> {
    const pipeline: mongoose.PipelineStage[] = [];

    if (query.search) {
      pipeline.push({
        $match: {
          title: { $regex: query.search, $options: 'i' },
        },
      });
    }

    if (query.isMember !== undefined) {
      pipeline.push({
        $lookup: {
          from: 'community_members',
          localField: '_id',
          foreignField: 'communityId',
          pipeline: [
            {
              $match: {
                $and: [{ 'user.id': new mongoose.Types.ObjectId(this.currentUser.id) }],
              },
            },
            { $limit: 1 },
          ],
          as: 'membership',
        },
      });

      pipeline.push({
        $addFields: {
          isMember: { $gt: [{ $size: '$membership' }, 0] },
        },
      });

      pipeline.push({
        $match: {
          $and: [{ isMember: query.isMember }],
        },
      });

      pipeline.push({
        $project: { membership: false },
      });
    }

    if (pipeline.length === 0) {
      const communities = await Community.find();
      return communities.map(this.communityToDto);
    }

    const communities = await Community.aggregate<CommunityDocument>(pipeline);
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
      userId: user.id,
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

      community.totalMembers += 1;
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

    if (community.userId.toString() === userId.toString()) {
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

      community.totalMembers -= 1;
      await community.save();
    }

    return this.communityToDto(community);
  }

  private isValidCommunityId(communityId: string) {
    return mongoose.Types.ObjectId.isValid(communityId);
  }

  private communityToDto(community: CommunityDocument): CommunityDTO {
    return {
      id: community._id.toString(),
      title: community.title,
      userId: community.userId.toString(),
      description: community.description ?? null,
      totalMembers: community.totalMembers,
      onlineMembers: community.onlineMembers,
    };
  }
}
