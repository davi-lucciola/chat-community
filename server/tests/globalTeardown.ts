export default async function globalTeardown() {
  if (global.__MONGODB_CONTAINER__) {
    console.log('\n[Global Teardown] Stopping MongoDB container...');
    await global.__MONGODB_CONTAINER__.stop();
    console.log('[Global Teardown] MongoDB container stopped.');
  }
}
