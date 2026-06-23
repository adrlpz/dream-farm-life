// GameCanvas.tsx — Main game canvas (Phase 4: +NPCs, dialog, quests)
import { useEffect, useRef, useState, useCallback } from 'react'
import { Engine } from '../engine/Engine'
import type { EngineState, BiomeType } from '../engine/types'
import { HUD } from './HUD'
import { InventoryPanel } from './InventoryPanel'
import { NotificationStack } from './NotificationStack'
import { DialogUI } from './DialogUI'
import { QuestLog } from './QuestLog'
import type { ActiveQuest } from '../systems/QuestSystem'

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
  const [showQuestLog, setShowQuestLog] = useState(false)
  const [notifications, setNotifications] = useState<string[]>([])

  const handleStateChange = useCallback((s: EngineState) => {
    setState(s)
    if (s.notifications.length > 0) {
      setNotifications(prev => [...prev, ...s.notifications].slice(-6))
      setTimeout(() => setNotifications(prev => prev.slice(s.notifications.length)), 3000)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const engine = new Engine({
      canvas, width: canvas.width, height: canvas.height,
      tileSize: 32, onStateChange: handleStateChange,
    })
    engine.load()
    engine.start()
    engineRef.current = engine

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'i' || e.key === 'I' || e.key === 'Tab') { e.preventDefault(); setShowInventory(p => !p) }
      if (e.key === 'q' || e.key === 'Q') setShowQuestLog(p => !p)
      if (e.key === 'Escape') { setShowInventory(false); setShowQuestLog(false); engine.closeDialog() }
    }
    window.addEventListener('keydown', onKey)
    return () => { engine.stop(); engine.save(); window.removeEventListener('resize', resize); window.removeEventListener('keydown', onKey) }
  }, [handleStateChange])

  const engine = engineRef.current
  const dialogState = engine?.getNpcDialogState()

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      <canvas ref={canvasRef} className="block w-full h-full" style={{ touchAction: 'none' }} />

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
          farmingLevel={state.player.farmingLevel}
          farmingXp={state.player.farmingXp}
          farmingXpToNext={state.player.farmingXpToNext}
          farmPlotCount={state.farmPlotCount}
          activeQuestCount={state.activeQuests?.length ?? 0}
        />
      )}

      <NotificationStack notifications={notifications} />

      {/* Dialog UI */}
      {dialogState && engine && (
        <DialogUI
          npc={dialogState.npc}
          dialog={dialogState.dialog}
          questInfo={{
            available: dialogState.quests.available.map(q => ({ id: q.id, name: q.name, description: q.description })),
            completable: dialogState.quests.completable.map(id => {
              const q = dialogState.quests.active.find(a => a.questId === id)
              return { id, name: id }
            }),
          }}
          onChoice={() => {}}
          onStartQuest={(qid) => { engine.quests.startQuest(qid); engine.closeDialog() }}
          onCompleteQuest={(qid) => { engine.quests.completeQuest(qid, engine.player); engine.closeDialog() }}
          onClose={() => engine.closeDialog()}
        />
      )}

      {showInventory && state && (
        <InventoryPanel inventory={state.player.inventory} onClose={() => setShowInventory(false)} />
      )}

      {showQuestLog && state && engine && (
        <QuestLog
          activeQuests={engine.quests.activeQuests}
          completedQuests={engine.quests.completedQuests}
          onClose={() => setShowQuestLog(false)}
          onAbandon={(qid) => engine.quests.abandonQuest(qid)}
        />
      )}

      <div className="absolute bottom-20 left-4 text-white/30 text-xs select-none pointer-events-none">
        WASD=Move · E=Gather/Talk · 1-5=Hotbar · I=Inventory · Q=Quests · Esc=Close
      </div>
    </div>
  )
}
