import mongoose from 'mongoose';
import { basicUserDocument } from '../user/user.model';

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

const communityDocument = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  owner: {
    type: basicUserDocument,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  membersQuantity: {
    type: Number,
    min: 1,
    required: true,
    default: 1,
  },
});

export const Community = mongoose.model('Community', communityDocument);
export const CommunityMember = mongoose.model(
  'Community_Member',
  communityMemberDocument,
);
