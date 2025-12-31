import mongoose from 'mongoose';
import { basicUserDocument } from '../user/user.model';

const chatMessageDocument = new mongoose.Schema({
  user: {
    type: basicUserDocument,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  communityId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

export const ChatMessage = mongoose.model('Chat_Message', chatMessageDocument);
