import { Prisma } from '@prisma/client/extension';
import { ExtensionConfig } from './types';

export default <T>(config: ExtensionConfig<T>) => {
  const { log } = config;
  return Prisma.defineExtension({
    name: 'prisma-extension-log',
    model: {
      $allModels: {},
    },
    query: {
      async $allOperations({ model, operation, args, query }) {
        const options = (args as any)?.log;
        let result: unknown;
        let error: unknown;
        const start = performance.now();
        try {
          result = await query(args);
        } catch (err) {
          error = err;
        }
        const end = performance.now();
        const time = end - start;
        await log({ model, operation, args, time, result, error });
        if (error) {
          throw error;
        } else return result;
      },
    },
  });
};
