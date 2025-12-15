import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function resetDatabase() {
  // tabela mapeada como @@map("messages"), model Message => prisma.message
  await prisma.message.deleteMany();
}
