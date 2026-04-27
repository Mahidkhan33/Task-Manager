"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * Navbar — the top navigation bar shown on authenticated pages (e.g. the dashboard).
 *
 * Contains:
 *  - The TaskFlow brand logo (links back to /dashboard)
 *  - A Logout button that calls the logout API then redirects to /login
 */
export default function Navbar() {
  const router = useRouter();

  /**
   * Calls POST /api/auth/logout which clears the session cookie on the server,
   * then redirects the user to the login page.
   */
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
      {/* `sticky top-0` keeps the navbar visible as the user scrolls */}
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/dashboard" className="text-xl font-bold tracking-tighter text-white">
          TASK<span className="text-violet-500">FLOW</span>
        </Link>
        <button
          onClick={handleLogout}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
