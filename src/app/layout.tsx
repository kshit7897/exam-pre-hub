import type { Metadata, Viewport } from "next";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import "./globals.css";

const SITE_URL = "https://exam-pre-hub.vercel.app";
const DESCRIPTION = "Notes, summaries, hints, practice questions and mock exams.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "StudyHub",
  description: DESCRIPTION,
  openGraph: {
    title: "StudyHub",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "StudyHub",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "StudyHub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyHub",
    description: DESCRIPTION,
    images: ["/og.png"],
  },
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

// Sets the theme before first paint. Dark unless the user explicitly chose light.
const themeScript = `
try {
  var m = localStorage.getItem("studyhub:theme:v3");
  document.documentElement.setAttribute("data-theme", m === "light" ? "light" : "dark");
} catch (e) {
  document.documentElement.setAttribute("data-theme", "dark");
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
