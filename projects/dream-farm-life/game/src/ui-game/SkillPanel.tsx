// SkillPanel.tsx — Skill overview panel
import { SKILLS, type SkillId, getNextPerk } from '../data/skills'
import type { SkillState } from '../systems/SkillSystem'

interface SkillPanelProps {
  skills: Record<SkillId, SkillState>
  onClose: () => void
}

export function SkillPanel({ skills, onClose }: SkillPanelProps) {
  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <h2 className="text-white font-bold text-lg">⚔️ Skills</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl cursor-pointer">✕</button>
        </div>

        {/* Skill list */}
        <div className="p-4 space-y-3">
          {(Object.entries(SKILLS) as [SkillId, typeof SKILLS['farming']][]).map(([id, def]) => {
            const state = skills[id]
            const xpPct = state ? (state.xp / (def.xpPerLevel * state.level)) * 100 : 0
            const nextPerk = getNextPerk(id, state?.level ?? 1)

            return (
              <div key={id} className="bg-gray-800/50 rounded-xl p-4">
                {/* Skill header */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{def.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{def.name}</span>
                      <span className="text-green-400 text-sm font-mono">Lv.{state?.level ?? 1}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full rounded-full bg-green-500 transition-all duration-300"
                        style={{ width: `${xpPct}%` }}
                      />
                    </div>
                    <div className="text-gray-500 text-xs mt-0.5">{state?.xp ?? 0} / {def.xpPerLevel * (state?.level ?? 1)} xp</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-xs mb-2">{def.description}</p>

                {/* Active perks */}
                {state && def.perks.filter(p => p.level <= state.level).length > 0 && (
                  <div className="space-y-1 mb-2">
                    {def.perks.filter(p => p.level <= state.level).map(perk => (
                      <div key={perk.level} className="flex items-center gap-2 text-xs">
                        <span className="text-green-400">✦</span>
                        <span className="text-white/80">{perk.name}</span>
                        <span className="text-gray-500">— {perk.description}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Next perk */}
                {nextPerk && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="text-gray-600">○</span>
                    <span>Next at Lv.{nextPerk.level}: <span className="text-yellow-500">{nextPerk.name}</span></span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-700 text-center">
          <p className="text-gray-500 text-xs">Earn XP by performing actions · Perks unlock every 10 levels</p>
        </div>
      </div>
    </div>
  )
}
