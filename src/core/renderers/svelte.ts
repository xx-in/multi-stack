import { createRawSnippet, mount as svelteMount, unmount as svelteUnmount } from 'svelte';
import type { Renderer } from '@/core/types.ts';

const instances = new WeakMap<HTMLElement, Record<string, unknown>>();

export const mount: Renderer['mount'] = (el, Component, props, slots) => {
  const slotProps: Record<string, unknown> = { ...props };
  for (const [name, html] of Object.entries(slots)) {
    if (!html) continue;
    slotProps[name === 'default' ? 'children' : name] = createRawSnippet(() => ({
      render: () => `<x-slot>${html}</x-slot>`,
    }));
  }
  const instance = svelteMount(Component as never, { target: el, props: slotProps });
  instances.set(el, instance as Record<string, unknown>);
};

export const unmount: Renderer['unmount'] = (el) => {
  const instance = instances.get(el);
  if (!instance) return;
  svelteUnmount(instance as never);
  instances.delete(el);
};
