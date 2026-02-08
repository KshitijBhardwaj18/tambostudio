import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TamboStudio - Build AI Apps in Minutes",
  description: "Describe your app in natural language and get a working AI-powered application with configured components, tools, and system prompts. Powered by Tambo AI.",
  keywords: ["AI", "app builder", "no-code", "Tambo", "artificial intelligence", "chat", "components"],
  authors: [{ name: "Tambo AI" }],
  openGraph: {
    title: "TamboStudio - Build AI Apps in Minutes",
    description: "Describe your app in natural language and get a working AI-powered application.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/Octo-Icon.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
