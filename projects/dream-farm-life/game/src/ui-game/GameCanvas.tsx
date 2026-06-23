// GameCanvas.tsx — Main game canvas component (React wrapper)
import { useEffect, useRef, useState, useCallback } from 'react'
import { Engine } from '../engine/Engine'
import type { EngineState, BiomeType } from '../engine/types'
import { HUD } from './HUD'
import { TouchControls } from './TouchControls'

const BIOME_NAMES: Record<BiomeType, string> = {
  farmland: '🌾 Farmland',
  forest: '🌲 Forest',
  beach: '🏖️ Beach',
  mountain: '⛰️ Mountain',
  cave: '🌑 Dark Cave',
  snow: '❄️ Snow Mountain',
  tropical: '🌺 Tropical Island',
  desert: '🏜️ Desert',
}

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Engine | null>(null)
  const [state, setState] = useState<EngineState | null>(null)
  const [showControls, setShowControls] = useState(false)

  // Detect mobile
  useEffect(() => {
    setShowControls('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  const handleStateChange = useCallback((s: EngineState) => {
    setState(s)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const engine = new Engine({
      canvas,
      width: canvas.width,
      height: canvas.height,
      tileSize: 32,
      onStateChange: handleStateChange,
    })

    // Bind zoom
    engine.input.bindZoom((delta) => {
      engine.camera.setZoom(engine.camera.zoom + delta)
    })

    // Try to load saved game
    engine.load()

    // Auto-save every 30s
    const saveInterval = setInterval(() => engine.save(), 30000)
    window.addEventListener('beforeunload', () => engine.save())

    engine.start()
    engineRef.current = engine

    return () => {
      engine.stop()
      engine.save()
      clearInterval(saveInterval)
      window.removeEventListener('resize', resize)
    }
  }, [handleStateChange])

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ touchAction: 'none' }}
      />

      {/* HUD Overlay */}
      {state && (
        <HUD
          stamina={state.player.stamina}
          maxStamina={state.player.maxStamina}
          biome={BIOME_NAMES[state.currentBiome]}
          day={state.gameTime.day}
          hour={state.gameTime.hour}
          minute={state.gameTime.minute}
          season={state.gameTime.season}
          year={state.gameTime.year}
          discoveredChunks={state.discoveredChunks}
        />
      )}

      {/* Mobile Touch Controls */}
      {showControls && (
        <TouchControls
          onMove={(dx, dy) => {
            const engine = engineRef.current
            if (!engine) return
            engine.input // joystick handled via InputManager touch events
          }}
        />
      )}

      {/* Controls hint (desktop) */}
      {!showControls && (
        <div className="absolute bottom-4 left-4 text-white/40 text-xs select-none pointer-events-none">
          WASD / Arrows = Move · Shift = Run · Scroll = Zoom
        </div>
      )}
    </div>
  )
}
