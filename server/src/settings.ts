import { z } from 'zod';

const settingsSchema = z.object({
  MONGODB_URL: z.string(),
});

export type Settings = z.infer<typeof settingsSchema>;

export const getSettings = () =>
  settingsSchema.parse({
    MONGODB_URL: process.env.MONGODB_URL,
  });
