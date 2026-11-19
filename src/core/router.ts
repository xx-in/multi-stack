import { routes } from '@/routes.ts';
import { loadRenderer, rendererNameFromModule } from './load-renderer.ts';
import { isGuardedPath, normalizePath, resolveRoute } from './path.ts';
import { can, onPermissionsChanged } from './permissions.ts';
import { elementFromEvent, queryAllDeep } from './dom.ts';
import { applyTitle } from './title.ts';
import type { Renderer, RendererName } from './types.ts';

const pages = import.meta.glob('/src/pages/**/*.{tsx,vue,svelte}');

let generation = 0;
let mounted: Renderer | null = null;

type PageModule = {
  default: unknown;
  title?: string;
  renderer?: string;
};

type PageView = {
  component: unknown;
  rendererName: RendererName;
  props: Record<string, unknown>;
  title?: string;
};

function outlet(): HTMLElement | null {
  const node = document.querySelector('#outlet');
  return node instanceof HTMLElement ? node : null;
}

async function notFoundView(path: string): Promise<PageView> {
  const mod = await import('./system/NotFound.tsx');
  return { component: mod.default, rendererName: 'react', props: { path }, title: mod.title };
}

async function viewFor(path: string): Promise<PageView> {
  const decision = resolveRoute(path, Object.keys(pages), routes, can);
  if (decision.kind === 'static') {
    const load = pages[decision.key] as (() => Promise<PageModule>) | undefined;
    if (!load) return notFoundView(path);
    const mod = await load();
    const rendererName = rendererNameFromModule(decision.key, mod.renderer);
    if (!rendererName) return notFoundView(path);
    return { component: mod.default, rendererName, props: {}, title: mod.title };
  }
  if (decision.kind === 'forbidden') {
    const mod = await import('./system/Forbidden.tsx');
    return {
      component: mod.default,
      rendererName: 'react',
      props: { path, bit: decision.bit },
      title: mod.title,
    };
  }
  return notFoundView(path);
}

function markCurrentNav(path: string): void {
  for (const anchor of queryAllDeep('a[data-nav]')) {
    if (!(anchor instanceof HTMLAnchorElement)) continue;
    if (normalizePath(anchor.pathname) === path) anchor.setAttribute('aria-current', 'page');
    else anchor.removeAttribute('aria-current');
  }
}

export async function renderPath(pathname: string): Promise<void> {
  const token = ++generation;
  const path = normalizePath(pathname);

  let view: PageView;
  try {
    view = await viewFor(path);
  } catch (error) {
    console.error(error);
    view = await notFoundView(path);
  }

  const renderer = await loadRenderer(view.rendererName);
  if (token !== generation) return;
  applyTitle(view.title);
  const root = outlet();
  if (!root) return;
  mounted?.unmount(root);
  mounted = null;
  root.replaceChildren();
  renderer.mount(root, view.component, view.props, {});
  mounted = renderer;
  markCurrentNav(path);
}

export function startRouter(): void {
  const go = () => {
    void renderPath(location.pathname);
  };

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = elementFromEvent(event);
    if (!target) return;
    const anchor = target.closest('a');
    if (!(anchor instanceof HTMLAnchorElement)) return;
    if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;
    if (anchor.origin !== location.origin) return;
    const href = anchor.getAttribute('href');
    if (!href || !href.startsWith('/') || href.startsWith('//')) return;
    event.preventDefault();
    const next = `${anchor.pathname}${anchor.search}${anchor.hash}`;
    const current = `${location.pathname}${location.search}${location.hash}`;
    if (current !== next) history.pushState(null, '', next);
    go();
  });

  window.addEventListener('popstate', go);
  onPermissionsChanged(() => {
    if (isGuardedPath(location.pathname, Object.keys(pages), routes)) go();
  });
  go();
}
