import type { Metadata } from "next";
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
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
