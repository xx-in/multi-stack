<script lang="ts">
  import { onMount } from 'svelte';
  import { bus } from '@island/bus';
  import type { Snippet } from 'svelte';

  let { children }: { children?: Snippet } = $props();
  let count = $state<number | null>(null);

  onMount(() =>
    bus.on('counter:changed', (payload) => {
      count = (payload as { count: number }).count;
    }),
  );
</script>

<div
  data-listener="svelte"
  class="rounded-2xl border border-emerald-200 bg-white p-4 dark:border-emerald-900 dark:bg-zinc-900"
>
  <p class="text-sm text-zinc-800 dark:text-zinc-200">Svelte 收到：{count ?? '尚无'}</p>
  <div class="mt-2 text-sm text-emerald-700 dark:text-emerald-300">{@render children?.()}</div>
</div>
