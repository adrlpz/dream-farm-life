import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'

const STEPS = [
  {
    emoji: '🌾',
    title: 'Welcome to Dream Farm Life!',
    description: 'Build your dream farm, grow crops, raise animals, and earn rewards!',
    tip: null,
  },
  {
    emoji: '🌱',
    title: 'Plant & Harvest',
    description: 'Tap an empty plot to plant seeds. Wait for them to grow, then tap to harvest!',
    tip: 'Each crop has different growth times and sell prices.',
  },
  {
    emoji: '🐄',
    title: 'Raise Animals',
    description: 'Buy animals from the Animals tab. Feed them crops to produce goods like eggs and milk!',
    tip: 'Happy animals produce bonus items!',
  },
  {
    emoji: '💰',
    title: 'Sell & Earn',
    description: 'Sell your harvest and animal products for coins. Use coins to buy seeds, animals, and expand your farm!',
    tip: null,
  },
  {
    emoji: '⛓️',
    title: 'Connect Wallet (Optional)',
    description: 'Connect your Solana wallet to earn $DREAM tokens and trade NFTs on-chain!',
    tip: 'You can play without a wallet — all progress saves locally.',
  },
]

export default function Tutorial({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[110] p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        className="card max-w-sm w-full text-center"
      >
        {/* Step indicator */}
        <div className="flex justify-center gap-1.5 mb-4">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === step ? 'bg-yellow-400 w-4' : i < step ? 'bg-green-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-5xl block mb-3"
            >
              {current.emoji}
            </motion.span>
            <h2 className="text-xl font-bold text-white mb-2">{current.title}</h2>
            <p className="text-green-300 text-sm mb-3">{current.description}</p>
            {current.tip && (
              <div className="bg-blue-900/30 border border-blue-600/30 rounded-lg px-3 py-2 mb-3">
                <p className="text-blue-300 text-xs">💡 {current.tip}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-2 mt-4">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 text-green-400 hover:text-green-200 text-sm px-3 py-2"
            >
              <ChevronLeft size={16} /> Back
            </button>
          )}
          <button
            onClick={isLast ? onComplete : () => setStep(step + 1)}
            className="btn-primary flex-1 flex items-center justify-center gap-1"
          >
            {isLast ? '🌾 Start Farming!' : <>Next <ChevronRight size={16} /></>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
