export function elementFromEvent(event: Event): Element | null {
  const node = event.composedPath()[0] ?? event.target;
  if (node instanceof Element) return node;
  if (node instanceof Node) return node.parentElement;
  return null;
}

export function deepActiveElement(): Element | null {
  let active: Element | null = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active;
}

export function queryAllDeep(selector: string, root: ParentNode = document): Element[] {
  const found = [...root.querySelectorAll(selector)];
  for (const el of root.querySelectorAll('*')) {
    if (el.shadowRoot) found.push(...queryAllDeep(selector, el.shadowRoot));
  }
  return found;
}
