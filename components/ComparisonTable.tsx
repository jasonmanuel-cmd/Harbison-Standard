export function ComparisonTable() {
  return (
    <section className="bg-paper py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="font-serif text-3xl text-navy">Cash sale vs. traditional listing</h2>
          <p className="mt-3 max-w-2xl text-center text-navy/70">
            Both approaches have a place. Here's how they stack up:
          </p>
        </div>

        <div className="mt-12 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-navy/20 bg-white">
                <th className="px-4 py-4 text-left font-serif text-lg text-navy">Factor</th>
                <th className="px-4 py-4 text-center font-semibold text-navy">Cash Sale</th>
                <th className="px-4 py-4 text-center font-semibold text-navy">Traditional Listing</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  factor: "Timeline",
                  cash: "2–3 weeks",
                  listing: "60–90+ days",
                  cashWins: true,
                },
                {
                  factor: "Commissions",
                  cash: "None",
                  listing: "5–6%",
                  cashWins: true,
                },
                {
                  factor: "Repairs needed",
                  cash: "None—sold as-is",
                  listing: "Buyer may request",
                  cashWins: true,
                },
                {
                  factor: "Certainty of close",
                  cash: "Very high (no financing contingency)",
                  listing: "Buyer financing risk",
                  cashWins: true,
                },
                {
                  factor: "Carrying costs",
                  cash: "Zero",
                  listing: "Mortgage, taxes, utilities, etc.",
                  cashWins: true,
                },
                {
                  factor: "Showings & staging",
                  cash: "No",
                  listing: "Yes",
                  cashWins: true,
                },
                {
                  factor: "Price (if comparable property)",
                  cash: "15–25% below retail",
                  listing: "Market rate",
                  cashWins: false,
                },
                {
                  factor: "Best for",
                  cash: "Probate, inheritance, urgency",
                  listing: "Time available, good condition",
                  cashWins: null,
                },
              ].map((row) => (
                <tr
                  key={row.factor}
                  className={`border-b border-navy/10 ${row.factor === "Best for" ? "bg-white font-semibold" : ""}`}
                >
                  <td className="px-4 py-4 font-semibold text-navy">{row.factor}</td>
                  <td
                    className={`px-4 py-4 text-center ${row.cashWins === true ? "bg-brass/10 text-navy" : "text-navy/70"}`}
                  >
                    {row.cash}
                  </td>
                  <td
                    className={`px-4 py-4 text-center ${row.cashWins === false ? "bg-brass/10 text-navy" : "text-navy/70"}`}
                  >
                    {row.listing}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 rounded-lg border border-brass/30 bg-brass/5 p-6 text-center">
          <p className="font-semibold text-navy">
            No right answer. The best choice depends on your timeline, property condition, and
            financial situation.
          </p>
          <p className="mt-2 text-sm text-navy/70">
            Get a free analysis to see which approach makes sense for your property.
          </p>
        </div>
      </div>
    </section>
  );
}
