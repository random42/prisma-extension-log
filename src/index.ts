import { Prisma } from '@prisma/client/extension';

export default () =>
  Prisma.defineExtension({
    name: 'prisma-extension-log',
    query: {
      async $allOperations({ model, operation, args, query }) {
        const start = performance.now();
        const result = await query(args);
        const end = performance.now();
        const time = end - start;
        console.log({ model, operation, args, result, time });
        return result;
      },
    },
  });
