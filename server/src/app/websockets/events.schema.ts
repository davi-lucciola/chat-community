import { z } from 'zod';
import { ChatMessageSchema, StatusChangePayloadSchema } from '../chat/chat.schema';
import { EventType } from './enums/event-type';

export const EventSchema = z.object({
  payload: z.union([ChatMessageSchema, StatusChangePayloadSchema]),
  error: z.boolean().default(false),
  event: z.enum([EventType.MESSAGE, EventType.STATUS_CHANGE]),
});

export type EventDTO = z.infer<typeof EventSchema>;
