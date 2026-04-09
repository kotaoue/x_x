import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "x_x — Post Splitter",
  description:
    "Split long text into character-limited chunks at natural break points for posting on X and other social networks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-R55S15DQW5"
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-R55S15DQW5');
        `}
      </Script>
    </html>
  );
}
