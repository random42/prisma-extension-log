import { Prisma } from '@prisma/client/extension';
import {
  ExtensionConfig,
  LogArg,
  LogData,
  LogFunction,
  ModelExtension,
} from './types';

export { ExtensionConfig, LogData, LogFunction };

export default <T>(config: ExtensionConfig<T>) => {
  const { log } = config;
  return Prisma.defineExtension({
    name: 'prisma-extension-log',
    model: {
      $allModels: {} as ModelExtension<T>,
    },
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const queryArgs = { ...args };
          delete queryArgs.log;
          const options = (args as any)?.log as LogArg<T> | undefined;
          if (options === false) {
            return query(queryArgs);
          }
          let result: unknown;
          let error: unknown;
          const start = performance.now();
          try {
            result = await query(queryArgs);
          } catch (err) {
            error = err;
          }
          const end = performance.now();
          const time = end - start;
          await log(
            { model, operation, args: queryArgs, time, result, error },
            options
          );
          if (error) {
            throw error;
          } else return result;
        },
      },
    },
  });
};
