// Tutorial.tsx — First-time player tutorial overlay
import { useState } from 'react'

interface TutorialProps {
  onComplete: () => void
}

const TUTORIAL_STEPS = [
  {
    emoji: '🌾',
    title: 'Welcome to Dream Farm Life!',
    text: 'Build your dream farm in an open world. Explore 8 biomes, grow crops, raise animals, and craft your way to success!',
  },
  {
    emoji: '🕹️',
    title: 'Controls',
    text: 'WASD to move · E to interact/gather · 1-5 for hotbar · I for inventory · Q for quests · C for crafting · K for skills',
  },
  {
    emoji: '🌱',
    title: 'Farming Basics',
    text: 'Equip your hoe, press E on grass to till soil. Plant seeds, water them, and harvest when ready. Crops grow over time!',
  },
  {
    emoji: '⛏️',
    title: 'Gathering Resources',
    text: 'Walk to trees, rocks, or bushes and press E to gather. Different tools work on different resources. Level up your skills!',
  },
  {
    emoji: '🗺️',
    title: 'Explore the World',
    text: 'Walk around to discover new biomes: forests, beaches, mountains, caves, tropical islands, and snowy peaks. Each has unique resources!',
  },
  {
    emoji: '⛓️',
    title: 'On-Chain Features',
    text: 'Press P to connect your Solana wallet. Earn $DREAM tokens, trade on the marketplace, and mint land NFTs!',
  },
]

export function Tutorial({ onComplete }: TutorialProps) {
  const [step, setStep] = useState(0)
  const current = TUTORIAL_STEPS[step]

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6 text-center">
          {/* Emoji */}
          <div className="text-5xl mb-4">{current.emoji}</div>

          {/* Title */}
          <h2 className="text-white font-bold text-xl mb-3">{current.title}</h2>

          {/* Text */}
          <p className="text-gray-400 text-sm leading-relaxed mb-6">{current.text}</p>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {TUTORIAL_STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === step ? 'bg-green-400 w-4' : i < step ? 'bg-green-600' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm cursor-pointer transition"
              >
                Back
              </button>
            )}

            {step < TUTORIAL_STEPS.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-sm cursor-pointer transition"
              >
                Next
              </button>
            ) : (
              <button
                onClick={onComplete}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-sm cursor-pointer transition"
              >
                Start Playing! 🚀
              </button>
            )}
          </div>

          {/* Skip */}
          <button
            onClick={onComplete}
            className="mt-4 text-gray-500 hover:text-gray-400 text-xs cursor-pointer transition"
          >
            Skip tutorial
          </button>
        </div>
      </div>
    </div>
  )
}
