// GameCanvas.tsx — Main game canvas component (Phase 2)
import { useEffect, useRef, useState, useCallback } from 'react'
import { Engine } from '../engine/Engine'
import type { EngineState, BiomeType } from '../engine/types'
import { HUD } from './HUD'
import { InventoryPanel } from './InventoryPanel'
import { NotificationStack } from './NotificationStack'

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
  const [showInventory, setShowInventory] = useState(false)
  const [notifications, setNotifications] = useState<string[]>([])

  const handleStateChange = useCallback((s: EngineState) => {
    setState(s)
    if (s.notifications.length > 0) {
      setNotifications(prev => [...prev, ...s.notifications].slice(-6))
      // Auto-remove after 3s
      setTimeout(() => {
        setNotifications(prev => prev.slice(s.notifications.length))
      }, 3000)
    }
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

    engine.load()
    engine.start()
    engineRef.current = engine

    // Keyboard shortcuts
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'i' || e.key === 'I' || e.key === 'Tab') {
        e.preventDefault()
        setShowInventory(prev => !prev)
      }
      if (e.key === 'Escape') {
        setShowInventory(false)
      }
    }
    window.addEventListener('keydown', onKey)

    return () => {
      engine.stop()
      engine.save()
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', onKey)
    }
  }, [handleStateChange])

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ touchAction: 'none' }}
      />

      {/* HUD */}
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
          equippedTool={state.player.equippedTool}
          inventoryCount={state.player.inventory.length}
        />
      )}

      {/* Notifications */}
      <NotificationStack notifications={notifications} />

      {/* Inventory overlay */}
      {showInventory && state && (
        <InventoryPanel
          inventory={state.player.inventory}
          onClose={() => setShowInventory(false)}
        />
      )}

      {/* Controls hint */}
      <div className="absolute bottom-20 left-4 text-white/30 text-xs select-none pointer-events-none">
        WASD=Move · Shift=Run · E=Gather · 1-5=Hotbar · I=Inventory · Scroll=Zoom
      </div>
    </div>
  )
}
