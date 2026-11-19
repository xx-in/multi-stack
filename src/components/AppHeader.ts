import { chromeTagName } from './AppNav.ts';

const layout = new CSSStyleSheet();
layout.replaceSync(`
  :host {
    display: block;
    height: 100%;
    min-height: 0;
    overflow: hidden;
  }
  .shell {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    color-scheme: light;
  }
  .shell.dark {
    color-scheme: dark;
  }
  .chrome {
    flex: none;
  }
  .body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
  }
  ${chromeTagName} {
    display: block;
  }
`);

let sharedSheets: CSSStyleSheet[] | null = null;

function documentSheets(): CSSStyleSheet[] {
  if (sharedSheets) return sharedSheets;
  const copies: CSSStyleSheet[] = [];
  for (const sheet of document.styleSheets) {
    try {
      const text = [...sheet.cssRules].map((rule) => rule.cssText).join('\n');
      const copy = new CSSStyleSheet();
      copy.replaceSync(text);
      copies.push(copy);
    } catch {
      // 读不到的样式表不影响壳子里的导航。
    }
  }
  sharedSheets = copies;
  return copies;
}

function mirrorDark(shell: HTMLElement): void {
  shell.classList.toggle('dark', document.documentElement.classList.contains('dark'));
}

export class XHeader extends HTMLElement {
  private stopWatchingTheme: (() => void) | null = null;

  connectedCallback() {
    if (this.shadowRoot) return;
    const root = this.attachShadow({ mode: 'open' });
    root.adoptedStyleSheets = [...documentSheets(), layout];
    const shell = document.createElement('div');
    shell.className = 'shell';
    const chrome = document.createElement('div');
    chrome.className = 'chrome';
    chrome.append(document.createElement(chromeTagName));
    const body = document.createElement('div');
    body.className = 'body';
    body.append(document.createElement('slot'));
    shell.append(chrome, body);
    root.append(shell);
    mirrorDark(shell);
    const theme = new MutationObserver(() => mirrorDark(shell));
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    this.stopWatchingTheme = () => theme.disconnect();
  }

  disconnectedCallback() {
    this.stopWatchingTheme?.();
    this.stopWatchingTheme = null;
  }
}

if (!customElements.get('x-header')) {
  customElements.define('x-header', XHeader);
}
