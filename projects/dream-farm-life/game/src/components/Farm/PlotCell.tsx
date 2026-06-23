import { useState } from 'react'
import { Plot, CropId } from '../../types'
import { useGameActions } from '../../hooks/useGameActions'
import { useGameStore } from '../../store/gameStore'
import { CROPS_COMPAT as CROPS } from '../../types'
import { motion, AnimatePresence } from 'framer-motion'

const STAGE_COUNT = 4

interface Props {
  plot: Plot
}

export default function PlotCell({ plot }: Props) {
  const [showPicker, setShowPicker] = useState(false)
  const [justHarvested, setJustHarvested] = useState(false)

  const { plantCrop, harvestCrop, unlockPlot } = useGameActions()
  const level = useGameStore((s) => s.player.level)
  const coins = useGameStore((s) => s.player.coins)

  const handleClick = () => {
    if (plot.state === 'locked') {
      const cost = 50 + plot.id * 10
      if (coins >= cost) unlockPlot(plot.id)
      return
    }
    if (plot.state === 'empty') {
      setShowPicker(!showPicker)
      return
    }
    if (plot.state === 'harvestable') {
      harvestCrop(plot.id)
      setJustHarvested(true)
      setTimeout(() => setJustHarvested(false), 600)
      return
    }
  }

  const getEmoji = () => {
    if (plot.state === 'locked') return '🔒'
    if (plot.state === 'empty') return '🟫'
    if (!plot.crop) return '🟫'
    const cropDef = CROPS[plot.crop.cropId]
    if (!cropDef) return '🟫'
    return cropDef.stages[plot.crop.stage] || cropDef.stages[0]
  }

  const getProgressPercent = () => {
    if (!plot.crop || plot.state === 'harvestable') return 0
    const cropDef = CROPS[plot.crop.cropId]
    if (!cropDef) return 0
    const timePerStage = cropDef.growTimeMs / (STAGE_COUNT - 1)
    const elapsed = Date.now() - plot.crop.plantedAt
    const progress = (elapsed % timePerStage) / timePerStage
    return Math.min(progress * 100, 100)
  }

  const unlockCost = 50 + plot.id * 10

  return (
    <div className="relative">
      <motion.button
        onClick={handleClick}
        whileTap={{ scale: 0.9 }}
        className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl relative overflow-hidden transition-colors ${
          plot.state === 'locked'
            ? 'bg-gray-700/50'
            : plot.state === 'empty'
            ? 'bg-farm-soil hover:bg-farm-soilDark'
            : plot.state === 'harvestable'
            ? 'bg-green-600/60 animate-pulse'
            : 'bg-farm-soil'
        }`}
      >
        {/* Growth progress bar */}
        {plot.crop && plot.state === 'planted' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
            <div
              className="h-full bg-green-400 transition-all duration-1000"
              style={{ width: `${getProgressPercent()}%` }}
            />
          </div>
        )}

        {/* Emoji */}
        <span className={justHarvested ? 'animate-bounce' : ''}>
          {getEmoji()}
        </span>

        {/* Water indicator */}
        {plot.crop?.watered && (
          <span className="absolute top-0 right-0.5 text-[8px]">💧</span>
        )}

        {/* Locked cost label */}
        {plot.state === 'locked' && (
          <span className="absolute bottom-0 text-[8px] text-yellow-300 font-bold">
            {unlockCost}
          </span>
        )}
      </motion.button>

      {/* Crop picker popup */}
      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 5 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-30"
          >
            <CropPicker
              onSelect={(cropId) => {
                plantCrop(plot.id, cropId as CropId)
                setShowPicker(false)
              }}
              onClose={() => setShowPicker(false)}
              playerLevel={level}
              playerCoins={coins}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CropPicker({
  onSelect,
  onClose,
  playerLevel,
  playerCoins,
}: {
  onSelect: (id: string) => void
  onClose: () => void
  playerLevel: number
  playerCoins: number
}) {
  const availableCrops = Object.values(CROPS).filter(
    (c) => c.unlockLevel <= playerLevel
  )

  return (
    <div className="card p-2 min-w-[180px]">
      <div className="text-xs text-green-300 font-bold mb-1 text-center">Plant seed:</div>
      <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
        {availableCrops.map((crop) => {
          const canAfford = playerCoins >= crop.seedCost
          return (
            <button
              key={crop.id}
              onClick={() => canAfford && onSelect(crop.id)}
              disabled={!canAfford}
              className={`flex items-center gap-2 px-2 py-1 rounded text-sm transition-all ${
                canAfford
                  ? 'hover:bg-green-700/50 text-white'
                  : 'text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>{crop.emoji}</span>
              <span className="flex-1 text-left text-xs">{crop.name}</span>
              <span className="text-xs text-yellow-400">{crop.seedCost}🪙</span>
            </button>
          )
        })}
      </div>
      <button
        onClick={onClose}
        className="w-full text-xs text-gray-400 mt-1 hover:text-white"
      >
        ✕ Close
      </button>
    </div>
  )
}
