export type RendererName = 'react' | 'vue' | 'vue2' | 'svelte';

export type Renderer = {
  mount(
    el: HTMLElement,
    Component: unknown,
    props: Record<string, unknown>,
    slots: Record<string, string>,
  ): void;
  unmount(el: HTMLElement): void;
};
