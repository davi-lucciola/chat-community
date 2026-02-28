import fs from 'node:fs';
import path from 'node:path';
import { MongoDBContainer } from '@testcontainers/mongodb';

declare global {
  var __MONGODB_CONTAINER__: Awaited<ReturnType<MongoDBContainer['start']>>;
}

export default async function globalSetup() {
  // O plugin @fastify/static espera que o diretorio client/dist exista.
  // Criamos aqui para nao quebrar o startup da aplicacao nos testes.
  const clientDistPath = path.join(__dirname, '..', '..', '..', 'client', 'dist');
  fs.mkdirSync(clientDistPath, { recursive: true });

  // Sobe um container MongoDB isolado para os testes
  console.log('\n[globalSetup] Starting MongoDB container...');
  const container = await new MongoDBContainer('mongo:7.0').start();
  console.log(`[globalSetup] MongoDB container started at ${container.getConnectionString()}`);

  // Armazenamos no global para poder parar o container no globalTeardown.
  // O global e compartilhado entre globalSetup e globalTeardown no mesmo processo Jest.
  global.__MONGODB_CONTAINER__ = container;

  process.env.MONGODB_URL =
    container.getConnectionString() + '?directConnection=true';
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.CLIENT_URL = 'http://localhost:3000';
}
