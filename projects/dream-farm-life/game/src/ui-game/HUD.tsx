// HUD.tsx — Game HUD overlay
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
}

export function HUD({ stamina, maxStamina, biome, day, hour, minute, season, year, discoveredChunks }: HUDProps) {
  const staminaPct = (stamina / maxStamina) * 100
  const timeStr = `${String(hour).padStart(2, '0')}:${String(Math.floor(minute)).padStart(2, '0')}`
  const seasonEmoji = { spring: '🌸', summer: '☀️', fall: '🍂', winter: '❄️' }[season] ?? '🌍'

  return (
    <>
      {/* Top-left: Biome + Time */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 select-none pointer-events-none">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white text-sm font-medium">
          {biome}
        </div>
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white text-sm">
          {seasonEmoji} Day {day} · {timeStr}
        </div>
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white/70 text-xs">
          Year {year} · {discoveredChunks} chunks explored
        </div>
      </div>

      {/* Top-right: Stamina bar */}
      <div className="absolute top-3 right-36 select-none pointer-events-none">
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
      </div>
    </>
  )
}
