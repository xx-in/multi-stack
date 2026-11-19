import { deepActiveElement, elementFromEvent, queryAllDeep } from './dom.ts';

export type PermissionMask = {
  can(bit: number): boolean;
  set(mask: number): void;
  value(): number;
};

function normalizeMask(value: number): number {
  if (!Number.isSafeInteger(value) || value < 0) return 0;
  return value;
}

export function createPermissionMask(initial = 0): PermissionMask {
  let mask = normalizeMask(initial);
  return {
    can(bit) {
      if (!bit) return true;
      return (mask & bit) === bit;
    },
    set(next) {
      mask = normalizeMask(next);
    },
    value() {
      return mask;
    },
  };
}

const STORAGE_KEY = 'island-permissions';
const store = createPermissionMask();
const listeners = new Set<() => void>();

function readStored(): number {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    return normalizeMask(Number(raw));
  } catch {
    return 0;
  }
}

function persist(): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, String(store.value()));
  } catch {
    // 隐私模式拒绝写入时，权限只留在当前内存里。
  }
}

function notify(): void {
  for (const listener of listeners) listener();
}

export function can(bit: number): boolean {
  return store.can(bit);
}

export function setPermissionMask(mask: number): void {
  store.set(mask);
  persist();
  notify();
}

export function onPermissionsChanged(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function paintPermissionControls(): void {
  const mask = store.value();
  const active = deepActiveElement();
  for (const input of queryAllDeep('input[data-permission-mask]')) {
    if (!(input instanceof HTMLInputElement)) continue;
    if (active === input) continue;
    input.value = String(mask);
  }
  for (const anchor of queryAllDeep('a[data-bit]')) {
    if (!(anchor instanceof HTMLAnchorElement)) continue;
    const bit = Number(anchor.dataset.bit);
    anchor.hidden = !store.can(bit);
  }
}

export function startPermissionControls(): void {
  store.set(readStored());

  document.addEventListener('input', (event) => {
    const target = elementFromEvent(event);
    if (!(target instanceof HTMLInputElement)) return;
    if (!target.matches('input[data-permission-mask]')) return;
    const raw = target.value.trim();
    if (raw === '') {
      setPermissionMask(0);
      return;
    }
    const mask = Number(raw);
    if (!Number.isSafeInteger(mask) || mask < 0) return;
    setPermissionMask(mask);
  });

  onPermissionsChanged(paintPermissionControls);
  paintPermissionControls();
}
