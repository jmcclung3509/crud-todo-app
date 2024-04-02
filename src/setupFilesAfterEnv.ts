import { db } from './db';

global.afterAll(async () => {
  await db.close();
});
