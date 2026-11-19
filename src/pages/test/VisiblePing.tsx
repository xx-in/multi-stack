export default function VisiblePing() {
  return (
    <p
      data-visible="react"
      className="rounded-2xl border border-dashed border-zinc-300 bg-white px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
    >
      React 进入视口后才挂载
    </p>
  );
}
