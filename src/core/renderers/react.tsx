import { createElement, type ComponentType, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { Renderer } from '@/core/types.ts';

const roots = new WeakMap<HTMLElement, Root>();

function StaticHtml({ html }: { html: string }) {
  return createElement('x-slot', { dangerouslySetInnerHTML: { __html: html } });
}

function slotNodes(slots: Record<string, string>): Record<string, ReactNode> {
  const nodes: Record<string, ReactNode> = {};
  for (const [name, html] of Object.entries(slots)) {
    if (!html) continue;
    nodes[name === 'default' ? 'children' : name] = createElement(StaticHtml, { html });
  }
  return nodes;
}

export const mount: Renderer['mount'] = (el, Component, props, slots) => {
  const root = createRoot(el);
  roots.set(el, root);
  root.render(
    createElement(Component as ComponentType<Record<string, unknown>>, {
      ...props,
      ...slotNodes(slots),
    }),
  );
};

export const unmount: Renderer['unmount'] = (el) => {
  const root = roots.get(el);
  if (!root) return;
  root.unmount();
  roots.delete(el);
};
