import { PrismaClient } from '@prisma/client';
import assert from 'node:assert/strict';
import test, { mock } from 'node:test';
import extension, { LogData, LogFunction } from '../src';

test('extension', { only: true }, async (t) => {
  type Options = {
    my: 'options';
  };
  const fn = mock.fn();
  const prisma = new PrismaClient().$extends(
    extension({
      log: fn as LogFunction<Options>,
    })
  );
  await t.test('logging', async () => {
    // clear table
    await prisma.user.deleteMany();
    const user = await prisma.user.create({
      data: {
        name: 'jim',
      },
    });
    const findManyArgs = {
      take: 10,
      orderBy: {
        name: 'desc',
      },
    } as const;
    await prisma.user.findMany({
      log: {
        my: 'options',
      },
      ...findManyArgs,
    });
    await prisma.user.findFirst();
    await prisma.user.findFirstOrThrow();
    await prisma.user.findUnique({ where: { id: user.id } });
    try {
      await prisma.user.findUniqueOrThrow({ where: { id: user.id + 1 } });
    } catch (err) {}
    await prisma.user.upsert({
      create: {
        name: 'a',
      },
      update: {
        name: 'b',
      },
      where: {
        id: user.id,
      },
    });
    await prisma.user.count();
    await prisma.user.aggregate({
      _max: {
        id: true,
      },
    });
    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });
    await prisma.user.groupBy({
      _count: {
        name: true,
      },
      by: 'id',
    });
    // no log
    await prisma.user.count({
      log: false,
    });
    const { calls } = fn.mock;
    assert(calls.length === 12);
    calls.forEach((call) => {
      const data: LogData = call.arguments[0];
      assert(data);
      assert(data.model === 'User');
      assert(typeof data.args === 'object');
      assert(typeof data.operation === 'string');
      assert(typeof data.time === 'number');
    });
    const findManyCall = calls[2];
    assert.deepEqual(findManyCall.arguments[1], {
      my: 'options',
    });
    assert.deepEqual(findManyCall.arguments[0].args, findManyArgs);
    const errorCall = calls[6];
    const errorCallData = errorCall.arguments[0] as LogData;
    assert(errorCallData.operation === 'findUniqueOrThrow');
    assert(errorCallData.result === undefined);
    assert(errorCallData.error);
  });
});
