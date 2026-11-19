const loadingTitle = '加载中';

export function formatTitle(title?: string): string {
  const name = title?.trim();
  return name || loadingTitle;
}

export function applyTitle(title?: string): void {
  document.title = formatTitle(title);
}
