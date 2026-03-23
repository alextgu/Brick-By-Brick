'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { downloadLegoPDF } from '../../lib/instructionPdf'

interface BuildStep {
  step_number: number
  layer_z: number
  bricks_in_step: Array<{
    part_id: string
    lego_type?: string
    position?: { studs?: number[] }
    rotation?: number
    color_name?: string
  }>
  piece_counts: Record<string, number>
  instructions: string
}

interface PieceBreakdown {
  part_id: string
  color_id: number
  quantity: number
  piece_name: string
  color_name?: string
  price_estimate?: number
}

interface InstructionBookProps {
  projectName: string
  manual: {
    total_steps: number
    difficulty: string
    estimated_time_minutes: number
    baseplate?: {
      size_studs: number[]
      lego_type: string
    }
    steps: BuildStep[]
    layer_summary: Record<number, string>
  }
  pieceCount: {
    total_pieces: number
    total_unique: number
    breakdown: PieceBreakdown[]
    by_category?: Record<string, number>
    by_color?: Record<string, number>
    estimated_cost?: number
  }
  isOpen: boolean
  onClose: () => void
}

const BRICK_COLORS = [
  '#E3000B',
  '#0055BF',
  '#237841',
  '#FFCA28',
  '#FF6B00',
  '#9C27B0',
  '#00BCD4',
]

