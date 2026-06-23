import { motion } from 'framer-motion'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-green-950 via-green-900 to-green-950 flex flex-col items-center justify-center z-[200]">
      {/* Farm art */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="text-7xl mb-4"
        >
          🌾
        </motion.div>
        <h1 className="text-3xl font-bold text-white mb-2">Dream Farm Life</h1>
        <p className="text-green-400 text-sm mb-8">Build your dream farm ✨</p>

        {/* Loading bar */}
        <div className="w-48 h-1.5 bg-green-900 rounded-full mx-auto overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-green-500 to-yellow-400 rounded-full"
          />
        </div>
        <p className="text-green-500 text-xs mt-3 animate-pulse">Loading farm...</p>
      </motion.div>

      {/* Floating emojis */}
      {['🌱', '🌽', '🥕', '🍅', '🎃', '🐔', '🐄', '🐑'].map((emoji, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: [0, 0.3, 0], y: -200 }}
          transition={{
            duration: 3,
            delay: i * 0.3,
            repeat: Infinity,
            repeatDelay: 2,
          }}
          className="absolute text-2xl"
          style={{ left: `${10 + i * 11}%`, bottom: '10%' }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  )
}
