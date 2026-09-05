/** "2h ago", "3d ago" — kept dependency-free rather than pulling in a
 * date library for one small formatting need. */
export function relativeAge(isoDate: string): string {
  const ms = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export const SOURCE_LABELS: Record<string, string> = {
  home: "Home",
  sell: "Sell",
  build: "Build",
  land: "Land",
  press: "Press",
  "missed-call": "Missed call",
  manual: "Manual",
  import: "Import",
};

export const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  appointment: "Appointment",
  offer_out: "Offer out",
  dead: "Dead",
  closed: "Closed",
};
