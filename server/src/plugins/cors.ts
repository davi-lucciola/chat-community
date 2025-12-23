import fp from 'fastify-plugin';

const corsPlugin = fp((app, _, done) => {
  app.register(import('@fastify/cors'), {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  done();
});

export default corsPlugin;
