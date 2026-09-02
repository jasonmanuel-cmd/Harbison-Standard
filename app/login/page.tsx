"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// Magic-link login for the CRM (§7.3). Deliberately just an email field
// and a button — nothing else, matching the "extremely simple" mandate
// for a non-technical agent's view of the system.
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const supabase = getSupabaseBrowserClient();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!supabase) {
      setStatus("error");
      setErrorMessage(
        "The CRM isn't connected to a database yet. See README.md for Supabase setup.",
      );
      return;
    }

    setStatus("sending");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }

    setStatus("sent");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-2xl text-white">Sign in</h1>
        <p className="mt-2 text-sm text-steel">
          Enter your email — we&rsquo;ll send you a link to sign in.
        </p>

        {status === "sent" ? (
          <p className="mt-6 border border-brass bg-navy-deep p-4 text-sm text-white">
            Check your email for a sign-in link.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-steel bg-white px-4 py-3 text-navy"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-brass px-6 py-3 text-sm font-semibold uppercase tracking-wide text-navy-deep disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Send sign-in link"}
            </button>
            {status === "error" && (
              <p className="text-sm text-red-300">{errorMessage}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
