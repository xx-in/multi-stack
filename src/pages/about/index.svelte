<script lang="ts" module>
  export const title = '关于';
</script>

<script lang="ts">
  import '@/components/AppHeader.ts';
  import Counter from '@/components/Counter.tsx';
</script>

<x-header>
  <section class="mx-auto w-full max-w-6xl space-y-4 px-4 py-6">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">关于</h1>
      <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        换页后 /test 的孤岛已经卸载。地址是 /about，刷新后仍由同一份 index.html 接管。
      </p>
    </div>
    <x-island component={Counter} renderer="react" props={'{"start":10}'}></x-island>
  </section>
</x-header>
