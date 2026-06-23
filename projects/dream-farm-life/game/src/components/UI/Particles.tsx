import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Particle {
  id: string
  x: number
  y: number
  emoji: string
}

export function useParticles() {
  const [particles, setParticles] = useState<Particle[]>([])

  const spawn = useCallback((x: number, y: number, emoji: string, count = 3) => {
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      x: x + (Math.random() - 0.5) * 40,
      y: y + (Math.random() - 0.5) * 20,
      emoji,
    }))
    setParticles((prev) => [...prev, ...newParticles])
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)))
    }, 1000)
  }, [])

  return { particles, spawn }
}

export function ParticleLayer({ particles }: { particles: Particle[] }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[70]">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, x: p.x, y: p.y, scale: 1 }}
            animate={{ opacity: 0, y: p.y - 80, scale: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute text-2xl"
          >
            {p.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
