export const EventType = {
  MESSAGE: 'message',
  STATUS_CHANGE: 'status_change',
} as const;

export type EventType = (typeof EventType)[keyof typeof EventType];
