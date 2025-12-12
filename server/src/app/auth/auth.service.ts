import hash from '@/utils/hash';
import type { JWT } from 'fastify-jwt';
import { User } from '@/app/user/user.model';
import { UnauthorizedError } from '@/lib/errors';
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

    const token = this.jwt.sign({
      id: user.id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl ?? null,
    });

    return {
      type: 'Bearer',
      accessToken: token,
    };
  }
}
