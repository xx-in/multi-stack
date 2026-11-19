export type RouteGuard = {
  path: string;
  bit?: number;
};

export type RouteDecision =
  { kind: 'static'; key: string } | { kind: 'forbidden'; bit: number } | { kind: 'not-found' };

export function normalizePath(pathname: string): string {
  const raw = pathname.trim() || '/';
  const withSlash = raw.startsWith('/') ? raw : `/${raw}`;
  const pathOnly = withSlash.split('?')[0]?.split('#')[0] || '/';
  if (pathOnly.length > 1 && pathOnly.endsWith('/')) return pathOnly.slice(0, -1);
  return pathOnly || '/';
}

const pageExtensions = ['tsx', 'vue', 'svelte'] as const;

export function staticPageKeys(path: string): string[] {
  const normalized = normalizePath(path);
  const base = normalized === '/' ? '/src/pages/index/index' : `/src/pages${normalized}/index`;
  return pageExtensions.map((ext) => `${base}.${ext}`);
}

export function resolveRoute(
  pathname: string,
  staticKeys: readonly string[],
  guards: readonly RouteGuard[],
  allowed: (bit: number) => boolean,
): RouteDecision {
  const path = normalizePath(pathname);
  const staticKey = staticPageKeys(path).find((key) => staticKeys.includes(key));
  if (!staticKey) return { kind: 'not-found' };

  const guard = guards.find((route) => normalizePath(route.path) === path);
  if (guard?.bit && !allowed(guard.bit)) {
    return { kind: 'forbidden', bit: guard.bit };
  }
  return { kind: 'static', key: staticKey };
}

export function isGuardedPath(
  pathname: string,
  staticKeys: readonly string[],
  guards: readonly RouteGuard[],
): boolean {
  const path = normalizePath(pathname);
  if (!staticPageKeys(path).some((key) => staticKeys.includes(key))) return false;
  const guard = guards.find((route) => normalizePath(route.path) === path);
  return Boolean(guard?.bit);
}
