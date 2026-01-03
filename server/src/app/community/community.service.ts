import mongoose from 'mongoose';
import { DomainError, NotFoundError } from '@/lib/errors';
import type { UserDTO } from '../user/user.schema';
import { Community, CommunityMember } from './community.model';
import type {
  CommunitiesQueryDTO,
  CommunityDTO,
  CreateCommunityDTO,
} from './community.schema';

export class CommunityService {
  constructor(private readonly currentUser: UserDTO) {}

  async findAll(query: CommunitiesQueryDTO) {
    const pipeline: mongoose.PipelineStage[] = [
      {
        $lookup: {
          from: 'community_members',
          localField: '_id',
          foreignField: 'communityId',
          pipeline: [
            {
              $match: {
                $and: [
                  { 'user._id': new mongoose.Types.ObjectId(this.currentUser._id) },
                ],
              },
            },
            { $limit: 1 },
          ],
          as: 'membership',
        },
      },
      {
        $addFields: {
          isMember: { $gt: [{ $size: '$membership' }, 0] },
        },
      },
      {
        $project: { membership: false },
      },
    ];

    if (query.search) {
      pipeline.push({
        $match: {
          title: { $regex: query.search, $options: 'i' },
        },
      });
    }

    if (query.isMember !== undefined) {
      pipeline.push({
        $match: {
          $and: [{ isMember: query.isMember }],
        },
      });
    }

    const communities = await Community.aggregate<CommunityDTO>(pipeline);
    return communities;
  }

  async findById(communityId: string) {
    if (!this.isValidCommunityId(communityId)) {
      throw new NotFoundError('Community not found');
    }

    const community = await Community.findOne({
      _id: new mongoose.Types.ObjectId(communityId),
    });

    if (!community) {
      throw new NotFoundError('Community not found');
    }

    return community;
  }

  async create(communityDto: CreateCommunityDTO) {
    const { title, description } = communityDto;

    const communityExists = await Community.findOne({
      title: title,
    });

    if (communityExists) {
      throw new DomainError('Already exists a community with this title');
    }

    const user = {
      _id: new mongoose.Types.ObjectId(this.currentUser._id),
      name: this.currentUser.name,
      imageUrl: this.currentUser.imageUrl,
    };

    const community = await Community.create({
      title,
      description,
      userId: user._id,
    });

    await CommunityMember.create({
      user,
      communityId: community._id,
    });

    return community;
  }

  async becomeMember(communityId: string) {
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
      id: new mongoose.Types.ObjectId(this.currentUser._id),
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

    return community;
  }

  async stopBeingMember(communityId: string) {
    if (!this.isValidCommunityId(communityId)) {
      throw new NotFoundError('Community not found');
    }

    const community = await Community.findOne({
      _id: new mongoose.Types.ObjectId(communityId),
    });

    if (!community) {
      throw new NotFoundError('Community not found');
    }

    const userId = new mongoose.Types.ObjectId(this.currentUser._id);

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

    return community;
  }

  private isValidCommunityId(communityId: string) {
    return mongoose.Types.ObjectId.isValid(communityId);
  }
}
