// QuestLog.tsx — Quest log overlay
import { QUESTS } from '../data/quests'
import type { ActiveQuest } from '../systems/QuestSystem'

interface QuestLogProps {
  activeQuests: ActiveQuest[]
  completedQuests: string[]
  onClose: () => void
  onAbandon: (questId: string) => void
}

export function QuestLog({ activeQuests, completedQuests, onClose, onAbandon }: QuestLogProps) {
  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900/95 border border-gray-700 rounded-2xl p-4 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white text-lg font-bold">📜 Quest Log</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        {/* Active quests */}
        {activeQuests.length > 0 && (
          <div className="mb-4">
            <h3 className="text-yellow-400 text-sm font-bold mb-2">Active Quests</h3>
            {activeQuests.map(aq => {
              const def = QUESTS[aq.questId]
              if (!def) return null
              return (
                <div key={aq.questId} className="bg-gray-800 rounded-lg p-3 mb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium text-sm">{def.name}</span>
                    {def.type === 'daily' && <span className="text-yellow-500 text-xs">Daily</span>}
                  </div>
                  <p className="text-gray-400 text-xs mt-1">{def.description}</p>
                  <div className="mt-2 space-y-1">
                    {def.objectives.map((obj, i) => {
                      const done = aq.progress[i] >= obj.count
                      return (
                        <div key={i} className={`text-xs ${done ? 'text-green-400' : 'text-gray-300'}`}>
                          {done ? '✅' : '⬜'} {obj.type} {obj.target}: {aq.progress[i]}/{obj.count}
                        </div>
                      )
                    })}
                  </div>
                  <button
                    onClick={() => onAbandon(aq.questId)}
                    className="text-red-400 hover:text-red-300 text-xs mt-2"
                  >
                    Abandon
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Completed */}
        {completedQuests.length > 0 && (
          <div>
            <h3 className="text-green-400 text-sm font-bold mb-2">Completed ({completedQuests.length})</h3>
            <div className="space-y-1">
              {completedQuests.map(qid => {
                const def = QUESTS[qid]
                if (!def) return null
                return (
                  <div key={qid} className="text-gray-500 text-xs flex items-center gap-2">
                    <span>✅</span>
                    <span>{def.name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeQuests.length === 0 && completedQuests.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-8">No quests yet. Talk to NPCs!</p>
        )}
      </div>
    </div>
  )
}
