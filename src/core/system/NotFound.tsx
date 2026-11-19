import '@/components/AppHeader.ts';

export const title = '找不到页面';

export default function NotFound({ path = '' }: { path?: string }) {
  return (
    <x-header>
      <section data-route-state="missing" className="mx-auto w-full max-w-6xl space-y-2 px-4 py-6">
        <h1 className="text-2xl font-semibold">找不到页面</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{path} 没有对应的页面。</p>
      </section>
    </x-header>
  );
}
