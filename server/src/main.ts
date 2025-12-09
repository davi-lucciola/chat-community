import { createApp } from '@/app';
import { getSettings } from '@/settings';

const main = async () => {
  const settings = getSettings();
  const app = await createApp(settings);
  await app.listen({ port: 3333, host: '0.0.0.0' });
};

main()
  .then(() => {
    console.log('🔥 Server is running at http://localhost:3333');
    console.log('You can access the documentation at http://localhost:3333/docs');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
