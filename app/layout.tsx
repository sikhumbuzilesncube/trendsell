import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TrendSell - Sell Without Stock',
  description: 'List products. Set prices. Keep 70%. We handle delivery + payments.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
