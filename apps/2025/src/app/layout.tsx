import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "../components/providers";

const suisseIntl = localFont({
  src: [
    {
      path: "../../public/fonts/SuisseIntl-Book.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/SuisseIntl-Book.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/SuisseIntl-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/SuisseIntl-Medium.woff",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-suisse-intl",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Supabase Select",
  description:
    "Where builders come to learn. Jam-packed with sessions from the industry's best builders.",
  metadataBase: new URL("https://select.supabase.com"),
  openGraph: {
    title: "Supabase Select",
    description:
      "Where builders come to learn. Jam-packed with sessions from the industry's best builders.",
    images: ["/og.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Supabase Select",
    description:
      "Where builders come to learn. Jam-packed with sessions from the industry's best builders.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${suisseIntl.variable} ${geistMono.variable} antialiased min-h-screen bg-background  text-foreground`}
      >
        <Providers>
          <main className="">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
