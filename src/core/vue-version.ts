const vue2Mark = /^(?:\uFEFF)?\s*<!--\s*vue2\s*-->/;

export function isVue2Source(source: string): boolean {
  return vue2Mark.test(source);
}
