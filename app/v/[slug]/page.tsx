import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTenant } from "@/tenants";
import { findLeadByVideoSlug } from "@/lib/video-lookup";

// Personalized video page (§7.4). Deliberately noindex — this is a link
// shared directly with one lead, not content meant to be found by
// search or an AI crawler (robots.ts already disallows /v/, and this is
// excluded from sitemap.ts). Dynamic by nature: there's no way to
// pre-render every possible slug.
export const dynamic = "force-dynamic";

function isYouTubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/.test(url);
}

function youTubeEmbedSrc(url: string): string {
  const idMatch = url.match(/(?:v=|youtu\.be\/)([\w-]{6,})/);
  const id = idMatch?.[1] ?? "";
  return `https://www.youtube.com/embed/${id}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lead = await findLeadByVideoSlug(slug);
  const tenant = getTenant();

  return {
    title: lead ? `A quick word about ${lead.property_address ?? "your property"}` : "Video",
    robots: { index: false, follow: false },
    openGraph: {
      title: lead ? `${tenant.contact.displayName} — ${lead.property_address ?? "your property"}` : tenant.name,
    },
  };
}

export default async function VideoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tenant = getTenant();
  const lead = await findLeadByVideoSlug(slug);

  if (!lead) {
    notFound();
  }

  const videoUrl = lead.video_url ?? "/media/hero.mp4";
  const nameParts = tenant.contact.displayName.trim().split(/\s+/);
  const firstName = nameParts[0] ?? tenant.contact.displayName;
  const lastName = nameParts.at(-1) ?? "";
  const addressPhrase = lead.property_address ?? "your property";

  const transcript = `Hi, I'm ${tenant.contact.displayName}. I do real estate the same way every time — buy for cash, build spec homes, or walk a piece of land with you and tell you what it's worth. If you want a straight number on ${addressPhrase}, call or text me at ${tenant.contact.phone}.`;

  return (
    <div className="min-h-screen bg-navy">
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div
          aria-label="Agent photo placeholder"
          className="mx-auto flex h-20 w-20 items-center justify-center border border-brass bg-navy-deep font-serif text-xl text-brass"
        >
          {firstName.slice(0, 1)}
          {lastName.slice(0, 1)}
        </div>

        <h1 className="mt-6 font-serif text-3xl text-white">
          A quick word about {addressPhrase}
        </h1>
        <p className="mt-2 text-steel">from {tenant.contact.displayName}</p>

        <div className="mt-8 overflow-hidden border border-brass/40 bg-black">
          {isYouTubeUrl(videoUrl) ? (
            <iframe
              src={youTubeEmbedSrc(videoUrl)}
              title="Video message"
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video controls className="aspect-video w-full" src={videoUrl} />
          )}
        </div>

        <a
          href={tenant.contact.phoneHref}
          className="mt-8 inline-block bg-brass px-8 py-4 text-sm font-semibold uppercase tracking-wide text-navy-deep"
        >
          Call {tenant.contact.phone}
        </a>

        <details className="mt-10 text-left text-sm text-steel">
          <summary className="cursor-pointer">Transcript</summary>
          <p className="mt-3">{transcript}</p>
        </details>

        <p className="mt-10 text-xs text-steel/70">{tenant.contact.complianceFooter}</p>
      </div>
    </div>
  );
}
