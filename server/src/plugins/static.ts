import path from 'path';
import fp from 'fastify-plugin';
import { settings } from '@/settings';

const staticPlugin = fp((app, _, done) => {
  const staticPath = settings.IS_PROD ? 
    path.join(__dirname, '..', 'dist') : 
    path.join(__dirname, '..', '..', '..', 'client', 'dist');
  
  app.register(import('@fastify/static'), {
    root: staticPath,
    prefix: '/'
  })

  app.setNotFoundHandler((req, reply) => {
    if (req.raw.url?.startsWith('/api')) {
      reply.code(404).send({ message: 'Not Found' })
      return
    }

    reply.sendFile('index.html')
  })

  done();
})

export default staticPlugin;