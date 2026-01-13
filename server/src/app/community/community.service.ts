import mongoose from 'mongoose';
import { DomainError, NotFoundError } from '@/lib/errors';
import { isValidObjectId } from '@/utils/object-id';
import type { UserDTO } from '../user/user.schema';
import { userStatusManager } from '../websockets/user.websocket';
import { Community, CommunityMember } from './community.model';
import type {
  CommunitiesQueryDTO,
  CommunityDTO,
  CommunityMemberDTO,
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
    if (!isValidObjectId(communityId)) {
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

  async getMembers(communityId: string) {
    if (!isValidObjectId(communityId)) {
      throw new NotFoundError('Community not found');
    }

    const members = await CommunityMember.aggregate<CommunityMemberDTO>([
      {
        $match: { communityId: new mongoose.Types.ObjectId(communityId) },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    return members.map((member) => ({
      ...member,
      user: {
        ...member.user,
        status: userStatusManager.getStatus(member.user._id.toString()),
      },
    }));
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
    if (!isValidObjectId(communityId)) {
      throw new NotFoundError('Community not found');
    }

    const community = await Community.findOne({
      _id: new mongoose.Types.ObjectId(communityId),
    });

    if (!community) {
      throw new NotFoundError('Community not found');
    }

    const user = {
      _id: new mongoose.Types.ObjectId(this.currentUser._id),
      name: this.currentUser.name,
      imageUrl: this.currentUser.imageUrl,
    };

    const isCommunityMember = await CommunityMember.findOne({
      communityId: community._id,
      'user._id': user._id,
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
    if (!isValidObjectId(communityId)) {
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
      'user._id': userId,
    });

    if (isCommunityMember) {
      await CommunityMember.deleteOne({
        communityId: community.id,
        'user._id': userId,
      });

      community.totalMembers -= 1;
      await community.save();
    }

    return community;
  }
}
