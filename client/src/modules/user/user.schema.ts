export const UserStatusEnum = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  IDLE: 'IDLE',
} as const;

export type UserStatus = (typeof UserStatusEnum)[keyof typeof UserStatusEnum];

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
  imageUrl: string | null;
};
