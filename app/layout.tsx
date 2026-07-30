import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "AI-Powered SDLC with Claude Code",
    description:
      "A focused two-hour workshop for applying Claude Code across the software lifecycle.",
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      type: "website",
      title: "AI-Powered SDLC with Claude Code",
      description:
        "A focused two-hour workshop for applying Claude Code across the software lifecycle.",
      images: [
        {
          url: `${origin}/og.png`,
          width: 1200,
          height: 630,
          alt: "AI-Powered SDLC with Claude Code — Hands-on Workshop",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "AI-Powered SDLC with Claude Code",
      description:
        "A focused two-hour workshop for applying Claude Code across the software lifecycle.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
