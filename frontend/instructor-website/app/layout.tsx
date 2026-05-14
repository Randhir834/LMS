import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Instructor Dashboard',
  description: 'Real-time instructor profile dashboard',
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