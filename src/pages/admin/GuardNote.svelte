<script lang="ts">
  let { label = '' }: { label?: string } = $props();
</script>

<p
  data-guard={label}
  class="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"
>
  {label}
</p>
