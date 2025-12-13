import mongoose from 'mongoose';
import { User } from './user.model';
import { NotFoundError } from '@/lib/errors';
import type { CreateUserDTO, UserDTO } from './user.schema';
import hash from '@/utils/hash';

export class UserService {
  async createUser(userDto: CreateUserDTO): Promise<UserDTO> {
    const { name, email, password } = userDto;

    const user = await User.findOne({ email: email });

    if (user) {
      throw new NotFoundError('Already exists a user with this email.');
    }

    const newUser = await User.create({
      name: name,
      email: email,
      password: await hash.hashPassword(password),
    });

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      imageUrl: newUser.imageUrl ?? null,
    };
  }

  async updateUsername(name: string, userId: string) {
    const currentUserId = new mongoose.Types.ObjectId(userId);
    await User.updateOne({ _id: currentUserId }, { name: name });

    // Update "user.name" in every document witch uses that
  }
}
