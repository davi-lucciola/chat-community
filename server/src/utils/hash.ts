import { hash, compare } from 'bcryptjs';

const hashPassword = async (password: string) => {
  return hash(password, 10);
};

const verifyPassword = async (password: string, hashedPassword: string) => {
  return compare(password, hashedPassword);
};

export default {
  hashPassword,
  verifyPassword,
};
