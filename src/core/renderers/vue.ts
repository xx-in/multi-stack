import { createApp, defineComponent, h, type App, type Component } from 'vue';
import type { Renderer } from '@/core/types.ts';

const apps = new WeakMap<HTMLElement, App>();

const StaticHtml = defineComponent({
  props: { html: { type: String, required: true } },
  setup(props) {
    return () => h('x-slot', { innerHTML: props.html });
  },
});

export const mount: Renderer['mount'] = (el, Component, props, slots) => {
  const vueSlots: Record<string, () => unknown> = {};
  for (const [name, html] of Object.entries(slots)) {
    if (!html) continue;
    vueSlots[name] = () => h(StaticHtml, { html });
  }
  const app = createApp({
    render: () => h(Component as Component, props, vueSlots),
  });
  app.mount(el);
  apps.set(el, app);
};

export const unmount: Renderer['unmount'] = (el) => {
  const app = apps.get(el);
  if (!app) return;
  app.unmount();
  apps.delete(el);
};
