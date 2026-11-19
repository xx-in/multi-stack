/// <reference types="vite/client" />

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'x-header': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        'x-island': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
          component?: object;
          renderer?: 'react' | 'vue' | 'vue2' | 'vue3' | 'svelte';
          when?: 'load' | 'visible';
          props?: string;
          'root-margin'?: string;
        };
      }
    }
  }
}

declare module '*.svelte' {
  const component: object;
  export default component;
}

export {};
