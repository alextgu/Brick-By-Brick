'use client'

import { useState } from 'react'
import InstructionBook from './components/InstructionBook'
import { Button } from '@/components/ui/button'

const emptyManual = {
  total_steps: 0,
  difficulty: 'N/A',
  estimated_time_minutes: 0,
  steps: [] as any[],
  layer_summary: {} as Record<number, string>,
}

const emptyPieceCount = {
  total_pieces: 0,
  total_unique: 0,
  breakdown: [] as any[],
  by_category: {} as Record<string, number>,
  by_color: {} as Record<string, number>,
  estimated_cost: 0,
}

export default function Home() {
  const [open, setOpen] = useState(false)

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex items-center justify-between rounded-lg border bg-card p-4">
          <div className="flex items-center gap-4">
            <img
              src="/piece_by_piece.svg"
              alt=""
              className="h-10 w-auto opacity-90"
            />
            <div>
              <h1 className="text-xl font-bold">Brick By Brick</h1>
              <p className="text-sm text-muted-foreground">
                Clean backend + frontend scaffold
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <img src="/coin.svg" alt="" className="h-7 w-7 opacity-80" />
            <Button onClick={() => setOpen(true)}>Open InstructionBook</Button>
          </div>
        </header>

        <section className="rounded-lg border bg-card p-4">
          <p className="text-sm">
            Your original 3D/LEGO pipeline will plug into this new structure. The
            preserved `InstructionBook` animation is ready to use.
          </p>
        </section>

        <InstructionBook
          projectName="Demo Set"
          manual={emptyManual}
          pieceCount={emptyPieceCount}
          isOpen={open}
          onClose={() => setOpen(false)}
        />
      </div>
    </main>
  )
}

