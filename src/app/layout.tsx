import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrendSell Seller Dashboard",
  description: "70/30 Escrow Seller Dashboard for Zimbabwe",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
