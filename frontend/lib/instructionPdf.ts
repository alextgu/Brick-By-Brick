/**
 * Placeholder for PDF export — wire jspdf/html2canvas or a server route when needed.
 */
export async function downloadLegoPDF(_opts: {
  projectName: string
  manual: unknown
  pieceCount: unknown
  useGemini?: boolean
  geminiApiKey?: string
}): Promise<void> {
  if (typeof window !== 'undefined') {
    window.print()
  }
}
