import mongoose from 'mongoose';
import { basicUserDocument } from '../user/user.model';

const chatMemberDocument = new mongoose.Schema({
  member: {
    type: basicUserDocument,
    required: true,
  },
  chatId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

const chatDocument = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
    default: '',
  },
  createdByUser: {
    type: basicUserDocument,
    required: true,
  },
});

export const Chat = mongoose.model('Chat', chatDocument);
export const ChatMember = mongoose.model('Chat_Member', chatMemberDocument);
