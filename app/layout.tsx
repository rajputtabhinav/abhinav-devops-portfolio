import type { Metadata } from "next";
import Script from "next/script";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/500.css";
import { brandingName } from "@/lib/portfolio-data";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";
import "./dark-theme.css";

const pageTitle = `${brandingName} | AI Engineer`;

const pageDescription =
  "AI Engineer — LLM apps, RAG pipelines, AI agents & MCP servers, LLM APIs (Claude/OpenAI/Gemini), full-stack (Next.js/FastAPI/Node.js), on a Linux & HPC/GPU infrastructure base.";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: pageTitle,
    description: pageDescription,
  },
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/logo.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link href="/assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
        <link href="/assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet" />
        <link href="/assets/vendor/aos/aos.css" rel="stylesheet" />
        <link href="/assets/css/main.css" rel="stylesheet" />
        <link href="/assets/css/portfolio-overrides.css" rel="stylesheet" />
      </head>
      <body>
        <Script id="portfolio-theme-boot" strategy="beforeInteractive">{`
(function () {
  var key = "portfolio-theme";
  var stored = "";
  try {
    stored = localStorage.getItem(key) || "";
  } catch (e) {
    stored = "";
  }
  var mode =
    stored === "dark" || stored === "light"
      ? stored
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
  document.documentElement.setAttribute("data-theme", mode);
})();
`}</Script>
        {children}
        <Script src="/assets/vendor/bootstrap/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
        <Script src="/assets/vendor/aos/aos.js" strategy="afterInteractive" />
        <Script src="/assets/vendor/waypoints/noframework.waypoints.js" strategy="afterInteractive" />
        <Script src="/assets/js/main.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
