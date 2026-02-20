import { createApp } from "./server";

const main = async () => {
  const app = await createApp();
  await app.listen({ port: 3333, host: '0.0.0.0' });
};

main()
  .then(() => {
    console.log('🔥 Server is running at http://localhost:3333');
    console.log('You can access the documentation at http://localhost:3333/api/docs');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });