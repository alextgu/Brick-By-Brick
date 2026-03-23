/**
 * Stubs for model interpretation — replace with your AI or API integration.
 */

import type { PieceCount } from './legoManualGenerator'

export interface ModelInterpretation {
  id: string
  title: string
  description: string
  style?: string
}

export interface ConversionResult {
  interpretations: ModelInterpretation[]
}

export const ALL_PIECES: Array<{ id: string; name: string }> = []

export async function generateModelInterpretations(
  _breakdown: Array<{ part_id: string; quantity: number; piece_name?: string }>,
  _roomType: string,
  _totalBricks: number,
  _apiKey: string
): Promise<ConversionResult> {
  return {
    interpretations: [
      {
        id: 'realistic',
        title: 'Realistic',
        description: 'Closest match to the scanned space.',
      },
      {
        id: 'stylized',
        title: 'Stylized',
        description: 'Simplified shapes, bolder colors.',
      },
    ],
  }
}

export function suggestPiecesForShape(query: string): {
  pieces: Array<{ id: string; name: string; reason: string }>
  technique: string
} {
  return {
    pieces: [],
    technique: query.trim() ? `Ideas for “${query.trim()}” — connect your piece database here.` : '',
  }
}

export function getPieceInfo(partId: string): { id: string; name: string } | null {
  return { id: partId, name: partId }
}
