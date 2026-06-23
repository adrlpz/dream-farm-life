import { useGameStore } from '../../store/gameStore'
import { useWalletStore } from '../../store/walletStore'
import { WalletButton } from '../Wallet'
import { dailyBonusForDay, STREAK_REWARDS } from '../../data/levels'
import { motion } from 'framer-motion'

export default function HUD() {
  const player = useGameStore((s) => s.player)
  const totalHarvests = useGameStore((s) => s.totalHarvests)
  const claimDailyBonus = useGameStore((s) => s.claimDailyBonus)
  const day = useGameStore((s) => s.day)
  const connected = useWalletStore((s) => s.connected)
  const dreamBalance = useWalletStore((s) => s.dreamBalance)

  const xpPercent = player.xpToNext > 0 ? (player.xp / player.xpToNext) * 100 : 0

  return (
    <header className="bg-green-950/95 backdrop-blur border-b border-green-800/50 px-3 py-2 sticky top-0 z-50">
      <div className="flex items-center gap-3 max-w-lg mx-auto">
        {/* Level badge */}
        <div className="flex flex-col items-center">
          <motion.div
            key={player.level}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="w-10 h-10 rounded-full bg-farm-grass/80 flex items-center justify-center text-white font-bold text-sm border-2 border-green-400"
          >
            {player.level}
          </motion.div>
          <div className="w-10 h-1 bg-green-900 rounded-full mt-0.5">
            <div
              className="h-full bg-farm-grass rounded-full transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 grid grid-cols-3 gap-2">
          <StatBadge icon="🪙" value={player.coins.toLocaleString()} label="Coins" />
          <StatBadge icon="💎" value={player.gems.toString()} label="Gems" />
          <StatBadge icon="🌾" value={totalHarvests.toLocaleString()} label="Harvests" />
        </div>

        {/* Daily bonus */}
        <button
          onClick={() => claimDailyBonus()}
          className="bg-yellow-600/80 hover:bg-yellow-500 text-white text-xs font-bold py-1.5 px-2 rounded-lg transition-all active:scale-95"
          title={`Day ${day} — Claim ${dailyBonusForDay(day)} coins`}
        >
          🎁 Day {day}
        </button>

        {/* Wallet + $DREAM balance */}
        <div className="flex flex-col items-end gap-0.5">
          <WalletButton />
          {connected && (
            <span className="text-purple-300 text-[9px]">✨ {dreamBalance.toFixed(0)} $DREAM</span>
          )}
        </div>
      </div>
    </header>
  )
}

function StatBadge({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="flex items-center gap-1 bg-green-900/50 rounded-lg px-2 py-1">
      <span className="text-sm">{icon}</span>
      <div className="flex flex-col">
        <span className="text-white text-xs font-bold leading-tight">{value}</span>
        <span className="text-green-400 text-[9px] leading-tight">{label}</span>
      </div>
    </div>
  )
}
