import { API_URL, ApiError } from '@/lib/api';

type UserDTO = {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
};

type CreateUserDTO = {
  name: string;
  email: string;
  password: string;
};

async function createUser(userDTO: CreateUserDTO): Promise<UserDTO> {
  const res = await fetch(`${API_URL}/users`, {
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
  createUser,
};
