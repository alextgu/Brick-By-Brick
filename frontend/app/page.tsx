'use client'

import { useEffect, useRef, useState } from 'react'
import InstructionBook from './components/InstructionBook'
import { ModelDetailsDisplay } from './components/ModelDetailsDisplay'
import ModelSelector from './components/ModelSelector'
import {
  loadManifestFromFile,
  processManifestWithBackboard,
  type InstructionManual,
  type PieceCount,
  type LegoMemoryEntry,
} from '../lib/legoManualGenerator'

const emptyManualData: InstructionManual = {
  total_steps: 0,
  difficulty: 'N/A',
  estimated_time_minutes: 0,
  steps: [],
  layer_summary: {},
}

const emptyPieceCount: PieceCount = {
  total_pieces: 0,
  total_unique: 0,
  breakdown: [],
  by_category: {},
  by_color: {},
  estimated_cost: 0,
}

export default function Home() {
  const envContainerRef = useRef<HTMLDivElement>(null)
  const envPanelRef = useRef<HTMLDivElement>(null)
  const [showInstructionBook, setShowInstructionBook] = useState(false)
  const [showNothingModal, setShowNothingModal] = useState(false)
  const [hasEnvironment, setHasEnvironment] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [showThreeJS, setShowThreeJS] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const threeJSRendererRef = useRef<{ cleanup: () => void } | null>(null)

  const [buildData, setBuildData] = useState<LegoMemoryEntry | null>(null)
  const [manualData, setManualData] = useState<InstructionManual>(emptyManualData)
  const [pieceCount, setPieceCount] = useState<PieceCount>(emptyPieceCount)
  const [projectName, setProjectName] = useState('Demo build')

  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const [objects, setObjects] = useState<Array<{ id: string; name: string }>>([])
  const [selectedModelAnalysis, setSelectedModelAnalysis] = useState<{
    modelName: string
    modelType: string
    description: string
    extractedPieces: Array<{
      part_id: string
      name: string
      quantity: number
      color_id?: number
      color_name?: string
      reasoning: string
    }>
  } | null>(null)
  const [showModelDetails, setShowModelDetails] = useState(false)
  const [showModelSelector, setShowModelSelector] = useState(false)

  const toggleFullscreen = () => {
    if (!envPanelRef.current) return
    if (!isFullscreen) {
      void envPanelRef.current.requestFullscreen?.()
      setIsFullscreen(true)
    } else {
      void document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  useEffect(() => {
    if (!showThreeJS || !envContainerRef.current) return
    if (threeJSRendererRef.current) {
      threeJSRendererRef.current.cleanup()
      threeJSRendererRef.current = null
    }
    const container = envContainerRef.current
    while (container.firstChild) container.removeChild(container.firstChild)

    let cancelled = false
    const timer = setTimeout(async () => {
      try {
        const THREE = await import('three')
        const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')
        if (cancelled || !envContainerRef.current) return
        const c = envContainerRef.current
        const w = c.clientWidth
        const h = c.clientHeight
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xf2f2f0)
        const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
        camera.position.set(2.5, 2, 2.5)
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(w, h)
        c.appendChild(renderer.domElement)
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.target.set(0, 0.5, 0)
        controls.enableDamping = true
        scene.add(new THREE.AmbientLight(0xffffff, 0.65))
        const pl = new THREE.PointLight(0xffffff, 1.2)
        pl.position.set(2, 4, 2)
        scene.add(pl)
        const mesh = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshStandardMaterial({ color: 0xc62828, roughness: 0.45 })
        )
        mesh.position.y = 0.5
        scene.add(mesh)
        const floor = new THREE.Mesh(
          new THREE.PlaneGeometry(8, 8),
          new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.9 })
        )
        floor.rotation.x = -Math.PI / 2
        scene.add(floor)
        const loop = () => {
          if (cancelled) return
          requestAnimationFrame(loop)
          controls.update()
          renderer.render(scene, camera)
        }
        loop()
        const onResize = () => {
          if (!envContainerRef.current) return
          const cw = envContainerRef.current.clientWidth
          const ch = envContainerRef.current.clientHeight
          camera.aspect = cw / ch
          camera.updateProjectionMatrix()
          renderer.setSize(cw, ch, false)
        }
        window.addEventListener('resize', onResize)
        threeJSRendererRef.current = {
          cleanup: () => {
            cancelled = true
            window.removeEventListener('resize', onResize)
            if (c.contains(renderer.domElement)) c.removeChild(renderer.domElement)
            renderer.dispose()
          },
        }
      } catch (e) {
        console.error(e)
      }
    }, 50)

    return () => {
      clearTimeout(timer)
      cancelled = true
      threeJSRendererRef.current?.cleanup()
      threeJSRendererRef.current = null
    }
  }, [showThreeJS])

  const loadDemoBuild = async () => {
    setUploading(true)
    setUploadStatus('Loading demo manifest…')
    try {
      const manifest = await loadManifestFromFile('/demo-manifest.json')
      const entry = processManifestWithBackboard(manifest, projectName, 'demo')
      setBuildData(entry)
      setManualData(entry.instruction_manual)
      setPieceCount(entry.piece_count)
      setHasEnvironment(true)
      setUploadStatus('Demo build ready.')
      setShowThreeJS(true)
    } catch (e) {
      setUploadStatus(`Error: ${e instanceof Error ? e.message : 'Failed'}`)
    } finally {
      setUploading(false)
    }
  }

  const confirmRemove = () => setShowRemoveConfirm(true)

  const handleRemove = () => {
    setShowRemoveConfirm(false)
    threeJSRendererRef.current?.cleanup()
    threeJSRendererRef.current = null
    setUploadStatus(null)
    setShowThreeJS(false)
    setHasEnvironment(false)
    setBuildData(null)
    setManualData(emptyManualData)
    setPieceCount(emptyPieceCount)
    setObjects([])
  }

  const openMockModelDetails = () => {
    setSelectedModelAnalysis({
      modelName: 'Sample object',
      modelType: 'Placeholder',
      description: 'Replace with real analysis from your pipeline.',
      extractedPieces: [
        {
          part_id: '3001',
          name: 'Brick 2×4',
          quantity: 2,
          color_name: 'Red',
          reasoning: 'Demo row',
        },
      ],
    })
    setShowModelDetails(true)
  }

  return (
    <>
      <header>
        <h1 className="header-logo-left" style={{ marginLeft: '72px', fontSize: '1.5rem', fontWeight: 800 }}>
          Brick by Brick
        </h1>
      </header>

      <div className="hero-section">
        <div className="content-wrapper">
          <div className="text-section">
            <h1>
              Build
              <br />
              your <em>identity,</em>
            </h1>
            <p className="tagline">piece by piece.</p>
            <p>
              Scaffold UI: load the demo manifest, open the instruction book, and extend with your own pipelines.
            </p>
          </div>
          <div className="visual-section">
            <img
              src="/piece_by_piece.svg"
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>

      <div className="builder-container">
        <div className="builder-top-row">
          <div className={`env-wrapper ${isFullscreen ? 'fullscreen-mode' : ''}`} ref={envPanelRef}>
            <div className="panel-header header-bg-red">Environment</div>
            <div className="panel panel-content">
              {!showThreeJS ? (
                <div className="video-upload-area">
                  <button type="button" className="upload-label" onClick={loadDemoBuild} disabled={uploading}>
                    <i className="fa-solid fa-cube" style={{ fontSize: '48px', marginBottom: '15px', color: '#888' }} />
                    <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>Load demo build</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Uses /public/demo-manifest.json</div>
                  </button>
                  {uploadStatus && (
                    <div className={`upload-status ${uploadStatus.startsWith('Error') ? 'error' : 'success'}`}>
                      {uploadStatus}
                    </div>
                  )}
                </div>
              ) : (
                <div className="video-preview-container" style={{ padding: 0, overflow: 'hidden' }}>
                  <div
                    ref={envContainerRef}
                    style={{ width: '100%', height: '100%', minHeight: '400px', position: 'relative' }}
                  />
                  <div className="video-controls-overlay">
                    <button type="button" onClick={confirmRemove} className="remove-btn" title="Reset">
                      <i className="fa-solid fa-times" />
                    </button>
                  </div>
                </div>
              )}
              <div className="zoom-controls">
                <button type="button" className="zoom-btn" onClick={toggleFullscreen} title="Fullscreen">
                  <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="obj-wrapper">
            <div className="panel-header header-bg-cyan">Objects</div>
            <div className="panel panel-content">
              <div className="objects-grid">
                {objects.map((obj) => (
                  <div key={obj.id} className="obj-item" title={obj.name}>
                    <div style={{ fontSize: '24px' }}>📦</div>
                    <div style={{ fontSize: '10px', marginTop: '4px', textAlign: 'center' }}>
                      {obj.name.substring(0, 8)}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="obj-add"
                  onClick={() => setObjects((o) => [...o, { id: `o-${Date.now()}`, name: 'Item' }])}
                  title="Add placeholder object"
                >
                  <i className="fa-solid fa-plus" />
                </button>
              </div>
              <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '12px', color: '#666' }}>
                <button type="button" className="view-details-btn" onClick={() => setShowModelSelector(true)}>
                  Model styles
                </button>
                {' · '}
                <button type="button" className="view-details-btn" onClick={openMockModelDetails}>
                  Mock model details
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="full-set-row">
          <div className="panel-header header-bg-orange">Full Set</div>
          <div className="box-art-container" style={{ position: 'relative' }}>
            <div className="lego-box-perspective">
              <div className="box-spine">
                <div className="spine-logo">
                  B<span>B</span>
                </div>
                <div className="spine-age">9+</div>
                <div className="spine-sku">000001</div>
                <div className="spine-line" />
                <div className="spine-name">{projectName || 'Your set name'}</div>
                <div className="spine-pcs">
                  {pieceCount?.total_pieces ?? '—'}
                  <br />
                  pcs
                </div>
                <div className="spine-sub">
                  Building Toy
                  <br />
                  Jouet de construction
                </div>
              </div>
              <div className="box-front">
                <div className="box-front-text">
                  {hasEnvironment ? projectName : 'Load a build to populate this box'}
                </div>
              </div>
            </div>
          </div>
          <div className="full-set-buttons">
            <button
              type="button"
              className="view-details-btn"
              onClick={() => {
                if (hasEnvironment) setShowInstructionBook(true)
                else setShowNothingModal(true)
              }}
            >
              <i className="fa-solid fa-book" />
              View Details
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '1rem 2rem 2rem', maxWidth: 720 }}>
        <label htmlFor="project-name" style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>
          Project name
        </label>
        <input
          id="project-name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc' }}
        />
      </div>

      {showNothingModal && (
        <div className="nothing-modal-overlay" onClick={() => setShowNothingModal(false)}>
          <div className="nothing-modal-content" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="nothing-modal-close" onClick={() => setShowNothingModal(false)}>
              ✕
            </button>
            <div className="nothing-modal-icon">🧱</div>
            <h2 className="nothing-modal-title">No build loaded</h2>
            <p className="nothing-modal-text">Load the demo build first.</p>
          </div>
        </div>
      )}

      {showRemoveConfirm && (
        <div className="confirm-modal-overlay" onClick={() => setShowRemoveConfirm(false)}>
          <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-icon">⚠️</div>
            <h2 className="confirm-modal-title">Reset environment?</h2>
            <p className="confirm-modal-text">Clears the demo build and 3D view.</p>
            <div className="confirm-modal-buttons">
              <button type="button" className="confirm-btn confirm-btn-cancel" onClick={() => setShowRemoveConfirm(false)}>
                Cancel
              </button>
              <button type="button" className="confirm-btn confirm-btn-remove" onClick={handleRemove}>
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {showInstructionBook && (
        <InstructionBook
          projectName={projectName}
          manual={manualData}
          pieceCount={pieceCount}
          isOpen={showInstructionBook}
          onClose={() => setShowInstructionBook(false)}
        />
      )}

      {showModelDetails && selectedModelAnalysis && (
        <ModelDetailsDisplay modelAnalysis={selectedModelAnalysis} onClose={() => setShowModelDetails(false)} />
      )}

      <ModelSelector
        isOpen={showModelSelector}
        onClose={() => setShowModelSelector(false)}
        pieceCount={pieceCount}
        roomType="demo"
        totalBricks={buildData?.manifest.total_bricks ?? 0}
        onSelectModel={() => setShowModelSelector(false)}
      />
    </>
  )
}
