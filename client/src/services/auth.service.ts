import { api } from '@/lib/api';
import type { UserDTO } from '@/types/user';

type LoginDTO = {
  email: string;
  password: string;
};

type TokenDTO = {
  accessToken: string;
  type: string;
};

type CreateUserDTO = {
  name: string;
  email: string;
  password: string;
};

async function login(loginDTO: LoginDTO): Promise<TokenDTO> {
  const res = await api.post<TokenDTO>('/sign-in', loginDTO);
  return res.data;
}

async function createUser(userDTO: CreateUserDTO): Promise<UserDTO> {
  const res = await api.post<UserDTO>('/sign-up', userDTO);
  return res.data;
}

export default {
  login,
  createUser,
};
