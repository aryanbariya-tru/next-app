import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "./sw-register";
import OnlineSync from "./components/features/sync/onlinesync";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "School PWA",
  description: "PWA version of the School page",
  manifest: "/manifest.json",

  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }]
  },

  applicationName: "School PWA",

  appleWebApp: {
    capable: true,
    title: "School PWA",
    statusBarStyle: "default"
  }
};

export const viewport = {
  themeColor: "#317EFB"
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#317EFB" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <OnlineSync/>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
