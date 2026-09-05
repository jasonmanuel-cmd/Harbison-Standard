import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Auth gate for the (crm) area (§4, §7.3). Phase 4 extends this same
// file with host→tenant resolution for white-labeling — keep both
// concerns in one middleware.ts rather than splitting them, since
// Next.js only runs a single middleware per request.
const PROTECTED_PREFIXES = ["/dashboard", "/leads", "/settings"];

export async function middleware(request: NextRequest) {
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Demo mode (§7.3, §9) deliberately bypasses login on /dashboard and
  // /leads/[id] only — never /settings, which has no demo meaning. It's
  // safe to leave reachable without auth because the data layer
  // (lib/leads-query.ts) hardcodes demo-mode queries to rows carrying the
  // seed-only `notes->>'demo'` marker; nothing about the request can
  // widen that to real lead data. See DECISIONS.md.
  const isDemo = request.nextUrl.searchParams.get("demo") === "1";
  const allowsDemoBypass =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/leads");
  if (isDemo && allowsDemoBypass) {
    return NextResponse.next();
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    // Supabase isn't configured — there's no way to authenticate anyone,
    // so block access rather than silently rendering an empty/broken
    // dashboard behind what looks like a working auth gate.
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/leads/:path*", "/settings/:path*"],
};
