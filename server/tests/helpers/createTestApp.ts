import mongoose from 'mongoose';
import { createApp } from '@/server';

export async function createTestApp() {
  const app = await createApp();

  // Garante que a conexao com MongoDB seja fechada ao encerrar o app.
  // Necessario para que o Jest nao fique "pendurado" esperando conexoes abertas.
  app.addHook('onClose', async () => {
    await mongoose.disconnect();
  });

  return app;
}
