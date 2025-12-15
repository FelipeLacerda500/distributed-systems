import fs from 'node:fs';
import path from 'node:path';

export default async function globalTeardown() {
  const dbFile = path.resolve(process.cwd(), 'prisma', 'test.db');
  if (fs.existsSync(dbFile)) {
    fs.unlinkSync(dbFile);
  }
}
