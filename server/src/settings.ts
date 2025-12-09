import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const settingsSchema = Type.Object({
  MONGODB_URL: Type.String(),
});

export type Settings = Static<typeof settingsSchema>;

export const getSettings = () =>
  Value.Parse(settingsSchema, {
    MONGODB_URL: process.env.MONGODB_URL,
  });
