import { prisma } from '@/infra/db';

export { prisma };

export async function resetDatabase() {
  // assume model "User" => prisma.user
  await prisma.user.deleteMany();
}
