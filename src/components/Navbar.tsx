"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">

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
