import { useEffect, useState, type ReactNode } from 'react';
import { bus } from '@island/bus';

export default function Listener({ children }: { children?: ReactNode }) {
  const [count, setCount] = useState<number | null>(null);
  useEffect(
    () =>
      bus.on('counter:changed', (payload) => {
        setCount((payload as { count: number }).count);
      }),
    [],
  );
  return (
    <div
      data-listener="react"
      className="rounded-2xl border border-emerald-200 bg-white p-4 dark:border-emerald-900 dark:bg-zinc-900"
    >
      <p className="text-sm text-zinc-800 dark:text-zinc-200">React 收到：{count ?? '尚无'}</p>
      <div className="mt-2 text-sm text-emerald-700 dark:text-emerald-300">{children}</div>
    </div>
  );
}
