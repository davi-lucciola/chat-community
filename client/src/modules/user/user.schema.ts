export const UserStatus = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  IDLE: 'IDLE',
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export type UserDTO = {
  _id: string;
  name: string;
  email: string;
  status: UserStatus;
  imageUrl: string | null;
};

export type UserBasicDTO = {
  _id: string;
  name: string;
  status: UserStatus;
  imageUrl: string | null;
};
