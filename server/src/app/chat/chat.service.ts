import mongoose from 'mongoose';
import { DomainError, NotFoundError } from '@/lib/errors';
import type { UserDTO } from '../user/user.schema';
import { Chat } from './chat.model';
import type { ChatDTO, CreateChatDTO } from './chat.schema';

export class ChatService {
  constructor(private readonly currentUser: UserDTO) {}

  async findAll(): Promise<ChatDTO[]> {
    const chats = await Chat.find();
    return chats.map(this.chatToDto);
  }

  async findById(chatId: string): Promise<ChatDTO> {
    const chat = await Chat.findOne({
      _id: new mongoose.Types.ObjectId(chatId),
    });

    if (!chat) {
      throw new NotFoundError('Chat not found');
    }

    return this.chatToDto(chat);
  }

  async create(chatDto: CreateChatDTO): Promise<ChatDTO> {
    const { title, description } = chatDto;

    const chatExists = await Chat.findOne({
      title: title,
    });

    if (chatExists) {
      throw new DomainError('Already exists a chat with this title');
    }

    const user = {
      name: this.currentUser.name,
    };

    const chat = await Chat.create({
      title,
      description,
      createdByUser: user,
    });

    return this.chatToDto(chat);
  }

  private chatToDto(chat: InstanceType<typeof Chat>) {
    return {
      id: chat._id.toString(),
      title: chat.title,
      description: chat.description,
      createdByUser: chat.createdByUser,
    };
  }
}
