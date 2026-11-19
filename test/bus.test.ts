import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createBus } from '../src/core/bus.ts';

test('订阅者按顺序收到事件，取消后不再收到', () => {
  const bus = createBus();
  const seen: unknown[] = [];
  const off = bus.on('counter:changed', (payload) => seen.push(payload));
  bus.emit('counter:changed', { count: 1 });
  off();
  bus.emit('counter:changed', { count: 2 });
  assert.deepEqual(seen, [{ count: 1 }]);
});

test('没有订阅者时 emit 不抛错', () => {
  const bus = createBus();
  assert.doesNotThrow(() => bus.emit('missing', 1));
});
