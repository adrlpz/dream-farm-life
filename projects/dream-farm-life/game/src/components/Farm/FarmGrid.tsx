import { useGameStore } from '../../store/gameStore'
import PlotCell from './PlotCell'

export default function FarmGrid() {
  const plots = useGameStore((s) => s.plots)
  const gridSize = useGameStore((s) => s.gridSize)
  const expandGrid = useGameStore((s) => s.expandGrid)
  const coins = useGameStore((s) => s.player.coins)

  const expandCost = gridSize * 500
  const canExpand = gridSize < 8 && coins >= expandCost

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Farm title */}
      <div className="text-center">
        <h2 className="text-lg font-bold text-white text-shadow-sm">
          🌾 My Farm
        </h2>
        <p className="text-xs text-green-400">
          {gridSize}x{gridSize} • {plots.filter((p) => p.state !== 'locked').length} plots unlocked
        </p>
      </div>

      {/* Grid */}
      <div
        className="grid gap-1.5 p-2 bg-green-800/40 rounded-xl pixel-border"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          maxWidth: '100%',
          width: `${gridSize * 72}px`,
        }}
      >
        {plots.map((plot) => (
          <PlotCell key={plot.id} plot={plot} />
        ))}
      </div>

      {/* Expand button */}
      {gridSize < 8 && (
        <button
          onClick={() => expandGrid()}
          disabled={!canExpand}
          className={`text-sm py-2 px-6 rounded-lg font-bold transition-all ${
            canExpand
              ? 'btn-primary'
              : 'btn-disabled'
          }`}
        >
          📐 Expand Farm ({expandCost} 🪙)
        </button>
      )}
    </div>
  )
}
