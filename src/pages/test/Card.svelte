<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children, header }: { children?: Snippet; header?: Snippet } = $props();
</script>

<article
  data-panel="svelte"
  class="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
>
  <h2 class="text-base font-semibold">{@render header?.()}</h2>
  <div class="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{@render children?.()}</div>
</article>
