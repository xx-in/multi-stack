import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { transformWithEsbuild, type Plugin } from 'vite';
import { isVue2Source } from '../src/core/vue-version.ts';

const require = createRequire(import.meta.url);
const vue2Root = path.dirname(require.resolve('vue2/package.json'));
const compiler = require(
  path.join(vue2Root, 'packages/compiler-sfc/dist/compiler-sfc.js'),
) as Vue2Compiler;

const prefix = '\0island-vue2:';

type CompilerError = string | { msg?: string };
type SFCBlock = { content: string; lang?: string; scoped?: boolean };
type Descriptor = {
  template: SFCBlock | null;
  script: SFCBlock | null;
  scriptSetup: SFCBlock | null;
  styles: SFCBlock[];
  errors: CompilerError[];
};
type Vue2Compiler = {
  parse(options: { source: string; filename?: string }): Descriptor;
  compileScript(sfc: Descriptor, options: { id: string }): { content: string };
  compileTemplate(options: {
    source: string;
    filename: string;
    compilerOptions?: { scopeId?: string; mustUseProp?: typeof mustUseProp };
  }): { code: string; errors: CompilerError[] };
  compileStyle(options: { source: string; filename: string; id: string; scoped?: boolean }): {
    code: string;
    errors: CompilerError[];
  };
};

function mustUseProp(tag: string, type: string | null, name: string): boolean {
  return (
    name === 'component' ||
    (name === 'value' && (tag === 'input' || tag === 'textarea' || tag === 'option')) ||
    (name === 'selected' && tag === 'option') ||
    (name === 'checked' && tag === 'input') ||
    (name === 'muted' && tag === 'video')
  );
}

function scopeId(filename: string): string {
  return `data-v-${createHash('sha256').update(filename).digest('hex').slice(0, 8)}`;
}

function errorText(error: CompilerError): string {
  return typeof error === 'string' ? error : (error.msg ?? 'Vue 2 编译失败');
}

function virtualId(filename: string, kind: string): string {
  return `${prefix}${filename}::${kind}`;
}

function readVirtual(id: string): { filename: string; kind: string } | null {
  if (!id.startsWith(prefix)) return null;
  const body = id.slice(prefix.length);
  const splitAt = body.lastIndexOf('::');
  if (splitAt < 0) return null;
  return { filename: body.slice(0, splitAt), kind: body.slice(splitAt + 2) };
}

export function vue2(): Plugin {
  return {
    name: 'island-vue2',
    enforce: 'pre',
    async resolveId(source, importer, options) {
      if (source.startsWith(prefix)) return source;
      if ((source === 'vue' || source.startsWith('vue/')) && importer?.startsWith(prefix)) {
        const redirected = source === 'vue' ? 'vue2' : `vue2/${source.slice('vue/'.length)}`;
        return this.resolve(redirected, importer, { skipSelf: true, ...options });
      }
      const clean = source.split('?')[0] ?? source;
      if (source.includes('?') || !clean.endsWith('.vue')) return null;
      const resolved = await this.resolve(source, importer, { skipSelf: true, ...options });
      if (!resolved || resolved.external) return null;
      const filename = resolved.id.split('?')[0] ?? resolved.id;
      if (!filename.endsWith('.vue')) return null;
      let code = '';
      try {
        code = fs.readFileSync(filename, 'utf8');
      } catch {
        return null;
      }
      if (!isVue2Source(code)) return null;
      return virtualId(filename, 'main');
    },
    async load(id) {
      const parsed = readVirtual(id);
      if (!parsed) return null;
      const { filename, kind } = parsed;
      this.addWatchFile(filename);
      const source = fs.readFileSync(filename, 'utf8');
      const descriptor = compiler.parse({ source, filename });
      if (descriptor.errors.length > 0) this.error(errorText(descriptor.errors[0]!));
      const idHash = scopeId(filename);
      if (kind === 'main') return renderMain(filename, descriptor);
      if (kind === 'script') return renderScript(descriptor, filename, idHash);
      if (kind === 'template') return renderTemplate(descriptor, filename, idHash);
      if (kind.startsWith('style-')) return renderStyle(descriptor, filename, idHash, kind);
      return null;
    },
  };
}

function renderMain(filename: string, descriptor: Descriptor): string {
  const scriptId = virtualId(filename, 'script');
  const lines = [`import script from ${JSON.stringify(scriptId)};`];
  if (descriptor.template) {
    const templateId = virtualId(filename, 'template');
    lines.push(`import { render, staticRenderFns } from ${JSON.stringify(templateId)};`);
    lines.push('script.render = render;');
    lines.push('script.staticRenderFns = staticRenderFns;');
  }
  descriptor.styles.forEach((_, index) => {
    lines.push(`import ${JSON.stringify(virtualId(filename, `style-${index}`))};`);
  });
  lines.push("script.__islandRenderer = 'vue2';");
  lines.push('export default script;');
  lines.push("export const renderer = 'vue2';");
  lines.push(`export * from ${JSON.stringify(scriptId)};`);
  return lines.join('\n');
}

async function renderScript(
  descriptor: Descriptor,
  filename: string,
  idHash: string,
): Promise<string> {
  const block = descriptor.script ?? descriptor.scriptSetup;
  const content = block
    ? compiler.compileScript(descriptor, { id: idHash }).content
    : 'export default {};';
  const lang = block?.lang;
  if (lang !== 'ts' && lang !== 'tsx') return content;
  const result = await transformWithEsbuild(content, filename, {
    loader: lang === 'tsx' ? 'tsx' : 'ts',
  });
  return result.code;
}

function renderTemplate(descriptor: Descriptor, filename: string, idHash: string): string {
  const scoped = descriptor.styles.some((style) => style.scoped);
  const result = compiler.compileTemplate({
    source: descriptor.template?.content ?? '',
    filename,
    compilerOptions: scoped ? { scopeId: idHash, mustUseProp } : { mustUseProp },
  });
  if (result.errors.length > 0) throw new Error(errorText(result.errors[0]!));
  return `${result.code}\nexport { render, staticRenderFns };\n`;
}

function renderStyle(
  descriptor: Descriptor,
  filename: string,
  idHash: string,
  kind: string,
): string {
  const index = Number(kind.slice('style-'.length));
  const style = descriptor.styles[index];
  if (!style) throw new Error(`找不到第 ${index} 段样式`);
  const result = compiler.compileStyle({
    source: style.content,
    filename,
    id: idHash,
    scoped: Boolean(style.scoped),
  });
  if (result.errors.length > 0) throw new Error(errorText(result.errors[0]!));
  const elementId = `${idHash}-${index}`;
  return `const id = ${JSON.stringify(elementId)};
let style = document.getElementById(id);
if (!style) {
  style = document.createElement('style');
  style.id = id;
  document.head.appendChild(style);
}
style.textContent = ${JSON.stringify(result.code)};
`;
}
