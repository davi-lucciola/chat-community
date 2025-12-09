import { z } from 'zod';

const settingsSchema = z.object({
  JWT_SECRET: z.string(),
  MONGODB_URL: z.string(),
});

export type Settings = z.infer<typeof settingsSchema>;

export const getSettings = () =>
  settingsSchema.parse({
    JWT_SECRET: process.env.JWT_SECRET,
    MONGODB_URL: process.env.MONGODB_URL,
  });
