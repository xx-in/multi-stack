import { loadRenderer, normalizeRendererName } from './load-renderer.ts';
import { extractSlots } from './slots.ts';
import type { Renderer } from './types.ts';

function rendererOn(component: object): string | null {
  const value = (component as { __islandRenderer?: unknown }).__islandRenderer;
  return typeof value === 'string' ? value : null;
}

function readProps(raw: string | null): Record<string, unknown> {
  const parsed = JSON.parse(raw || '{}') as unknown;
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('props 必须是 JSON 对象');
  }
  return parsed as Record<string, unknown>;
}

export class XIsland extends HTMLElement {
  private generation = 0;
  private view: Renderer | null = null;
  private observer: IntersectionObserver | null = null;
  private componentValue: object | null = null;
  private revealed = false;

  get component(): object | null {
    return this.componentValue;
  }

  set component(value: object | null) {
    if (typeof value === 'string') {
      this.fail(new Error('component 需要是 import 进来的组件'));
      return;
    }
    this.componentValue = value;
    if (this.isConnected) this.kick();
  }

  connectedCallback() {
    this.kick();
  }

  disconnectedCallback() {
    const generation = ++this.generation;
    this.observer?.disconnect();
    this.observer = null;
    this.revealed = false;
    const view = this.view;
    this.view = null;
    if (!view) return;
    queueMicrotask(() => {
      if (this.generation !== generation) return;
      view.unmount(this);
    });
  }

  private readOption(name: string): string | null {
    const attr = this.getAttribute(name);
    if (attr !== null) return attr;
    const value = (this as unknown as Record<string, unknown>)[name];
    return typeof value === 'string' ? value : null;
  }

  private kick() {
    if (!this.isConnected) return;
    const when = this.readOption('when') ?? 'load';
    if (when === 'visible') {
      this.watchVisible();
      return;
    }
    if (when !== 'load') {
      this.fail(new Error(`未知的 when：${when}`));
      return;
    }
    if (this.componentValue) void this.load();
  }

  private watchVisible() {
    if (this.revealed) {
      void this.load();
      return;
    }
    if (this.observer) return;
    this.observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        this.observer?.disconnect();
        this.observer = null;
        this.revealed = true;
        void this.load();
      },
      { rootMargin: this.readOption('root-margin') ?? '0px' },
    );
    this.observer.observe(this);
  }

  private async load() {
    const component = this.componentValue;
    if (!component) return;
    const token = ++this.generation;
    this.setAttribute('data-state', 'loading');
    const slots = extractSlots(this);
    try {
      const rendererName = normalizeRendererName(
        this.readOption('renderer') ?? rendererOn(component),
      );
      if (!rendererName) {
        throw new Error(`未知渲染器：${this.readOption('renderer') ?? ''}`);
      }
      const props = readProps(this.readOption('props'));
      const view = await loadRenderer(rendererName);
      if (token !== this.generation || !this.isConnected) return;
      this.replaceChildren();
      view.mount(this, component, props, slots);
      this.view = view;
      this.setAttribute('data-state', 'mounted');
    } catch (error) {
      if (token !== this.generation) return;
      this.fail(error);
    }
  }

  private fail(error: unknown) {
    this.setAttribute('data-state', 'error');
    console.error(error);
  }
}

if (!customElements.get('x-island')) {
  customElements.define('x-island', XIsland);
}
