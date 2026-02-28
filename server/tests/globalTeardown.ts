export default async function globalTeardown() {
  if (global.__MONGODB_CONTAINER__) {
    console.log('\n[globalTeardown] Stopping MongoDB container...');
    await global.__MONGODB_CONTAINER__.stop();
    console.log('[globalTeardown] MongoDB container stopped.');
  }
}
