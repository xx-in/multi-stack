<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { bus } from '@island/bus';

const count = ref<number | null>(null);
let off = () => {};

onMounted(() => {
  off = bus.on('counter:changed', (payload) => {
    count.value = (payload as { count: number }).count;
  });
});

onUnmounted(() => {
  off();
});
</script>

<template>
  <div
    data-listener="vue"
    class="rounded-2xl border border-emerald-200 bg-white p-4 dark:border-emerald-900 dark:bg-zinc-900"
  >
    <p class="text-sm text-zinc-800 dark:text-zinc-200">Vue 3 收到：{{ count ?? '尚无' }}</p>
    <div class="mt-2 text-sm text-emerald-700 dark:text-emerald-300">
      <slot />
    </div>
  </div>
</template>
