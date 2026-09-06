"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const validEmail = "Harbison-Standard@proton.me";
    const validPassword = "Nbj661";

    if (email === validEmail && password === validPassword) {
      // Set admin session in localStorage
      localStorage.setItem("admin_session", "true");
      localStorage.setItem("admin_login_time", new Date().toISOString());
      router.push("/admin/dashboard");
    } else {
      setError("Invalid email or password");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy/95 to-navy/90 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-12">
          <div className="relative w-12 h-12 border-2 border-brass rounded-full flex items-center justify-center bg-navy/50">
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-brass -translate-x-1/2"></div>
            <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-brass -translate-y-1/2"></div>
            <span className="font-serif text-xl text-brass font-bold relative z-10">H</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold text-white">Harbison</span>
            <span className="font-sans text-xs tracking-widest text-brass uppercase font-semibold">Standard</span>
          </div>
        </Link>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-8">
          <h1 className="font-serif text-3xl text-white mb-2">Admin Access</h1>
          <p className="text-white/70 mb-8">Enter your credentials to access the CRM dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white/80 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/90 text-navy rounded-lg focus:outline-none focus:ring-2 focus:ring-brass/50"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-white/80 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/90 text-navy rounded-lg focus:outline-none focus:ring-2 focus:ring-brass/50"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brass text-navy font-bold py-3 rounded-lg hover:bg-brass/90 transition-colors uppercase tracking-wider text-sm disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <Link href="/" className="text-white/60 hover:text-white text-sm text-center block transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
