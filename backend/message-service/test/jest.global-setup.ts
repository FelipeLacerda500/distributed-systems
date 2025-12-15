import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export default async function globalSetup() {
  const dbFile = path.resolve(process.cwd(), 'prisma', 'test.db');

  // Remove o banco antigo de teste
  if (fs.existsSync(dbFile)) {
    fs.unlinkSync(dbFile);
  }

  // Aplica migrations no banco de teste
  execSync('npx prisma migrate deploy --schema=./prisma/schema.prisma', {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: 'file:./prisma/test.db',
      NODE_ENV: 'test',
    },
  });

  // Garante client atualizado (caso necessário)
  execSync('npx prisma generate --schema=./prisma/schema.prisma', {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: 'file:./prisma/test.db',
      NODE_ENV: 'test',
    },
  });
}
