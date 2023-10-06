import { PrismaClient } from '@prisma/client';
import extension from '../dist';

const prisma = new PrismaClient().$extends(extension());

async function main() {
  const user = await prisma.user.findFirst();
}

main();
