import { routes } from '@/routes.ts';
import { normalizePath } from '@/core/path.ts';
import { paintPermissionControls } from '@/core/permissions.ts';

export const chromeTagName = 'x-nav';

const navItems = [
  { path: '/test', label: '测试' },
  { path: '/todos', label: '待办对比' },
  { path: '/guide', label: '路由' },
  { path: '/reports', label: '报表' },
  { path: '/admin', label: '管理' },
  { path: '/about', label: '关于' },
];

const THEME_KEY = 'island-theme';

const linkClass =
  'shrink-0 rounded-full px-3 py-1.5 text-zinc-600 hover:bg-white hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100';
const buttonClass =
  'rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200';

function isDark(): boolean {
  return document.documentElement.classList.contains('dark');
}

function syncThemeButtons(root: ParentNode): void {
  const dark = isDark();
  for (const button of root.querySelectorAll('button[data-theme]')) {
    button.textContent = dark ? '日间' : '夜间';
    button.setAttribute('aria-pressed', dark ? 'true' : 'false');
  }
}

function toggleTheme(root: ParentNode): void {
  const dark = !isDark();
  document.documentElement.classList.toggle('dark', dark);
  try {
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  } catch {
    // 隐私模式拒绝写入时，只保留当前这次的外观。
  }
  syncThemeButtons(root);
}

function markNav(root: ParentNode): void {
  const path = normalizePath(location.pathname);
  for (const anchor of root.querySelectorAll('a[data-nav]')) {
    if (!(anchor instanceof HTMLAnchorElement)) continue;
    if (normalizePath(anchor.pathname) === path) anchor.setAttribute('aria-current', 'page');
    else anchor.removeAttribute('aria-current');
  }
}

export class XNav extends HTMLElement {
  connectedCallback() {
    if (this.childElementCount > 0) {
      markNav(this);
      paintPermissionControls();
      syncThemeButtons(this);
      return;
    }
    const links = navItems
      .map((item) => {
        const bit = routes.find((route) => route.path === item.path)?.bit ?? 0;
        const bitAttr = bit ? ` data-bit="${bit}"` : '';
        return `<a data-nav${bitAttr} class="${linkClass}" href="${item.path}">${item.label}</a>`;
      })
      .join('');
    this.innerHTML = `
      <header class="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
        <div class="mx-auto grid h-16 w-full max-w-6xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4">
          <a href="/" class="shrink-0 text-lg font-semibold tracking-tight">Island</a>
          <nav class="flex items-center gap-1 overflow-x-auto text-sm whitespace-nowrap">${links}</nav>
          <div class="flex shrink-0 items-center gap-2 text-sm">
            <label class="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              权限
              <input
                data-permission-mask
                type="number"
                min="0"
                step="1"
                inputmode="numeric"
                class="w-20 rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-zinc-900 outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-100"
              />
            </label>
            <button type="button" data-theme aria-pressed="false" class="${buttonClass}">夜间</button>
          </div>
        </div>
      </header>
    `;
    this.querySelector('button[data-theme]')?.addEventListener('click', () => toggleTheme(this));
    markNav(this);
    paintPermissionControls();
    syncThemeButtons(this);
  }
}

if (!customElements.get(chromeTagName)) {
  customElements.define(chromeTagName, XNav);
}
