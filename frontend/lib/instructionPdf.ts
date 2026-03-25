/**
 * Placeholder for PDF export.
 * Replace with your jsPDF/html2canvas implementation later.
 */
export async function downloadLegoPDF(opts: {
  projectName: string
  manual: unknown
  pieceCount: unknown
  useGemini?: boolean
  geminiApiKey?: string
}): Promise<void> {
  void opts
  if (typeof window !== 'undefined') {
    window.print()
  }
}

