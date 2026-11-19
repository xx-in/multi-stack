<!-- vue2 -->
<script>
import { bus } from '@island/bus';

export default {
  data() {
    return { count: null, off() {} };
  },
  mounted() {
    this.off = bus.on('counter:changed', (payload) => {
      this.count = payload.count;
    });
  },
  beforeDestroy() {
    this.off();
  },
};
</script>

<template>
  <div
    data-listener="vue2"
    class="rounded-2xl border border-emerald-200 bg-white p-4 dark:border-emerald-900 dark:bg-zinc-900"
  >
    <p class="text-sm text-zinc-800 dark:text-zinc-200">
      Vue 2 收到：{{ count === null ? '尚无' : count }}
    </p>
    <div class="mt-2 text-sm text-emerald-700 dark:text-emerald-300">
      <slot />
    </div>
  </div>
</template>
