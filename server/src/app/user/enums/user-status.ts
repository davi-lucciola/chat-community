export const UserStatus = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  IDLE: 'IDLE',
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
