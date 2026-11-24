import type { Metadata, Viewport } from "next";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyHub",
  description: "Notes, summaries, hints, practice questions and mock exams.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff7f1" },
    { media: "(prefers-color-scheme: dark)", color: "#130a05" },
  ],
};

// Sets the theme before first paint. Light unless the user explicitly chose dark.
const themeScript = `
try {
  var m = localStorage.getItem("studyhub:theme:v3");
  document.documentElement.setAttribute("data-theme", m === "dark" ? "dark" : "light");
} catch (e) {
  document.documentElement.setAttribute("data-theme", "light");
}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Header is kept minimal: only the app name and theme. Subject navigation lives inside each subject. */}
        <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--card)]/85 backdrop-blur-lg">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="focus-ring rounded-lg">
              <Logo />
            </Link>
            <ThemeToggle />
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-5 sm:pt-7">{children}</main>
      </body>
    </html>
  );
}
