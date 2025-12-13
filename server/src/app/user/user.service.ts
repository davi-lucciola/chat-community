import mongoose from 'mongoose';
import hash from '@/utils/hash';
import { User } from './user.model';
import type { SaveUserDTO, UserDTO } from './user.schema';
import { DomainError, NotFoundError, UnauthorizedError } from '@/lib/errors';

export class UserService {
  async findById(userId: string): Promise<UserDTO> {
    const user = await User.findOne({ _id: new mongoose.Types.ObjectId(userId) });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return this.userToDto(user);
  }

  async create(userDto: SaveUserDTO): Promise<UserDTO> {
    const { name, email, password } = userDto;

    const user = await User.findOne({ email: email });

    if (user) {
      throw new DomainError('Already exists a user with this email.');
    }

    const newUser = await User.create({
      name: name,
      email: email,
      password: await hash.hashPassword(password),
    });

    return this.userToDto(newUser);
  }

  async update(userDto: SaveUserDTO, userId: string): Promise<UserDTO> {
    const { name, email, password } = userDto;

    const userEmail = await User.findOne({ email: email });

    if (userEmail && userEmail.id !== userId) {
      throw new DomainError('Already exists a user with this email.');
    }

    const user = await User.findOne({ _id: new mongoose.Types.ObjectId(userId) });

    if (!user) {
      throw new NotFoundError('Your user does not exists anymore.');
    }

    const isPasswordCorrect = await hash.verifyPassword(password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedError('Invalid password.');
    }

    // const nameHasChanged = user.name !== name;

    user.name = name;
    user.email = email;

    await user.save();

    // Update "user.name" in every document witch uses that if nameHasChanged

    return this.userToDto(user);
  }

  private userToDto(user: InstanceType<typeof User>): UserDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl ?? null,
    };
  }
}
