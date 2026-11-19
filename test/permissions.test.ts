import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createPermissionMask } from '../src/core/permissions.ts';

test('按二进制位判断权限', () => {
  const perms = createPermissionMask(0);
  assert.equal(perms.can(1), false);
  assert.equal(perms.can(2), false);
  perms.set(1);
  assert.equal(perms.can(1), true);
  assert.equal(perms.can(2), false);
  perms.set(3);
  assert.equal(perms.can(1), true);
  assert.equal(perms.can(2), true);
  assert.equal(perms.value(), 3);
});

test('没有要求的位默认可访问', () => {
  const perms = createPermissionMask(0);
  assert.equal(perms.can(0), true);
});

test('非法数字当作没有权限', () => {
  const perms = createPermissionMask(Number.NaN);
  assert.equal(perms.value(), 0);
  perms.set(-1);
  assert.equal(perms.value(), 0);
  assert.equal(perms.can(1), false);
});
