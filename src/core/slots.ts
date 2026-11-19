export function extractSlots(el: HTMLElement): Record<string, string> {
  const buckets = new Map<string, string[]>();
  const add = (name: string, html: string) => {
    const list = buckets.get(name) ?? [];
    list.push(html);
    buckets.set(name, list);
  };

  for (const node of el.childNodes) {
    if (node instanceof HTMLElement && node.hasAttribute('slot')) {
      const name = node.getAttribute('slot') || 'default';
      node.removeAttribute('slot');
      add(name, node.outerHTML);
    } else if (node instanceof Element) {
      add('default', node.outerHTML);
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? '';
      if (text.trim()) add('default', text);
    }
  }

  return Object.fromEntries([...buckets].map(([name, parts]) => [name, parts.join('')]));
}
