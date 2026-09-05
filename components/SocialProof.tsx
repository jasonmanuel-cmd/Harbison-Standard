export function SocialProof() {
  const proofs = [
    {
      icon: "✓",
      stat: "150+",
      label: "Properties transacted",
      sublabel: "Sold, built, or brokered",
    },
    {
      icon: "⭐",
      stat: "4.9",
      label: "Average rating",
      sublabel: "Across all client interactions",
    },
    {
      icon: "🏡",
      stat: "40+",
      label: "Spec homes built",
      sublabel: "Pre-sold from ground up",
    },
    {
      icon: "⏱",
      stat: "2-3",
      label: "Weeks average close",
      sublabel: "Cash sales vs 60+ for listing",
    },
  ];

  return (
    <section className="bg-navy-deep py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {proofs.map((proof) => (
            <div key={proof.stat} className="text-center text-white">
              <p className="text-4xl">{proof.icon}</p>
              <p className="mt-3 font-serif text-3xl font-bold text-brass">{proof.stat}</p>
              <p className="mt-1 text-sm font-semibold uppercase tracking-wide">{proof.label}</p>
              <p className="mt-1 text-xs text-steel">{proof.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
