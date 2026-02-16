import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "9LMNTS Studio - Where Digital Design Enters CYBER CYPHER",
  description: "9LMNTS Studio: 18+ digital services, 20+ AI agents, EventOS IP licensing framework. Complete business automation and digital transformation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased`}
        style={{
          background: 'var(--background)',
          color: 'var(--foreground)',
          fontFamily: 'var(--font-sans), Arial, Helvetica, sans-serif'
        }}
      >
        {children}
      </body>
    </html>
  );
}