export default function InstructionBook({
  projectName,
  manual,
  pieceCount,
  isOpen,
  onClose,
}: InstructionBookProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const totalPages = 2 + manual.total_steps
  const hasNoData = pieceCount.total_pieces === 0 && manual.total_steps === 0

  const handleDownloadPDF = async () => {
    if (isDownloading) return
    setIsDownloading(true)
    try {
      await downloadLegoPDF({
        projectName,
        manual,
        pieceCount,
      })
    } catch (error) {
      console.error('Failed to download PDF:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const nextPage = () => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      setIsFlipping(true)
      setDirection(1)
      setCurrentPage(currentPage + 1)
      setTimeout(() => setIsFlipping(false), 600)
    }
  }

  const prevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true)
      setDirection(-1)
      setCurrentPage(currentPage - 1)
      setTimeout(() => setIsFlipping(false), 600)
    }
  }

  if (!isOpen) return null

  const StudPattern = ({ count = 4, color = '#e3000b' }: { count?: number; color?: string }) => (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-4 h-4 rounded-full"
          style={{
            background: `linear-gradient(135deg, ${color} 0%, ${color} 50%, rgba(0,0,0,0.2) 100%)`,
            boxShadow: `inset -1px -1px 2px rgba(0,0,0,0.3), inset 1px 1px 2px rgba(255,255,255,0.3)`,
          }}
        />
      ))}
    </div>
  )

  const PlacementArrow = ({ number }: { number: number }) => (
    <div className="flex items-center gap-1">
      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
        {number}
      </div>
      <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
        <path d="M0 6H16M16 6L11 1M16 6L11 11" stroke="#0055BF" strokeWidth="2" />
      </svg>
    </div>
  )

  const renderPageContent = () => {
    if (currentPage === 0) {
      if (hasNoData) {
        return (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center">
            <div className="text-8xl mb-6">🧱</div>
            <h1 className="text-3xl font-black mb-4">Nothing to Display</h1>
            <p className="text-lg mb-2">No build has been loaded yet.</p>
            <p className="text-sm opacity-70">Load a manifest or demo data to see instructions.</p>
          </div>
        )
      }

      return (
        <div className="h-full flex flex-col p-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="text-center mb-6">
            <StudPattern count={6} color="#e3000b" />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="text-5xl mb-6">🏠</div>
            <h1 className="text-5xl font-black text-gray-900 mb-1 leading-tight">{projectName}</h1>
            <div className="w-16 h-1 bg-red-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 mb-8">Building Instructions</p>
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-8">
              <div className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-xl p-4 shadow-lg text-center">
                <p className="text-3xl font-black leading-none">{pieceCount.total_pieces}</p>
                <p className="text-xs font-bold opacity-90 mt-1">PIECES</p>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-4 shadow-lg text-center">
                <p className="text-3xl font-black leading-none">{pieceCount.total_unique}</p>
                <p className="text-xs font-bold opacity-90 mt-1">TYPES</p>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl p-4 shadow-lg text-center">
                <p className="text-3xl font-black leading-none">{manual.total_steps}</p>
                <p className="text-xs font-bold opacity-90 mt-1">STEPS</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-4 shadow-lg text-center">
                <p className="text-3xl font-black leading-none">{manual.estimated_time_minutes}m</p>
                <p className="text-xs font-bold opacity-90 mt-1">TIME</p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap justify-center mb-8">
              <span className="px-5 py-2 bg-gray-900 text-white rounded-full text-sm font-bold shadow-md">
                {manual.difficulty}
              </span>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500 mb-3 font-semibold">→ to browse • 📥 to print / export</p>
            <StudPattern count={6} color="#1e40af" />
          </div>
        </div>
      )
    }

    if (currentPage === 1) {
      return (
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-4 mb-4 pb-3 border-b-4 border-red-600">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-white text-2xl">
              📦
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">Parts Required</h2>
              <p className="text-sm text-gray-500">Gather these before building</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-2.5">
              {pieceCount.breakdown.slice(0, 16).map((part, idx) => {
                const colorMap: Record<number, string> = {
                  0: '#1B1B1B',
                  1: '#0055BF',
                  2: '#237841',
                  4: '#C91A09',
                  5: '#C870A0',
                  6: '#583927',
                  7: '#9BA19D',
                  8: '#6D6E5C',
                  9: '#4FA3D1',
                  14: '#F2CD37',
                  15: '#FFFFFF',
                  19: '#E4CD9E',
                  25: '#FE8A18',
                  28: '#958A73',
                }
                const pieceColor =
                  part.color_id !== undefined
                    ? colorMap[part.color_id] || BRICK_COLORS[idx % BRICK_COLORS.length]
                    : BRICK_COLORS[idx % BRICK_COLORS.length]
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 shadow-sm"
                  >
                    <div
                      className="w-10 h-8 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: pieceColor, border: '1px solid rgba(0,0,0,0.15)' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{part.piece_name}</p>
                      {part.color_name && <p className="text-xs text-gray-500 truncate">{part.color_name}</p>}
                    </div>
                    <div className="bg-red-600 text-white px-2.5 py-1 rounded-full text-xs font-black flex-shrink-0">
                      {part.quantity}×
                    </div>
                  </div>
                )
              })}
            </div>
            {pieceCount.breakdown.length > 16 && (
              <p className="text-center text-gray-400 mt-4 text-xs font-semibold">
                +{pieceCount.breakdown.length - 16} more types
              </p>
            )}
          </div>
          <div className="mt-4 pt-4 border-t-2 border-gray-200 flex justify-center">
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-2.5 rounded-full font-black text-sm shadow-lg">
              Total: {pieceCount.total_pieces} pieces
            </div>
          </div>
        </div>
      )
    }

    const stepIndex = currentPage - 2
    const step = manual.steps[stepIndex]

    if (!step) {
      return (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500">Step not found</p>
        </div>
      )
    }

    const isBaseplateStep = step.layer_z === -1

    return (
      <div className="h-full flex flex-col p-6 bg-white">
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`w-16 h-16 rounded-xl flex items-center justify-center text-white shadow-lg ${
              isBaseplateStep ? 'bg-green-600' : 'bg-blue-600'
            }`}
          >
            <span className="text-3xl font-black">{step.step_number}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-gray-900">
              {isBaseplateStep ? 'Place the Baseplate' : `Step ${step.step_number}`}
            </h2>
            <p className="text-sm text-gray-500">
              {isBaseplateStep ? '🟩 Foundation' : `Layer ${step.layer_z}`}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-4 border-2 border-gray-200">
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(step.piece_counts).map(([id, qty], idx) => (
              <div
                key={id}
                className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow border border-gray-100"
              >
                <div
                  className="w-8 h-6 rounded flex items-center justify-center"
                  style={{ backgroundColor: BRICK_COLORS[idx % BRICK_COLORS.length] }}
                >
                  <span className="text-white text-xs">🧱</span>
                </div>
                <span className="text-xs font-medium">{id}</span>
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {qty}×
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-gray-100 rounded-xl p-4 mb-4 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />
          <div className="relative z-10 h-full flex flex-col">
            <div className="bg-white rounded-lg px-4 py-3 mb-3 shadow-sm border-l-4 border-blue-600">
              <p className="text-sm font-medium text-gray-800">{step.instructions}</p>
            </div>
            <div className="flex-1 flex flex-wrap gap-3 items-start content-start">
              {step.bricks_in_step.slice(0, 8).map((brick, idx) => {
                const pos = brick.position?.studs || [0, 0, 0]
                return (
                  <div key={idx} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm">
                    <PlacementArrow number={idx + 1} />
                    <div>
                      <p className="text-xs font-semibold text-gray-700">
                        {brick.lego_type || brick.part_id}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        Position: ({pos[0]}, {pos[1]})
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="instruction-book-overlay" onClick={onClose}>
      <motion.div
        className="instruction-book-container"
        initial={{ scale: 0.8, opacity: 0, rotateX: 10 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        exit={{ scale: 0.8, opacity: 0, rotateX: -10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="instruction-book-spine">
          <div className="spine-decoration">
            <div className="spine-stud"></div>
            <div className="spine-stud"></div>
            <div className="spine-stud"></div>
            <div className="spine-title">LEGO</div>
            <div className="spine-stud"></div>
            <div className="spine-stud"></div>
            <div className="spine-stud"></div>
          </div>
        </div>

        <div className="instruction-book-pages">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentPage}
              custom={direction}
              initial={{
                rotateY: direction > 0 ? 90 : -90,
                opacity: 0,
              }}
              animate={{
                rotateY: 0,
                opacity: 1,
              }}
              exit={{
                rotateY: direction > 0 ? -90 : 90,
                opacity: 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                opacity: { duration: 0.2 },
              }}
              className="instruction-book-page"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {renderPageContent()}
            </motion.div>
          </AnimatePresence>
          <div className="page-curl"></div>
        </div>

        <div className="instruction-book-nav">
          <button onClick={prevPage} disabled={currentPage === 0 || isFlipping} className="nav-btn nav-prev">
            ◀
          </button>
          <div className="page-indicator">
            <span className="current-page">{currentPage + 1}</span>
            <span className="separator">/</span>
            <span className="total-pages">{totalPages}</span>
          </div>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1 || isFlipping}
            className="nav-btn nav-next"
          >
            ▶
          </button>
        </div>

        <div className="page-label">
          {currentPage === 0
            ? 'Cover'
            : currentPage === 1
              ? 'Parts List'
              : `Step ${currentPage - 1} of ${manual.total_steps}`}
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading || hasNoData}
          className="instruction-book-download"
          title="Print / export"
        >
          {isDownloading ? '⏳' : '📥'}
        </button>

        <button onClick={onClose} className="instruction-book-close">
          ✕
        </button>
      </motion.div>
    </div>
  )
}
