import assert from 'node:assert/strict';
import { test } from 'node:test';
import { rendererNameFromModule } from '../src/core/load-renderer.ts';
import { isVue2Source } from '../src/core/vue-version.ts';

test('文件开头的标记表示 Vue 2', () => {
  assert.equal(isVue2Source('<!-- vue2 -->\n<template></template>'), true);
  assert.equal(isVue2Source('\n<!--vue2-->\n<script></script>'), true);
  assert.equal(isVue2Source('<template>\n<!-- vue2 -->\n</template>'), false);
  assert.equal(isVue2Source('<template><p>Vue 3</p></template>'), false);
});

test('模块标记优先于文件后缀', () => {
  assert.equal(rendererNameFromModule('/src/pages/todos/TodoListVue2.vue', 'vue2'), 'vue2');
  assert.equal(rendererNameFromModule('/src/pages/todos/index.vue', 'vue3'), 'vue');
  assert.equal(rendererNameFromModule('/src/pages/todos/index.vue'), 'vue');
  assert.equal(rendererNameFromModule('/src/pages/about/index.svelte'), 'svelte');
  assert.equal(rendererNameFromModule('/src/pages/test/index.tsx'), 'react');
});
