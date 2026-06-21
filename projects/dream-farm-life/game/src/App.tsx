import { useEffect, useState } from 'react'
import { useGameStore } from './store/gameStore'
import FarmGrid from './components/Farm/FarmGrid'
import HUD from './components/HUD/HUD'
import SeedShop from './components/Market/SeedShop'
import AnimalShop from './components/Market/AnimalShop'
import InventoryPanel from './components/Inventory/InventoryPanel'
import OfflineModal from './components/UI/OfflineModal'
import LevelUpModal from './components/UI/LevelUpModal'
import { CROPS } from './data/crops'

type Tab = 'farm' | 'shop' | 'animals' | 'inventory'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('farm')
  const [showOffline, setShowOffline] = useState(false)
  const [offlineData, setOfflineData] = useState({ offlineMs: 0, products: [] as { animalId: string; count: number }[] })
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [prevLevel, setPrevLevel] = useState(1)

  const tick = useGameStore((s) => s.tick)
  const processOfflineProgress = useGameStore((s) => s.processOfflineProgress)
  const level = useGameStore((s) => s.player.level)

  // Tick game state every second
  useEffect(() => {
    tick() // immediate first tick
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [tick])

  // Process offline progress on mount
  useEffect(() => {
    const result = processOfflineProgress()
    if (result.offlineMs > 10_000) {
      setOfflineData(result as any)
      setShowOffline(true)
    }
  }, [])

  // Level up detection
  useEffect(() => {
    if (level > prevLevel) {
      setShowLevelUp(true)
      setPrevLevel(level)
    }
  }, [level, prevLevel])

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'farm', label: 'Farm', icon: '🌾' },
    { id: 'shop', label: 'Seeds', icon: '🌱' },
    { id: 'animals', label: 'Animals', icon: '🐄' },
    { id: 'inventory', label: 'Items', icon: '🎒' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-950 via-green-900 to-green-950 flex flex-col">
      {/* HUD */}
      <HUD />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20 px-2 pt-2">
        {activeTab === 'farm' && <FarmGrid />}
        {activeTab === 'shop' && <SeedShop />}
        {activeTab === 'animals' && <AnimalShop />}
        {activeTab === 'inventory' && <InventoryPanel />}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-green-950/95 backdrop-blur border-t border-green-800/50 flex justify-around py-2 px-1 safe-area-bottom z-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-farm-grass/30 text-white scale-105'
                : 'text-green-400 hover:text-green-200'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Modals */}
      {showOffline && (
        <OfflineModal
          offlineMs={offlineData.offlineMs}
          products={offlineData.products}
          onClose={() => setShowOffline(false)}
        />
      )}
      {showLevelUp && (
        <LevelUpModal level={level} onClose={() => setShowLevelUp(false)} />
      )}
    </div>
  )
}
