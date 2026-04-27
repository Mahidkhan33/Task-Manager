"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * LoginPage — the sign-in screen at route "/login".
 *
 * This is a Client Component ("use client") because it manages form state
 * and handles user interaction through React hooks.
 */
export default function LoginPage() {
  // Controlled form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI feedback state
  const [error, setError] = useState("");        // Shown in red on failed login
  const [success, setSuccess] = useState(false); // Shown in green before redirect
  const [loading, setLoading] = useState(false); // Disables the submit button while waiting

  const router = useRouter();

  /**
   * Submits credentials to POST /api/auth/login.
   * On success: shows a banner and navigates to /dashboard after 1 second.
   * On failure: displays the error message from the server.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the browser's default full-page form submission
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        // Brief delay lets the user read the success message before being redirected
        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        setError(data.message || "Login failed");
      }
    } catch {
      // Handles network errors or unexpected failures
      setError("Something went wrong");
    } finally {
      // Always re-enable the button, regardless of success or failure
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-6">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-zinc-950 p-10 shadow-2xl shadow-violet-500/5">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h1>
          <p className="mt-2 text-white/40">Log in to manage your tasks efficiently.</p>
        </div>

        {/* Error banner — only rendered when `error` is non-empty */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-400">
            {error}
          </div>
        )}

        {/* Success banner — shown briefly before the redirect fires */}
        {success && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-400">
            Login successful! Entering dashboard...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-white/40 ml-1">
                Email Address
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-white/5 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/20 focus:border-violet-500/50 focus:bg-white/10 focus:outline-none transition-all"
                placeholder="name@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-white/40 ml-1">
                Password
              </label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/5 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/20 focus:border-violet-500/50 focus:bg-white/10 focus:outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit button is disabled while the API call is in flight */}
          <button
            disabled={loading}
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-700/40 ring-1 ring-white/10 transition-all hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-600/50 active:scale-95 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-white/30">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-violet-400 hover:text-violet-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
