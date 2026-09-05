import { getTenant } from "@/tenants";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { updateDisplayName } from "./actions";

// Always render per-request: this page reads the signed-in user's
// session cookie. Without this, a build where Supabase env vars happen
// to be absent (getSupabaseServerClient short-circuits before calling
// cookies()) would let Next statically cache a page that must never be
// static once real auth is configured.
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const tenant = getTenant();
  const supabase = await getSupabaseServerClient();

  let email = "";
  let displayName = "";

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      email = user.email ?? "";
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle();
      displayName = profile?.display_name ?? "";
    }
  }

  async function submit(formData: FormData) {
    "use server";
    await updateDisplayName(String(formData.get("display_name") ?? ""));
  }

  return (
    <div className="min-h-screen bg-paper">
      <CrmHeader tenant={tenant} />

      <div className="mx-auto max-w-xl px-6 py-8">
        <h1 className="font-serif text-3xl text-navy">Settings</h1>

        <section className="mt-8">
          <h2 className="font-serif text-xl text-navy">Profile</h2>
          <p className="mt-1 text-sm text-navy/60">{email}</p>
          <form action={submit} className="mt-4 space-y-3">
            <div>
              <label htmlFor="display_name" className="block text-sm font-semibold text-navy">
                Display name
              </label>
              <input
                type="text"
                id="display_name"
                name="display_name"
                defaultValue={displayName}
                className="mt-1 w-full border border-navy/30 bg-white px-4 py-3 text-navy"
              />
            </div>
            <button
              type="submit"
              className="border border-navy/30 bg-white px-4 py-2 text-sm font-semibold text-navy"
            >
              Save
            </button>
          </form>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-xl text-navy">Notification preferences</h2>
          <p className="mt-2 text-sm text-navy/60">
            The 7am morning briefing email and other notification controls
            ship with Phase 3&rsquo;s automation layer — nothing to
            configure here yet.
          </p>
        </section>
      </div>
    </div>
  );
}
