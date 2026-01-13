import type { JWT } from '@fastify/jwt';
import mongoose from 'mongoose';
import { User } from '@/app/user/user.model';
import { UnauthorizedError } from '@/lib/errors';
import hash from '@/utils/hash';
import { UserStatus } from '../user/enums/user-status';
import type { UserDTO } from '../user/user.schema';
import { userStatusManager } from '../websockets/user.websocket';
import type { LoginDTO, TokenDTO } from './auth.schema';

export class AuthService {
  constructor(private readonly jwt: JWT) {}

  async login(loginDto: LoginDTO): Promise<TokenDTO> {
    const { email, password } = loginDto;

    const user = await User.findOne({
      email: email,
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    const isPasswordCorrect = await hash.verifyPassword(password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    const userDto: UserDTO = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl ?? null,
    };

    const token = this.jwt.sign(userDto, {
      expiresIn: 60 * 60 * 5, // 5 Hours
    });

    await userStatusManager.setStatus(user, UserStatus.ONLINE);

    return {
      type: 'Bearer',
      accessToken: token,
    };
  }

  async logout(userId: string) {
    const user = await User.findOne({
      _id: new mongoose.Types.ObjectId(userId),
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    await userStatusManager.setStatus(user, UserStatus.OFFLINE);
  }
}
