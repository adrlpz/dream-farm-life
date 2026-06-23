import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ACHIEVEMENTS, checkAchievements, Achievement } from '../data/achievements'
import { useGameStore } from './gameStore'

interface AchievementState {
  unlocked: string[]
  pendingRewards: Achievement[]
  justUnlocked: Achievement | null

  // Actions
  checkForNew: () => void
  claimReward: (id: string) => void
  dismissToast: () => void
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      unlocked: [],
      pendingRewards: [],
      justUnlocked: null,

      checkForNew: () => {
        const gameState = useGameStore.getState()
        const { unlocked } = get()
        const newAchievements = checkAchievements(gameState, unlocked)

        if (newAchievements.length > 0) {
          const first = newAchievements[0]
          set((s) => ({
            unlocked: [...s.unlocked, ...newAchievements.map((a) => a.id)],
            pendingRewards: [...s.pendingRewards, ...newAchievements],
            justUnlocked: first,
          }))
        }
      },

      claimReward: (id) => {
        const { pendingRewards } = get()
        const reward = pendingRewards.find((a) => a.id === id)
        if (!reward) return

        // Apply rewards to game state
        useGameStore.setState((s) => ({
          player: {
            ...s.player,
            coins: s.player.coins + (reward.reward.coins || 0),
            gems: s.player.gems + (reward.reward.gems || 0),
          },
        }))

        set((s) => ({
          pendingRewards: s.pendingRewards.filter((a) => a.id !== id),
        }))
      },

      dismissToast: () => set({ justUnlocked: null }),
    }),
    {
      name: 'dream-farm-achievements',
      partialize: (state) => ({ unlocked: state.unlocked }),
    }
  )
)
