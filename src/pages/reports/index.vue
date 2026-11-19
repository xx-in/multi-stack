<!-- vue2 -->
<script>
import '@/components/AppHeader.ts';
import GuardNoteReact from '@/pages/admin/GuardNote.tsx';
import GuardNoteSvelte from '@/pages/admin/GuardNote.svelte';
import GuardNoteVue from '@/pages/admin/GuardNote.vue';
import GuardNoteVue2 from '@/pages/admin/GuardNoteVue2.vue';

export const title = '报表';

export default {
  data() {
    return { GuardNoteReact, GuardNoteVue, GuardNoteVue2, GuardNoteSvelte };
  },
};
</script>

<template>
  <x-header>
    <section class="mx-auto w-full max-w-6xl space-y-4 px-4 py-6">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">报表</h1>
        <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          这个页面是 Vue 2。/reports 占权限位
          1。权限数字包含这一位时，下面四块说明页面组件已经挂载。
        </p>
      </div>
      <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <x-island
          :component="GuardNoteReact"
          renderer="react"
          props='{"label":"React 报表块已挂载"}'
        ></x-island>
        <x-island
          :component="GuardNoteVue"
          renderer="vue"
          props='{"label":"Vue 3 报表块已挂载"}'
        ></x-island>
        <x-island
          :component="GuardNoteVue2"
          renderer="vue2"
          props='{"label":"Vue 2 报表块已挂载"}'
        ></x-island>
        <x-island
          :component="GuardNoteSvelte"
          renderer="svelte"
          props='{"label":"Svelte 报表块已挂载"}'
        ></x-island>
      </div>
    </section>
  </x-header>
</template>
