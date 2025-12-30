import fp from 'fastify-plugin';

const websocketPlugin = fp((app, _, done) => {
  app.register(import('@fastify/websocket'), {
    preClose: () => {},
  });
  done();
});

export default websocketPlugin;
