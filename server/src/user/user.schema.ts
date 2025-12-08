import { Type, type Static } from '@sinclair/typebox';

export const userSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  email: Type.String(),
});

export const createUserSchema = Type.Object({
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 4 }),
});

export type UserDTO = Static<typeof userSchema>;
export type CreateUserDTO = Static<typeof createUserSchema>;
