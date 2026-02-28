import type { FastifyPluginCallback } from 'fastify';

// Mock do @scalar/fastify-api-reference para o ambiente de testes.
// O pacote original e pure ESM e incompativel com o modo CommonJS do Jest.
// Como nao precisamos da UI de documentacao nos testes de integracao, um noop e suficiente.
const fastifyApiReference: FastifyPluginCallback = (_app, _opts, done) => {
  done();
};

export default fastifyApiReference;
