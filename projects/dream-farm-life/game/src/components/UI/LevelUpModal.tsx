import { motion } from 'framer-motion'

interface Props {
  level: number
  onClose: () => void
}

const MILESTONES: Record<number, { title: string; reward: string; emoji: string }> = {
  2: { title: 'Apprentice Farmer', reward: 'Carrot seeds unlocked!', emoji: '🥕' },
  3: { title: 'Animal Whisperer', reward: 'Tomato seeds + Chickens unlocked!', emoji: '🐔' },
  5: { title: 'Seasoned Grower', reward: 'Potato seeds + Cows unlocked!', emoji: '🐄' },
  7: { title: 'Master Farmer', reward: 'Pumpkin seeds + Sheep unlocked!', emoji: '🎃' },
  9: { title: 'Farm Legend', reward: 'Strawberry seeds unlocked!', emoji: '🍓' },
  10: { title: 'Truffle Hunter', reward: 'Pigs unlocked!', emoji: '🐷' },
  12: { title: 'Vine Master', reward: 'Grape seeds unlocked!', emoji: '🍇' },
}

export default function LevelUpModal({ level, onClose }: Props) {
  const milestone = MILESTONES[level]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-[100] p-4"
    >
      <motion.div
        initial={{ scale: 0.5, rotate: -5 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="card max-w-xs w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring' }}
          className="text-6xl mb-2"
        >
          ⭐
        </motion.div>
        <h2 className="text-2xl font-bold text-yellow-300">Level Up!</h2>
        <div className="text-5xl font-display font-bold text-white my-2">{level}</div>

        {milestone && (
          <div className="mt-2 bg-yellow-900/30 rounded-lg p-3 border border-yellow-600/30">
            <p className="text-yellow-200 font-bold text-sm">{milestone.emoji} {milestone.title}</p>
            <p className="text-yellow-100/80 text-xs mt-1">{milestone.reward}</p>
          </div>
        )}

        <button onClick={onClose} className="btn-primary w-full mt-4">
          🎉 Awesome!
        </button>
      </motion.div>
    </motion.div>
  )
}
