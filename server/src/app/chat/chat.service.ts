import mongoose from 'mongoose';
import { DomainError, NotFoundError } from '@/lib/errors';
import type { UserDTO } from '../user/user.schema';
import { Chat, ChatMember } from './chat.model';
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
      id: new mongoose.Types.ObjectId(this.currentUser.id),
      name: this.currentUser.name,
      imageUrl: this.currentUser.imageUrl,
    };

    const chat = await Chat.create({
      title,
      description,
      createdByUser: user,
    });

    await ChatMember.create({
      member: user,
      chatId: chat._id,
    });

    return this.chatToDto(chat);
  }

  async becomeMember(chatId: string): Promise<ChatDTO> {
    const chat = await Chat.findOne({
      _id: new mongoose.Types.ObjectId(chatId),
    });

    if (!chat) {
      throw new NotFoundError('Chat not found');
    }

    const user = {
      id: new mongoose.Types.ObjectId(this.currentUser.id),
      name: this.currentUser.name,
      imageUrl: this.currentUser.imageUrl,
    };

    const isChatMember = await ChatMember.findOne({
      'member.id': user.id,
      chatId: chat.id,
    });

    if (!isChatMember) {
      await ChatMember.create({
        member: user,
        chatId: chat.id,
      });
    }

    return this.chatToDto(chat);
  }

  async stopBeingMember(chatId: string): Promise<ChatDTO> {
    const chat = await Chat.findOne({
      _id: new mongoose.Types.ObjectId(chatId),
    });

    if (!chat) {
      throw new NotFoundError('Chat not found');
    }

    const userId = new mongoose.Types.ObjectId(this.currentUser.id);

    if (chat.createdByUser.id.toString() === userId.toString()) {
      throw new DomainError('You cannot stop being a member of your own chat.');
    }

    await ChatMember.deleteOne({
      'member.id': userId,
      chatId: chat.id,
    });

    return this.chatToDto(chat);
  }

  private chatToDto(chat: InstanceType<typeof Chat>) {
    return {
      id: chat._id.toString(),
      title: chat.title,
      description: chat.description,
      createdByUser: {
        id: chat.createdByUser.id.toString(),
        name: chat.createdByUser.name,
        imageUrl: chat.createdByUser.imageUrl,
      },
    };
  }
}
