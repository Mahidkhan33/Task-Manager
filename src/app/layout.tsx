import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/**
 * Load the Geist Sans variable font and expose it as a CSS custom property.
 * `variable` creates a class we can apply to the <html> tag so the font
 * is available globally via `var(--font-geist-sans)`.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/** Same as above but for the monospace variant (used in code/technical text). */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Default SEO metadata applied to every page unless a page overrides it.
 * Next.js merges this with any page-level `export const metadata` objects.
 */
export const metadata: Metadata = {
  title: "TaskFlow | Manage your tasks with effortless precision",
  description: "TaskFlow is the premium task management platform designed for teams and individuals who demand speed, clarity, and beautiful design.",
};

/**
 * RootLayout wraps every page in the application.
 *
 * - Font class names are applied to <html> so Tailwind's font utilities work.
 * - `antialiased` smooths font rendering on all screens.
 * - `h-full` on <html> and `min-h-full` on <body> allow full-height layouts.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
