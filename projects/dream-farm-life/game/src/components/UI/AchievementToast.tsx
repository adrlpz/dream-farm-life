import { motion, AnimatePresence } from 'framer-motion'
import { useAchievementStore } from '../../store/achievementStore'
import { useEffect } from 'react'

export default function AchievementToast() {
  const { justUnlocked, dismissToast } = useAchievementStore()

  useEffect(() => {
    if (justUnlocked) {
      const timer = setTimeout(dismissToast, 4000)
      return () => clearTimeout(timer)
    }
  }, [justUnlocked, dismissToast])

  return (
    <AnimatePresence>
      {justUnlocked && (
        <motion.div
          initial={{ opacity: 0, y: -60, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -60, x: '-50%' }}
          className="fixed top-16 left-1/2 z-[80] w-72"
          onClick={dismissToast}
        >
          <div className="bg-gradient-to-r from-yellow-900/95 to-amber-900/95 backdrop-blur-lg border border-yellow-500/50 rounded-xl px-4 py-3 shadow-xl shadow-yellow-900/30">
            <div className="flex items-center gap-3">
              <motion.span
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                className="text-3xl"
              >
                {justUnlocked.emoji}
              </motion.span>
              <div className="flex-1 min-w-0">
                <p className="text-yellow-300 text-[10px] font-bold uppercase tracking-wide">Achievement Unlocked!</p>
                <p className="text-white font-bold text-sm truncate">{justUnlocked.name}</p>
                <p className="text-yellow-100/70 text-[10px]">{justUnlocked.description}</p>
              </div>
            </div>
            {justUnlocked.reward && (
              <div className="flex gap-2 mt-2 pt-2 border-t border-yellow-700/40">
                {justUnlocked.reward.coins && (
                  <span className="text-yellow-300 text-[10px]">🪙 +{justUnlocked.reward.coins}</span>
                )}
                {justUnlocked.reward.gems && (
                  <span className="text-purple-300 text-[10px]">💎 +{justUnlocked.reward.gems}</span>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
