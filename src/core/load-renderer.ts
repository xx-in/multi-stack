import type { Renderer, RendererName } from './types.ts';

const loaders: Record<RendererName, () => Promise<Renderer>> = {
  react: () => import('./renderers/react.tsx') as Promise<Renderer>,
  vue: () => import('./renderers/vue.ts') as Promise<Renderer>,
  vue2: () => import('./renderers/vue2.ts') as Promise<Renderer>,
  svelte: () => import('./renderers/svelte.ts') as Promise<Renderer>,
};

export function loadRenderer(name: RendererName): Promise<Renderer> {
  return loaders[name]();
}

export function normalizeRendererName(value: string | null | undefined): RendererName | null {
  if (value === 'vue3') return 'vue';
  if (value === 'react' || value === 'vue' || value === 'vue2' || value === 'svelte') return value;
  return null;
}

export function rendererNameFromPath(file: string): RendererName | null {
  const clean = file.split('?')[0] ?? file;
  if (clean.endsWith('.vue')) return 'vue';
  if (clean.endsWith('.svelte')) return 'svelte';
  if (clean.endsWith('.tsx') || clean.endsWith('.jsx')) return 'react';
  return null;
}

export function rendererNameFromModule(file: string, renderer?: string): RendererName | null {
  return normalizeRendererName(renderer) ?? rendererNameFromPath(file);
}
