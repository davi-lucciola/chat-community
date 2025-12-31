import mongoose from 'mongoose';

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
});

export const User = mongoose.model('User', userDocument, 'users');
