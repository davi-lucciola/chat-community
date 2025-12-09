import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

export const chatSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    default: '',
  },
  createdByUser: {
    type: userSchema,
    required: true,
  },
});

export const Chat = mongoose.model('Chat', chatSchema);
