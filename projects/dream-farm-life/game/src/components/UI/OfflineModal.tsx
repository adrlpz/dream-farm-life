import { motion } from 'framer-motion'
import { ANIMALS_COMPAT as ANIMALS } from '../../types'

interface Props {
  offlineMs: number
  products: { animalId: string; count: number }[]
  onClose: () => void
}

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  if (totalSec < 60) return `${totalSec}s`
  const min = Math.floor(totalSec / 60)
  if (min < 60) return `${min}m`
  const hr = Math.floor(min / 60)
  const remainMin = min % 60
  if (hr < 24) return `${hr}h ${remainMin}m`
  const day = Math.floor(hr / 24)
  return `${day}d ${hr % 24}h`
}

export default function OfflineModal({ offlineMs, products, onClose }: Props) {
  const totalProducts = products.reduce((sum, p) => sum + p.count, 0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-[100] p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        className="card max-w-sm w-full text-center"
      >
        <span className="text-5xl">🌙</span>
        <h2 className="text-xl font-bold text-white mt-2">Welcome Back!</h2>
        <p className="text-green-400 text-sm mt-1">
          You were away for <span className="text-white font-bold">{formatDuration(offlineMs)}</span>
        </p>

        {totalProducts > 0 && (
          <div className="mt-4 bg-green-900/50 rounded-lg p-3">
            <p className="text-xs text-green-300 mb-2">Your animals produced:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {products.map((p, i) => {
                const def = ANIMALS[p.animalId]
                return (
                  <div key={i} className="flex items-center gap-1 bg-green-800/50 rounded-lg px-2 py-1">
                    <span>{def?.productEmoji || '📦'}</span>
                    <span className="text-white font-bold text-sm">x{p.count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <button onClick={onClose} className="btn-primary w-full mt-4">
          🌾 Start Farming
        </button>
      </motion.div>
    </motion.div>
  )
}
