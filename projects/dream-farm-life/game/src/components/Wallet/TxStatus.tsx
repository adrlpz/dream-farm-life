import { useWalletStore, PendingTx } from '../../store/walletStore'
import { queueAction, shouldAutoSettle } from '../../utils/batchSettle'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Clock, Send, Trash2 } from 'lucide-react'
import { useState } from 'react'

export function TxStatus() {
  const { pendingTxs, connected } = useWalletStore()
  const [expanded, setExpanded] = useState(false)

  if (!connected) return null

  const pending = pendingTxs.filter((tx) => tx.status === 'pending')
  const confirming = pendingTxs.filter((tx) => tx.status === 'confirming')
  const confirmed = pendingTxs.filter((tx) => tx.status === 'confirmed')
  const failed = pendingTxs.filter((tx) => tx.status === 'failed')
  const activeCount = pending.length + confirming.length

  return (
    <>
      {/* Floating badge */}
      {activeCount > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setExpanded(true)}
          className="fixed bottom-20 right-3 z-50 bg-purple-600 hover:bg-purple-500 text-white rounded-full p-3 shadow-lg shadow-purple-900/50 flex items-center gap-2"
        >
          <Send size={16} className="animate-pulse" />
          <span className="text-xs font-bold">{activeCount} pending</span>
        </motion.button>
      )}

      {/* Auto-settle indicator */}
      {shouldAutoSettle() && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-32 right-3 z-50 bg-yellow-600/90 text-white text-xs rounded-lg px-3 py-2 shadow-lg"
        >
          ⚡ Ready to settle {pending.length} actions on-chain
        </motion.div>
      )}

      {/* Expanded panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-green-950/98 backdrop-blur-lg border-l border-green-800/50 z-[60] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-green-800/50">
              <h3 className="text-white font-bold text-sm">⛓️ Transaction Queue</h3>
              <button onClick={() => setExpanded(false)} className="text-green-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-4 gap-2 px-4 py-3 border-b border-green-800/30">
              <StatusCount icon={<Clock size={12} />} count={pending.length} color="text-yellow-400" label="Pending" />
              <StatusCount icon={<Send size={12} />} count={confirming.length} color="text-blue-400" label="Sending" />
              <StatusCount icon={<CheckCircle size={12} />} count={confirmed.length} color="text-green-400" label="Done" />
              <StatusCount icon={<AlertCircle size={12} />} count={failed.length} color="text-red-400" label="Failed" />
            </div>

            {/* Actions */}
            {pending.length > 0 && (
              <div className="px-4 py-2 border-b border-green-800/30">
                <button
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-2 rounded-lg transition flex items-center justify-center gap-2"
                  onClick={() => {
                    // TODO: trigger actual settle_batch tx
                    alert(`Settle ${pending.length} actions on-chain (coming soon)`)
                  }}
                >
                  <Send size={14} />
                  Settle {pending.length} Actions Now
                </button>
              </div>
            )}

            {/* Tx list */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
              {pendingTxs.length === 0 && (
                <p className="text-green-500 text-xs text-center py-8">No transactions yet</p>
              )}
              {[...pendingTxs].reverse().map((tx, i) => (
                <TxItem key={`${tx.createdAt}-${i}`} tx={tx} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function StatusCount({
  icon, count, color, label,
}: { icon: React.ReactNode; count: number; color: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`${color}`}>{icon}</span>
      <span className={`text-xs font-bold ${color}`}>{count}</span>
      <span className="text-[8px] text-green-500">{label}</span>
    </div>
  )
}

function TxItem({ tx }: { tx: PendingTx }) {
  const statusIcon = {
    pending: <Clock size={12} className="text-yellow-400" />,
    confirming: <Send size={12} className="text-blue-400 animate-pulse" />,
    confirmed: <CheckCircle size={12} className="text-green-400" />,
    failed: <AlertCircle size={12} className="text-red-400" />,
  }[tx.status]

  const statusBg = {
    pending: 'border-yellow-800/40 bg-yellow-900/10',
    confirming: 'border-blue-800/40 bg-blue-900/10',
    confirmed: 'border-green-800/30 bg-green-900/5',
    failed: 'border-red-800/40 bg-red-900/10',
  }[tx.status]

  return (
    <div className={`border rounded-lg px-3 py-2 ${statusBg}`}>
      <div className="flex items-center gap-2">
        {statusIcon}
        <span className="text-xs text-white flex-1">{tx.description}</span>
      </div>
      {tx.signature && (
        <a
          href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[9px] text-purple-400 hover:underline mt-1 block truncate"
        >
          {tx.signature.slice(0, 20)}...
        </a>
      )}
      {tx.error && (
        <p className="text-[9px] text-red-400 mt-1">{tx.error}</p>
      )}
    </div>
  )
}
