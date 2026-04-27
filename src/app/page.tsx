import Link from "next/link";
import Image from "next/image";

/**
 * LandingPage — the public home page at route "/".
 *
 * This is a Server Component (no "use client" directive), so it renders on
 * the server and sends pure HTML to the browser — great for SEO and speed.
 *
 * Sections:
 *  1. Navbar   — logo + login/signup links
 *  2. Hero     — headline, description, CTA buttons
 *  3. Preview  — a screenshot of the dashboard
 *  4. Footer   — copyright line
 */
export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white selection:bg-indigo-500/30">

      {/* ── Navbar ── */}
      <nav className="flex items-center justify-between px-8 py-8 md:px-20">
        <div className="text-2xl font-bold tracking-tighter">
          TASK<span className="text-violet-500">FLOW</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-white/70 hover:text-white transition">
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-violet-700/40 ring-1 ring-white/10 transition hover:from-violet-500 hover:to-indigo-500 active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        {/* Small "v1.0 is now live" badge */}
        <div className="relative mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-indigo-400">
          <span>v1.0 is now live</span>
          <span className="ml-2 h-1 w-1 rounded-full bg-indigo-500"></span>
        </div>
        
        {/* Main headline — gradient text fades from white to transparent */}
        <h1 className="max-w-4xl bg-gradient-to-b from-white to-white/40 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-8xl">
          Manage your tasks with effortless precision.
        </h1>
        
        {/* Subheadline / value proposition */}
        <p className="mt-8 max-w-2xl text-lg text-white/50 md:text-xl">
          TaskFlow is the premium task management platform designed for teams and individuals 
          who demand speed, clarity, and beautiful design.
        </p>

        {/* CTA buttons — primary (signup) and secondary (login) */}
        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-2xl shadow-violet-700/40 ring-1 ring-white/10 transition hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-600/50 active:scale-95"
          >
            Start for free
          </Link>
          <Link
            href="/login"
            className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-lg font-bold text-white backdrop-blur-sm transition hover:bg-white/10"
          >
            Sign in
          </Link>
        </div>

        <div className="mt-24 w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-px shadow-2xl">
          <div className="relative overflow-hidden rounded-3xl bg-black">
            <Image
              src="/dashboard_preview.png"
              alt="TaskFlow Dashboard Preview"
              width={1200}
              height={800}
              priority
              className="w-full h-auto block transition duration-700 hover:scale-105"
            />
            {/* Bottom gradient overlay to blend the screenshot into the black background */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-12 text-center text-sm text-white/30">
        © 2026 TaskFlow. Built for the modern web.
      </footer>
    </div>
  );
}
