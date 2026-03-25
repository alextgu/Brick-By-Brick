import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Demo walkthrough — BrickByBrick',
  description: 'Step-by-step overview of the BrickByBrick pipeline (placeholder slides).',
}

export default function DemoLayout({ children }: { children: ReactNode }) {
  return children
}
