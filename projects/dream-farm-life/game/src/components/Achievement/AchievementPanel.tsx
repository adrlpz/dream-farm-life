import { ACHIEVEMENTS } from '../../data/achievements'
import { useAchievementStore } from '../../store/achievementStore'
import { useGameStore } from '../../store/gameStore'
import { motion } from 'framer-motion'
import { useState } from 'react'

type Category = 'all' | 'harvest' | 'economy' | 'animal' | 'building' | 'special'

const CATEGORY_LABELS: Record<Category, { icon: string; label: string }> = {
  all: { icon: '🏆', label: 'All' },
  harvest: { icon: '🌾', label: 'Harvest' },
  economy: { icon: '💰', label: 'Economy' },
  animal: { icon: '🐄', label: 'Animals' },
  building: { icon: '🏠', label: 'Buildings' },
  special: { icon: '⭐', label: 'Special' },
}

export default function AchievementPanel({ onClose }: { onClose: () => void }) {
  const { unlocked, pendingRewards, claimReward } = useAchievementStore()
  const [filter, setFilter] = useState<Category>('all')

  const filtered = ACHIEVEMENTS.filter(
    (a) => filter === 'all' || a.category === filter
  )
  const totalUnlocked = unlocked.length
  const totalAchievements = ACHIEVEMENTS.length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-[90] p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="card max-w-md w-full max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-green-800/40">
          <div>
            <h2 className="text-lg font-bold text-white">🏆 Achievements</h2>
            <p className="text-green-400 text-xs">{totalUnlocked}/{totalAchievements} unlocked</p>
          </div>
          <button onClick={onClose} className="text-green-400 hover:text-white text-xl">✕</button>
        </div>

        {/* Category filter */}
        <div className="flex gap-1 px-4 py-2 overflow-x-auto border-b border-green-800/30">
          {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs whitespace-nowrap transition ${
                filter === cat
                  ? 'bg-yellow-600/40 text-yellow-200 border border-yellow-500/40'
                  : 'text-green-400 hover:text-green-200'
              }`}
            >
              <span>{CATEGORY_LABELS[cat].icon}</span>
              <span>{CATEGORY_LABELS[cat].label}</span>
            </button>
          ))}
        </div>

        {/* Pending rewards */}
        {pendingRewards.length > 0 && (
          <div className="px-4 py-2 border-b border-green-800/30 bg-yellow-900/20">
            <p className="text-yellow-300 text-xs font-bold mb-1">🎁 Unclaimed Rewards</p>
            <div className="flex flex-wrap gap-1">
              {pendingRewards.map((a) => (
                <button
                  key={a.id}
                  onClick={() => claimReward(a.id)}
                  className="flex items-center gap-1 bg-yellow-700/40 hover:bg-yellow-600/50 border border-yellow-500/30 rounded-lg px-2 py-1 text-xs transition"
                >
                  <span>{a.emoji}</span>
                  <span className="text-yellow-200">{a.name}</span>
                  {a.reward.coins && <span className="text-yellow-300">🪙{a.reward.coins}</span>}
                  {a.reward.gems && <span className="text-purple-300">💎{a.reward.gems}</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Achievement list */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
          {filtered.map((a) => {
            const isUnlocked = unlocked.includes(a.id)
            const isPending = pendingRewards.some((r) => r.id === a.id)

            return (
              <div
                key={a.id}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 border ${
                  isUnlocked
                    ? 'bg-green-900/30 border-green-700/30'
                    : 'bg-gray-900/30 border-gray-700/30'
                }`}
              >
                <span className={`text-2xl ${isUnlocked ? '' : 'grayscale opacity-40'}`}>
                  {a.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-sm ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                    {a.name}
                  </p>
                  <p className={`text-xs ${isUnlocked ? 'text-green-400' : 'text-gray-600'}`}>
                    {a.description}
                  </p>
                  <div className="flex gap-2 mt-0.5">
                    {a.reward.coins && (
                      <span className={`text-[10px] ${isUnlocked ? 'text-yellow-400' : 'text-gray-600'}`}>
                        🪙 {a.reward.coins}
                      </span>
                    )}
                    {a.reward.gems && (
                      <span className={`text-[10px] ${isUnlocked ? 'text-purple-400' : 'text-gray-600'}`}>
                        💎 {a.reward.gems}
                      </span>
                    )}
                  </div>
                </div>
                {isPending ? (
                  <button
                    onClick={() => claimReward(a.id)}
                    className="text-xs bg-yellow-600 hover:bg-yellow-500 text-white px-2 py-1 rounded-lg"
                  >
                    Claim
                  </button>
                ) : isUnlocked ? (
                  <span className="text-green-400 text-sm">✓</span>
                ) : (
                  <span className="text-gray-600 text-sm">🔒</span>
                )}
              </div>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}
