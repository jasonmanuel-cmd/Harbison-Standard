const PILLAR_LABELS: Record<string, string> = {
  build: "Build",
  update: "Update",
  invest: "Invest",
  flip: "Flip",
};

export function PillarBadge({ pillar }: { pillar: string | null }) {
  if (!pillar) return null;
  return (
    <span className="inline-block border-b-2 border-brass text-xs font-semibold uppercase tracking-wide text-navy">
      {PILLAR_LABELS[pillar] ?? pillar}
    </span>
  );
}
