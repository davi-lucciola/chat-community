import mongoose from 'mongoose';
import { chatSchema } from '@/app/chat/chat.model';

const userSchema = new mongoose.Schema({
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
  chats: {
    type: [chatSchema],
    required: true,
    default: [],
  },
});

export const User = mongoose.model('User', userSchema);
