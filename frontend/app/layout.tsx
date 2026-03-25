import './globals.css'
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'BrickByBrick — our UofT Hacks project',
  description:
    'Hey! We built this at UofT Hacks: your video → scene AI → LEGO parts → instructions. Peek the demo and the stack we wired up over the weekend.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAFAF9] text-[#4A4A4A] antialiased">{children}</body>
    </html>
  )
}

