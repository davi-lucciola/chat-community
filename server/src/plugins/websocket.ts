import fp from 'fastify-plugin';

const websocketPlugin = fp((app, _, done) => {
  app.register(import('@fastify/websocket'));
  done();
});

export default websocketPlugin;
