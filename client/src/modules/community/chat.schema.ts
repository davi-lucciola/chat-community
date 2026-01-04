import type { UserBasicDTO } from '../user/user.schema';

export type ChatMessageDTO = {
  _id: string;
  message: string;
  user: UserBasicDTO;
  createdAt: string;
};
