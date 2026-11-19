<script lang="ts">
export const title = '待办对比';
</script>

<script setup lang="ts">
import '@/components/AppHeader.ts';
import TodoListReact from './TodoList.tsx';
import TodoListSvelte from './TodoList.svelte';
import TodoListVue from './TodoList.vue';
import TodoListVue2 from './TodoListVue2.vue';
</script>

<template>
  <x-header>
    <section class="mx-auto w-full max-w-6xl space-y-4 px-4 py-6">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">待办对比</h1>
        <p class="mt-2 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
          React、Vue 3、Vue 2、Svelte
          各挂载一份功能相同的待办列表：添加、勾选、筛选、删除、清除已完成。四份列表的初始数据相同，状态互不影响。
        </p>
      </div>
      <div class="grid items-start gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <x-island :component="TodoListReact" renderer="react" />
        <x-island :component="TodoListVue" renderer="vue" />
        <x-island :component="TodoListVue2" renderer="vue2" />
        <x-island :component="TodoListSvelte" renderer="svelte" />
      </div>
    </section>
  </x-header>
</template>
