'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  generateModelInterpretations,
  suggestPiecesForShape,
  type ModelInterpretation,
  type ConversionResult,
} from '../../lib/geminiLegoConverter'
import type { PieceCount } from '../../lib/legoManualGenerator'

interface ModelSelectorProps {
  isOpen: boolean
  onClose: () => void
  pieceCount: PieceCount
  roomType: string
  totalBricks: number
  onSelectModel: (interpretation: ModelInterpretation) => void
}

export default function ModelSelector({
  isOpen,
  onClose,
  pieceCount,
  roomType,
  totalBricks,
  onSelectModel,
}: ModelSelectorProps) {
  const [interpretations, setInterpretations] = useState<ModelInterpretation[]>([])
  const [selectedId, setSelectedId] = useState<string>('realistic')
  const [isLoading, setIsLoading] = useState(false)
  const [abstractQuery, setAbstractQuery] = useState('')
  const [shapeSuggestion, setShapeSuggestion] = useState<{
    pieces: Array<{ id: string; name: string; reason: string }>
    technique: string
  } | null>(null)
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null)

  useEffect(() => {
    if (isOpen && pieceCount.breakdown.length > 0 && interpretations.length === 0) {
      void loadInterpretations()
    }
  }, [isOpen, pieceCount, interpretations.length])

  const loadInterpretations = async () => {
    setIsLoading(true)
    try {
      const result = await generateModelInterpretations(
        pieceCount.breakdown.map((p) => ({
          part_id: p.part_id,
          quantity: p.quantity,
          piece_name: p.piece_name,
        })),
        roomType,
        totalBricks,
        ''
      )
      setConversionResult(result)
      setInterpretations(result.interpretations)
    } catch (error) {
      console.error('[ModelSelector] Failed to load interpretations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShapeQuery = () => {
    if (abstractQuery.trim()) {
      const suggestion = suggestPiecesForShape(abstractQuery)
      setShapeSuggestion(suggestion)
    }
  }

  const handleApply = () => {
    const selected = interpretations.find((i) => i.id === selectedId)
    if (selected) {
      onSelectModel(selected)
      onClose()
    }
  }

  if (!isOpen) return null

  const selectedInterpretation = interpretations.find((i) => i.id === selectedId)

  return (
    <div className="model-selector-overlay" onClick={onClose}>
      <motion.div
        className="model-selector-container"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="model-selector-header">
          <div className="header-icon">🧱</div>
          <div>
            <h2>Model styles</h2>
            <p>
              {roomType} · {totalBricks} bricks — plug in your interpreter / AI here.
            </p>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="model-selector-content">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading suggestions…</p>
            </div>
          ) : (
            <>
              <div className="model-options">
                <h3>Select build style</h3>
                <div className="options-grid">
                  {interpretations.map((interp) => (
                    <button
                      type="button"
                      key={interp.id}
                      className={`model-option ${selectedId === interp.id ? 'selected' : ''}`}
                      onClick={() => setSelectedId(interp.id)}
                    >
                      <div className="option-header">
                        <span className="option-name">{interp.title}</span>
                      </div>
                      <p className="option-description">{interp.description}</p>
                      {interp.style && (
                        <p className="option-stats">
                          <span className="stat">{interp.style}</span>
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {selectedInterpretation && (
                <div className="model-details">
                  <h3>Selected</h3>
                  <p className="text-sm text-gray-600">{selectedInterpretation.description}</p>
                </div>
              )}

              <div className="shape-helper">
                <h3>Shape helper</h3>
                <p>Describe a shape — wire your piece database to return matches.</p>
                <div className="shape-input-row">
                  <input
                    type="text"
                    placeholder="e.g. curved wall, sloped roof…"
                    value={abstractQuery}
                    onChange={(e) => setAbstractQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleShapeQuery()}
                  />
                  <button type="button" onClick={handleShapeQuery}>
                    Suggest
                  </button>
                </div>

                {shapeSuggestion && shapeSuggestion.technique && (
                  <div className="shape-suggestion">
                    <p className="technique-tip">{shapeSuggestion.technique}</p>
                    {shapeSuggestion.pieces.map((piece, idx) => (
                      <div key={idx} className="suggestion-piece">
                        <span className="piece-id">{piece.id}</span>
                        <span className="piece-name">{piece.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {conversionResult && (
                <p className="text-xs text-gray-500 mt-2">
                  Stub: {conversionResult.interpretations.length} interpretation(s) loaded.
                </p>
              )}
            </>
          )}
        </div>

        <div className="model-selector-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleApply}
            disabled={!selectedInterpretation || isLoading}
          >
            Apply {selectedInterpretation?.title ?? 'style'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
