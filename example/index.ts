import { PrismaClient } from '@prisma/client';
import extension, { LogData } from '../src';

async function main() {
  // custom options type
  type Options = {
    includeResult?: boolean;
  };

  const prisma = new PrismaClient().$extends(
    extension({
      log: (data: LogData, options?: Options) => {
        const includeResult = false;
        const logData = { ...data };
        if (!includeResult) {
          delete logData.result;
        }
        if (logData.error) {
          console.error(logData);
        } else {
          console.log(logData);
        }
      },
    })
  );
  await prisma.user.findFirst();
  await prisma.user.count({
    log: false,
  });
  await prisma.user.findMany({
    log: {
      includeResult: true,
    },
  });
}

main().catch(console.error);
