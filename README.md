# prisma-extension-log

Log your model queries in a simple and customizable way.

## Install

```sh
npm i prisma-extension-log
```

## Usage

```typescript
// custom options type
type Options = {
  includeResult?: boolean;
};

const prisma = new PrismaClient().$extends(
  extension({
    log: (data: LogData, options?: Options) => {
      const includeResult = options?.includeResult ?? false;
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
  log: false, // disable logging
});
await prisma.user.findMany({
  log: {
    includeResult: true, // use your options with type safety
  },
});
```

### Log data

```typescript
type LogData = {
  /**
   * @example User
   */
  model: string;
  /**
   * @example findMany
   */
  operation: string;
  args: unknown;
  /**
   * Milliseconds with some precision, using
   * performance.now()
   */
  time: Milliseconds;
  result?: unknown;
  error?: unknown;
}
```

## Learn more

- [Docs — Client extensions](https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions)
- [Docs — Shared extensions](https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions/shared-extensions)
- [Examples](https://github.com/prisma/prisma-client-extensions/tree/main)
- [Preview announcement blog post](https://www.prisma.io/blog/client-extensions-preview-8t3w27xkrxxn#introduction)
