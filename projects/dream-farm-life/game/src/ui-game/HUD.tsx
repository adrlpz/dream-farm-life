// HUD.tsx — Game HUD overlay (Phase 3: +farming)
import { TOOL_DEFS } from '../data/tools'

interface HUDProps {
  stamina: number
  maxStamina: number
  biome: string
  day: number
  hour: number
  minute: number
  season: string
  year: number
  discoveredChunks: number
  equippedTool: string | null
  inventoryCount: number
  farmingLevel: number
  farmingXp: number
  farmingXpToNext: number
  farmPlotCount: number
  activeQuestCount: number
  buildingCount: number
  claimSize: number
  weather?: { type: string; emoji: string; name: string }
  onlineCount?: number
}

export function HUD({
  stamina, maxStamina, biome, day, hour, minute, season, year,
  discoveredChunks, equippedTool, inventoryCount,
  farmingLevel, farmingXp, farmingXpToNext, farmPlotCount, activeQuestCount, buildingCount, claimSize, weather, onlineCount,
}: HUDProps) {
  const staminaPct = (stamina / maxStamina) * 100
  const farmXpPct = (farmingXp / farmingXpToNext) * 100
  const timeStr = `${String(hour).padStart(2, '0')}:${String(Math.floor(minute)).padStart(2, '0')}`
  const seasonEmoji = { spring: '🌸', summer: '☀️', fall: '🍂', winter: '❄️' }[season] ?? '🌍'
  const toolDef = equippedTool ? TOOL_DEFS[equippedTool] : null

  return (
    <>
      {/* Top-left */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 select-none pointer-events-none">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white text-sm font-medium">
          {biome}
        </div>
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white text-sm">
          {seasonEmoji} Day {day} · {timeStr} {weather ? weather.emoji : ''}
        </div>
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white/60 text-xs">
          Year {year} · {discoveredChunks} chunks
        </div>
      </div>

      {/* Top-right */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end select-none pointer-events-none">
        {/* Stamina */}
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="text-white/70 text-xs mb-1">⚡ Stamina</div>
          <div className="w-28 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${staminaPct}%`,
                backgroundColor: staminaPct > 50 ? '#4ade80' : staminaPct > 20 ? '#fbbf24' : '#ef4444',
              }}
            />
          </div>
          <div className="text-white/50 text-xs mt-0.5">{Math.round(stamina)} / {maxStamina}</div>
        </div>

        {/* Farming level */}
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="text-green-400 text-xs mb-1">🌱 Farming Lv.{farmingLevel}</div>
          <div className="w-28 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${farmXpPct}%` }}
            />
          </div>
          <div className="text-white/40 text-xs mt-0.5">{farmingXp} / {farmingXpToNext} xp</div>
        </div>

        {/* Tool */}
        {toolDef && (
          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white text-sm">
            {toolDef.emoji} {toolDef.name}
          </div>
        )}

        {/* Stats */}
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white/70 text-xs">
          🎒 {inventoryCount}/30 · 🌾 {farmPlotCount} plots · 📜 {activeQuestCount} · 🏗️ {buildingCount} · 🗺️ {claimSize}x{claimSize} · 👥 {onlineCount ?? 1}
        </div>
      </div>
    </>
  )
}
