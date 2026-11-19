<script lang="ts">
export const title = '路由';
</script>

<script setup lang="ts">
import '@/components/AppHeader.ts';
</script>

<template>
  <x-header>
    <article class="mx-auto w-full max-w-3xl px-4 py-10">
      <header class="border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400">文档</p>
        <h1 class="mt-2 text-3xl font-semibold tracking-tight">路由</h1>
        <p class="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-400">
          这里说明页面文件怎么对应到地址，以及权限和顶栏怎么接上。本页是
          <code class="doc-code">src/pages/guide/index.vue</code>，地址是
          <code class="doc-code">/guide</code>。
        </p>
      </header>

      <section class="mt-8">
        <h2 class="text-xl font-semibold tracking-tight">页面文件</h2>
        <p class="mt-3 text-base leading-7 text-zinc-700 dark:text-zinc-300">
          只有名为 <code class="doc-code">index.tsx</code>、<code class="doc-code">index.vue</code>
          或
          <code class="doc-code">index.svelte</code>
          的文件会成为路由。同一目录里的其他文件是这个页面自己的组件，不会变成路由。多个页面共用的组件放在
          <code class="doc-code">src/components</code>。
        </p>
        <p class="mt-3 text-base leading-7 text-zinc-700 dark:text-zinc-300">
          页面可以导出
          <code class="doc-code">title</code
          >。导出的字符串就是标签页的完整标题。没有导出时显示「加载中」。
        </p>
        <div class="mt-4 overflow-x-auto">
          <table class="w-full border-collapse text-left text-sm">
            <thead>
              <tr
                class="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400"
              >
                <th class="py-2 pr-4 font-medium">地址</th>
                <th class="py-2 pr-4 font-medium">文件</th>
                <th class="py-2 font-medium">页面</th>
              </tr>
            </thead>
            <tbody class="text-zinc-800 dark:text-zinc-200">
              <tr class="border-b border-zinc-100 dark:border-zinc-800">
                <td class="py-2 pr-4"><code class="doc-code">/</code></td>
                <td class="py-2 pr-4">
                  <code class="doc-code">src/pages/index/index.svelte</code>
                </td>
                <td class="py-2">Svelte</td>
              </tr>
              <tr class="border-b border-zinc-100 dark:border-zinc-800">
                <td class="py-2 pr-4"><code class="doc-code">/test</code></td>
                <td class="py-2 pr-4"><code class="doc-code">src/pages/test/index.tsx</code></td>
                <td class="py-2">React</td>
              </tr>
              <tr class="border-b border-zinc-100 dark:border-zinc-800">
                <td class="py-2 pr-4"><code class="doc-code">/todos</code></td>
                <td class="py-2 pr-4"><code class="doc-code">src/pages/todos/index.vue</code></td>
                <td class="py-2">Vue 3</td>
              </tr>
              <tr class="border-b border-zinc-100 dark:border-zinc-800">
                <td class="py-2 pr-4"><code class="doc-code">/guide</code></td>
                <td class="py-2 pr-4"><code class="doc-code">src/pages/guide/index.vue</code></td>
                <td class="py-2">Vue 3</td>
              </tr>
              <tr class="border-b border-zinc-100 dark:border-zinc-800">
                <td class="py-2 pr-4"><code class="doc-code">/reports</code></td>
                <td class="py-2 pr-4"><code class="doc-code">src/pages/reports/index.vue</code></td>
                <td class="py-2">Vue 2</td>
              </tr>
              <tr class="border-b border-zinc-100 dark:border-zinc-800">
                <td class="py-2 pr-4"><code class="doc-code">/admin</code></td>
                <td class="py-2 pr-4">
                  <code class="doc-code">src/pages/admin/index.svelte</code>
                </td>
                <td class="py-2">Svelte</td>
              </tr>
              <tr>
                <td class="py-2 pr-4"><code class="doc-code">/about</code></td>
                <td class="py-2 pr-4">
                  <code class="doc-code">src/pages/about/index.svelte</code>
                </td>
                <td class="py-2">Svelte</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="mt-10">
        <h2 class="text-xl font-semibold tracking-tight">框架</h2>
        <ul
          class="mt-3 list-disc space-y-2 pl-5 text-base leading-7 text-zinc-700 dark:text-zinc-300"
        >
          <li>
            React 使用 <code class="doc-code">.tsx</code>，孤岛写
            <code class="doc-code">renderer="react"</code>。
          </li>
          <li>
            Vue 3 使用 <code class="doc-code">.vue</code>，孤岛写
            <code class="doc-code">renderer="vue"</code>。
          </li>
          <li>
            Vue 2 也使用 <code class="doc-code">.vue</code>，文件开头写
            <code class="doc-code">&lt;!-- vue2 --&gt;</code>。孤岛写
            <code class="doc-code">renderer="vue2"</code>。报表页就是这样一份 Vue 2 页面。
          </li>
          <li>
            Svelte 使用 <code class="doc-code">.svelte</code>，孤岛写
            <code class="doc-code">renderer="svelte"</code>。
          </li>
        </ul>
        <p class="mt-3 text-base leading-7 text-zinc-700 dark:text-zinc-300">
          /test 的计数只有一个。总线、插槽和视口是四个框架各一份。报表和管理上的说明块也是。
        </p>
      </section>

      <section class="mt-10">
        <h2 class="text-xl font-semibold tracking-tight">权限</h2>
        <p class="mt-3 text-base leading-7 text-zinc-700 dark:text-zinc-300">
          <code class="doc-code">src/routes.ts</code>
          只列出需要控制的页面，每条占一个二进制位。顶栏的权限数字按位包含该位时才显示菜单并打开页面。没有写在这里的路由默认可访问。没有对应位时不会加载页面，里面的组件也不会挂载。
        </p>
        <div class="mt-4 overflow-x-auto">
          <table class="w-full max-w-md border-collapse text-left text-sm">
            <thead>
              <tr
                class="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400"
              >
                <th class="py-2 pr-4 font-medium">页面</th>
                <th class="py-2 font-medium">二进制位</th>
              </tr>
            </thead>
            <tbody class="text-zinc-800 dark:text-zinc-200">
              <tr class="border-b border-zinc-100 dark:border-zinc-800">
                <td class="py-2 pr-4">报表 <code class="doc-code">/reports</code></td>
                <td class="py-2">1</td>
              </tr>
              <tr>
                <td class="py-2 pr-4">管理 <code class="doc-code">/admin</code></td>
                <td class="py-2">2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="mt-10">
        <h2 class="text-xl font-semibold tracking-tight">导航</h2>
        <p class="mt-3 text-base leading-7 text-zinc-700 dark:text-zinc-300">
          顶栏壳子是
          <code class="doc-code">src/components/AppHeader.ts</code
          >。需要顶栏的页面导入它，把正文写进
          <code class="doc-code">&lt;x-header&gt;</code
          >。壳子固定在上方，只有这段插槽可以垂直滚动。导航是子组件
          <code class="doc-code">src/components/AppNav.ts</code>，链接和上面的路由一致，包含
          <code class="doc-code">/test</code>。以后可以换成别的子组件。不导入壳子的页面不显示顶栏。
        </p>
      </section>
    </article>
  </x-header>
</template>

<style scoped>
.doc-code {
  border-radius: 0.25rem;
  background: var(--color-zinc-100);
  padding: 0.125rem 0.375rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.875em;
  color: var(--color-zinc-800);
}

:global(html.dark) .doc-code {
  background: var(--color-zinc-800);
  color: var(--color-zinc-100);
}
</style>
