export default function GuardNote({ label = '' }: { label?: string }) {
  return (
    <p
      data-guard={label}
      className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"
    >
      {label}
    </p>
  );
}
