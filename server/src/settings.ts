import { z } from 'zod';

const settingsSchema = z.object({
  IS_PROD: z.coerce.boolean().default(false),
  JWT_SECRET: z.string(),
  MONGODB_URL: z.string(),
  CLIENT_URL: z.string(),
});

export const settings = settingsSchema.parse({
  IS_PROD: process.env.IS_PROD,
  JWT_SECRET: process.env.JWT_SECRET,
  MONGODB_URL: process.env.MONGODB_URL,
  CLIENT_URL: process.env.CLIENT_URL,
});

export type Settings = z.infer<typeof settingsSchema>;
