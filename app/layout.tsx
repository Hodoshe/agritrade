import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AgriTrade - South African Agricultural Marketplace',
  description: 'Connect with farmers, suppliers, and buyers across South Africa',
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
