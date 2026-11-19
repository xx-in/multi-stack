import { useState } from 'react';
import { bus } from '@island/bus';

export default function Counter({ start = 0 }: { start?: number }) {
  const [count, setCount] = useState(start);
  return (
    <button
      type="button"
      className="rounded-lg bg-zinc-900 px-3 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
      onClick={() => {
        const next = count + 1;
        setCount(next);
        bus.emit('counter:changed', { count: next });
      }}
    >
      计数 {count}
    </button>
  );
}
