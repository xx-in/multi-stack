<script lang="ts" module>
  export const title = '管理';
</script>

<script lang="ts">
  import '@/components/AppHeader.ts';
  import GuardNoteReact from './GuardNote.tsx';
  import GuardNoteSvelte from './GuardNote.svelte';
  import GuardNoteVue from './GuardNote.vue';
  import GuardNoteVue2 from './GuardNoteVue2.vue';
</script>

<x-header>
  <section class="mx-auto w-full max-w-6xl space-y-4 px-4 py-6">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">管理</h1>
      <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        /admin 占权限位 2。权限数字未包含这一位时，这个页面组件不会挂载。
      </p>
    </div>
    <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <x-island component={GuardNoteReact} renderer="react" props={'{"label":"React 管理块已挂载"}'}
      ></x-island>
      <x-island component={GuardNoteVue} renderer="vue" props={'{"label":"Vue 3 管理块已挂载"}'}
      ></x-island>
      <x-island component={GuardNoteVue2} renderer="vue2" props={'{"label":"Vue 2 管理块已挂载"}'}
      ></x-island>
      <x-island
        component={GuardNoteSvelte}
        renderer="svelte"
        props={'{"label":"Svelte 管理块已挂载"}'}
      ></x-island>
    </div>
  </section>
</x-header>
