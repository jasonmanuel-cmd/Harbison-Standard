import { getTenant } from "@/tenants";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLdScript } from "@/components/JsonLdScript";
import { buildGraph } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How The Harbison Standard collects, uses, and protects your information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  const tenant = getTenant();

  return (
    <>
      <JsonLdScript
        graph={buildGraph(tenant, {
          breadcrumbs: [
            { name: "Home", path: "/" },
            { name: "Privacy", path: "/privacy" },
          ],
        })}
      />
      <Header tenant={tenant} />

      <section className="bg-paper py-20">
        <div className="mx-auto max-w-2xl px-6">
          <h1 className="font-serif text-4xl text-navy">Privacy policy</h1>
          <p className="mt-2 text-sm text-navy/70">
            Plain-language summary — last updated with this site&rsquo;s launch.
          </p>

          <div className="mt-10 space-y-8 text-navy/80">
            <div>
              <h2 className="font-serif text-xl text-navy">What&rsquo;s collected</h2>
              <p className="mt-2">
                When you submit the contact form on this site, we collect your
                name, phone number, email address, the property address you
                provide, your answers about situation and timeline, and the
                consent statement you agreed to (along with the time, your IP
                address, and browser information at the time of submission).
                No other tracking or analytics cookies are used on this site.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-navy">How it&rsquo;s used</h2>
              <p className="mt-2">
                Your information is used to follow up about the property you
                submitted — by call, text, or email — and to keep a record of
                that outreach. It is not sold or shared with third parties for
                marketing purposes.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-navy">Service providers</h2>
              <p className="mt-2">
                Submissions are stored in a database (Supabase) and may be sent
                through email (Resend) or text/call (Twilio) service providers
                strictly to deliver the communications described above. Each
                provider only receives what&rsquo;s needed to perform that function.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-navy">Texts and calls</h2>
              <p className="mt-2">
                By submitting the form, you consent to be contacted by call,
                text, or email, including by automated systems, about the
                property you submitted. Consent is never a condition of any
                purchase. Message and data rates may apply. Reply STOP to any
                text at any time to opt out of further texts.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-navy">
                Access, correction, and deletion
              </h2>
              <p className="mt-2">
                To see what information is on file, correct it, or have it
                deleted, contact {tenant.contact.displayName} directly at{" "}
                <a href={tenant.contact.phoneHref} className="underline decoration-brass">
                  {tenant.contact.phone}
                </a>{" "}
                or{" "}
                <a href={`mailto:${tenant.contact.email}`} className="underline decoration-brass">
                  {tenant.contact.email}
                </a>
                . Requests are handled directly since this is a small, local
                operation, not a self-service system.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer tenant={tenant} />
    </>
  );
}
