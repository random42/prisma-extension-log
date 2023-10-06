import assert from 'node:assert';
import test from 'node:test';
// import extension from '../src';

test('extension', { only: true }, async (t) => {
  t.test('some', () => {
    assert(true);
  });
});
