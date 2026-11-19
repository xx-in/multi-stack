import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createPermissionMask } from '../src/core/permissions.ts';
import { isGuardedPath, normalizePath, resolveRoute, staticPageKeys } from '../src/core/path.ts';

const staticKeys = [
  '/src/pages/index/index.tsx',
  '/src/pages/todos/index.vue',
  '/src/pages/todos/TodoList.tsx',
  '/src/pages/about/index.svelte',
  '/src/pages/guide/index.vue',
  '/src/pages/reports/index.vue',
  '/src/pages/admin/index.svelte',
];

const guards = [
  { path: '/admin', bit: 2 },
  { path: '/reports', bit: 1 },
];

test('只把 index 文件解析成路由键', () => {
  assert.deepEqual(staticPageKeys('/'), [
    '/src/pages/index/index.tsx',
    '/src/pages/index/index.vue',
    '/src/pages/index/index.svelte',
  ]);
  assert.deepEqual(staticPageKeys('/about'), [
    '/src/pages/about/index.tsx',
    '/src/pages/about/index.vue',
    '/src/pages/about/index.svelte',
  ]);
  assert.deepEqual(staticPageKeys('/guide/'), [
    '/src/pages/guide/index.tsx',
    '/src/pages/guide/index.vue',
    '/src/pages/guide/index.svelte',
  ]);
});

test('pathname 去掉 query 和末尾斜杠', () => {
  assert.equal(normalizePath(''), '/');
  assert.equal(normalizePath('/about'), '/about');
  assert.equal(normalizePath('/about/'), '/about');
  assert.equal(normalizePath('/about?x=1'), '/about');
});

test('没有权限要求的页面按目录挂载', () => {
  const decision = resolveRoute('/about', staticKeys, guards, () => false);
  assert.deepEqual(decision, { kind: 'static', key: '/src/pages/about/index.svelte' });
});

test('同目录里的非 index 文件不是路由', () => {
  assert.deepEqual(
    resolveRoute('/todos', staticKeys, [], () => true),
    {
      kind: 'static',
      key: '/src/pages/todos/index.vue',
    },
  );
  assert.deepEqual(
    resolveRoute('/todos/TodoList', staticKeys, [], () => true),
    {
      kind: 'not-found',
    },
  );
});

test('受保护页面未授权时不挂载', () => {
  const decision = resolveRoute('/admin', staticKeys, guards, () => false);
  assert.deepEqual(decision, { kind: 'forbidden', bit: 2 });
  assert.equal(isGuardedPath('/admin', staticKeys, guards), true);
});

test('受保护页面授权后按文件挂载', () => {
  const perms = createPermissionMask(2);
  const decision = resolveRoute('/admin/', staticKeys, guards, perms.can);
  assert.deepEqual(decision, { kind: 'static', key: '/src/pages/admin/index.svelte' });
});

test('没有写进权限表的页面默认可访问', () => {
  assert.equal(isGuardedPath('/about', staticKeys, guards), false);
  assert.equal(isGuardedPath('/guide', staticKeys, []), false);
});

test('没有页面文件时找不到', () => {
  assert.deepEqual(
    resolveRoute('/missing', staticKeys, [{ path: '/missing', bit: 2 }], () => false),
    { kind: 'not-found' },
  );
  assert.equal(isGuardedPath('/missing', staticKeys, guards), false);
});
