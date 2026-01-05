import mongoose from 'mongoose';

export function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}
