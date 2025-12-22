import { API_URL, ApiError } from '@/lib/api';

type UserDTO = {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
};

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
  const res = await fetch(`${API_URL}/sign-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginDTO),
  });

  if (!res.ok) {
    const body = await res.json();
    throw new ApiError(body.message);
  }

  return res.json();
}

async function createUser(userDTO: CreateUserDTO): Promise<UserDTO> {
  const res = await fetch(`${API_URL}/sign-up`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userDTO),
  });

  if (!res.ok) {
    const body = await res.json();
    throw new ApiError(body.message);
  }

  return res.json();
}

export default {
  login,
  createUser,
};
