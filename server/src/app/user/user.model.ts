import mongoose from 'mongoose';
import { UserStatus } from './enums/user-status';

export const basicUserDocument = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const userDocument = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: [UserStatus.ONLINE, UserStatus.OFFLINE, UserStatus.IDLE],
    default: UserStatus.OFFLINE,
  },
});

export const User = mongoose.model('User', userDocument, 'users');
export type UserDocument = InstanceType<typeof User>;
