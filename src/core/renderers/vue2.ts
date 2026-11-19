import Vue, { type CreateElement, type VNode } from 'vue2';
import type { Renderer } from '@/core/types.ts';

type VueHost = { $destroy(): void; $el: Element };

const hosts = new WeakMap<HTMLElement, VueHost>();
let prepared = false;

function prepareVue2(): void {
  if (prepared) return;
  prepared = true;
  Vue.config.productionTip = false;
  Vue.config.ignoredElements = [...Vue.config.ignoredElements, /^x-/];
}

const StaticHtml = {
  props: { html: { type: String, required: true } },
  render(this: { html: string }, h: CreateElement): VNode {
    return h('x-slot', { domProps: { innerHTML: this.html } });
  },
};

function slotNodes(h: CreateElement, slots: Record<string, string>): VNode[] {
  const nodes: VNode[] = [];
  for (const [name, html] of Object.entries(slots)) {
    if (!html) continue;
    const data = name === 'default' ? { props: { html } } : { props: { html }, slot: name };
    nodes.push(h(StaticHtml, data));
  }
  return nodes;
}

export const mount: Renderer['mount'] = (el, Component, props, slots) => {
  prepareVue2();
  const vm = new Vue({
    render(h) {
      return h(Component as typeof StaticHtml, { props }, slotNodes(h, slots));
    },
  }).$mount();
  el.appendChild(vm.$el);
  hosts.set(el, vm);
};

export const unmount: Renderer['unmount'] = (el) => {
  const vm = hosts.get(el);
  if (!vm) return;
  vm.$destroy();
  hosts.delete(el);
  el.replaceChildren();
};
