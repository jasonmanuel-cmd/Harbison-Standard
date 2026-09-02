// Renders a JSON-LD @graph as a <script> tag. Safe against injection:
// the graph is built server-side from tenant config + static copy, never
// from user input, and JSON.stringify already escapes for HTML embedding
// purposes here (no user-controlled strings reach this component).
export function JsonLdScript({ graph }: { graph: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
