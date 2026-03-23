/**
 * Placeholder for PDF export.
 * Replace with your jsPDF/html2canvas implementation later.
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

