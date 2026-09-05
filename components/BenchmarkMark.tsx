// The brand mark: a surveyor's benchmark (circle + triangle + stem — a
// fixed reference point). Stroke-only, brass. Used as favicon source,
// loading placeholder, and hero watermark (~10% opacity applied by the
// caller via className, not baked in here).
export function BenchmarkMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      className={className}
      aria-hidden="true"
    >
      <circle cx="50" cy="38" r="24" />
      <path d="M50 14 L50 62" />
      <path d="M26 38 L74 38" />
      <path d="M38 62 L50 84 L62 62 Z" />
    </svg>
  );
}
