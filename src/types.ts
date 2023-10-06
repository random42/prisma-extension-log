import { Prisma } from '@prisma/client/extension';
import { Operation } from '@prisma/client/runtime/library';

export type LogArg<T> = false | T;

export type PreQueryArgs = {
  model?: string;
  operation: string;
  args: any;
};

export type Milliseconds = number;

export type PostQueryArgs = PreQueryArgs & {
  /**
   * Milliseconds with some precision, using performance.now()
   */
  time: Milliseconds;
  result?: unknown;
  error?: unknown;
};

export type ModelOperationArgs<T> = {
  log?: LogArg<T>;
};

export type LogFunction<T> = (
  args: PostQueryArgs,
  options?: T
) => void | Promise<void>;

export type ExtensionConfig<T> = {
  log: LogFunction<T>;
};

const REQUIRED_ARGS_OPERATIONS = [
  'findUnique',
  'findUniqueOrThrow',
  'groupBy',
  'update',
  'updateMany',
  'create',
  'createMany',
  'delete',
  'upsert',
] as const satisfies ReadonlyArray<Operation>;
const OPTIONAL_ARGS_OPERATIONS = [
  'findMany',
  'findFirst',
  'findFirstOrThrow',
  'count',
  'aggregate',
  'deleteMany',
] as const satisfies ReadonlyArray<Operation>;

const OPERATIONS = [
  ...REQUIRED_ARGS_OPERATIONS,
  ...OPTIONAL_ARGS_OPERATIONS,
] as const;

type RequiredArgsOperation = (typeof REQUIRED_ARGS_OPERATIONS)[number];
type OptionalArgsOperation = (typeof OPTIONAL_ARGS_OPERATIONS)[number];

type RequiredArgsFunction<O extends RequiredArgsOperation> = <T, A>(
  this: T,
  args: Prisma.Exact<A, Prisma.Args<T, O> & ModelOperationArgs>
) => Promise<Prisma.Result<T, A, O>>;

type OptionalArgsFunction<O extends OptionalArgsOperation> = <T, A>(
  this: T,
  args?: Prisma.Exact<A, Prisma.Args<T, O> & ModelOperationArgs>
) => Promise<Prisma.Result<T, A, O>>;

export type ModelExtension = {
  [O1 in RequiredArgsOperation]: RequiredArgsFunction<O1>;
} & {
  [O2 in OptionalArgsOperation]: OptionalArgsFunction<O2>;
};
