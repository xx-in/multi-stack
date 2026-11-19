<!-- vue2 -->
<script>
export default {};
</script>

<template>
  <section
    data-panel="vue2"
    class="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
  >
    <h2 class="text-base font-semibold"><slot name="header" /></h2>
    <div class="mt-2 text-sm text-zinc-700 dark:text-zinc-300"><slot /></div>
  </section>
</template>
