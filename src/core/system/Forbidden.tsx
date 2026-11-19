import '@/components/AppHeader.ts';

export const title = '无权访问';

export default function Forbidden({ path = '', bit = 0 }: { path?: string; bit?: number }) {
  return (
    <x-header>
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <section
          data-route-state="forbidden"
          className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950"
        >
          <h1 className="text-2xl font-semibold text-amber-950 dark:text-amber-100">无权访问</h1>
          <p className="mt-2 text-sm text-amber-900 dark:text-amber-200">
            <code className="rounded bg-white px-1 dark:bg-amber-900">{path}</code> 需要二进制位{' '}
            <strong>{bit}</strong>。权限数字未包含这一位时不会挂载页面。
          </p>
        </section>
      </div>
    </x-header>
  );
}
