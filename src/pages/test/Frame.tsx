import type { ReactNode } from 'react';

export default function Frame({
  title,
  header,
  children,
}: {
  title?: string;
  header?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section
      data-panel="react"
      className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h2 className="text-base font-semibold">{header ?? title}</h2>
      <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{children}</div>
    </section>
  );
}
