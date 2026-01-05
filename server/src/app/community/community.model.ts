import mongoose from 'mongoose';
import { basicUserDocument } from '../user/user.model';

const communityDocument = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  totalMembers: {
    type: Number,
    min: 1,
    required: true,
    default: 1,
  },
  onlineMembers: {
    type: Number,
    min: 0,
    required: true,
    default: 0,
  },
});

export const Community = mongoose.model('Community', communityDocument);
export type CommunityDocument = InstanceType<typeof Community>;

const communityMemberDocument = new mongoose.Schema({
  user: {
    type: basicUserDocument,
    required: true,
  },
  communityId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

export const CommunityMember = mongoose.model(
  'Community_Member',
  communityMemberDocument,
);
