import { api, type MessageDTO } from '@/lib/api';
import type { UserDTO } from '@/modules/user/user.schema';
import type { SignInDTO, SignUpDTO, TokenDTO } from './auth.schema';

async function signIn(signInDTO: SignInDTO): Promise<TokenDTO> {
  const res = await api.post<TokenDTO>('/sign-in', signInDTO);
  return res.data;
}

async function signUp(signUpDTO: Omit<SignUpDTO, 'confirmPassword'>): Promise<UserDTO> {
  const res = await api.post<UserDTO>('/sign-up', signUpDTO);
  return res.data;
}

async function signOut(): Promise<MessageDTO> {
  const res = await api.delete<MessageDTO>('/sign-out');
  return res.data;
}

export default {
  signIn,
  signUp,
  signOut,
};
