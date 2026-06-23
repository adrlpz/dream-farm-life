import { useEffect, useState, useCallback } from 'react'
import { useGameStore } from './store/gameStore'
import { useAchievementStore } from './store/achievementStore'
import { SolanaWalletProvider, TxStatus } from './components/Wallet'
import FarmGrid from './components/Farm/FarmGrid'
import HUD from './components/HUD/HUD'
import SeedShop from './components/Market/SeedShop'
import AnimalShop from './components/Market/AnimalShop'
import PriceTable from './components/Market/PriceTable'
import InventoryPanel from './components/Inventory/InventoryPanel'
import OfflineModal from './components/UI/OfflineModal'
import LevelUpModal from './components/UI/LevelUpModal'
import AchievementToast from './components/UI/AchievementToast'
import AchievementPanel from './components/Achievement/AchievementPanel'
import Tutorial from './components/UI/Tutorial'
import LoadingScreen from './components/UI/LoadingScreen'
import { SettingsPanel } from './components/UI/SettingsPanel'
import { useSettings } from './components/UI/SettingsPanel'
import { ParticleLayer, useParticles } from './components/UI/Particles'
import { GameCanvas } from './ui-game/GameCanvas'

type Tab = 'farm' | 'shop' | 'animals' | 'inventory'

type GameMode = 'menu' | 'openworld' | 'classic'

const TUTORIAL_KEY = 'dream-farm-tutorial-done'

function ModeSelector({ onSelect }: { onSelect: (mode: 'openworld' | 'classic') => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-950 via-green-900 to-green-950 flex flex-col items-center justify-center gap-6 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">🌾 Dream Farm Life</h1>
        <p className="text-green-300">Choose your adventure</p>
      </div>
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <button
          onClick={() => onSelect('openworld')}
          className="bg-green-700 hover:bg-green-600 text-white rounded-xl p-6 text-left transition-all hover:scale-105 active:scale-95"
        >
          <div className="text-2xl mb-1">🌍 Open World</div>
          <div className="text-green-200 text-sm">Explore biomes, gather resources, build your farm anywhere</div>
        </button>
        <button
          onClick={() => onSelect('classic')}
          className="bg-green-800/60 hover:bg-green-700/60 text-white rounded-xl p-6 text-left transition-all hover:scale-105 active:scale-95"
        >
          <div className="text-2xl mb-1">🏡 Classic Farm</div>
          <div className="text-green-300/70 text-sm">Original grid-based farming (legacy)</div>
        </button>
      </div>
    </div>
  )
}

function ClassicFarm() {
  const [activeTab, setActiveTab] = useState<Tab>('farm')
  const [showOffline, setShowOffline] = useState(false)
  const [offlineData, setOfflineData] = useState({ offlineMs: 0, products: [] as { animalId: string; count: number }[] })
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [prevLevel, setPrevLevel] = useState(1)
  const [showTutorial, setShowTutorial] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showPriceTable, setShowPriceTable] = useState(false)
  const [loading, setLoading] = useState(true)

  const tick = useGameStore((s) => s.tick)
  const processOfflineProgress = useGameStore((s) => s.processOfflineProgress)
  const level = useGameStore((s) => s.player.level)
  const checkAchievements = useAchievementStore((s) => s.checkForNew)

  const { settings, setSettings, playSound } = useSettings()
  const { particles, spawn } = useParticles()

  // Loading screen
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800)
    return () => clearTimeout(timer)
  }, [])

  // Check tutorial on mount
  useEffect(() => {
    if (!loading) {
      const done = localStorage.getItem(TUTORIAL_KEY)
      if (!done) setShowTutorial(true)
    }
  }, [loading])

  const completeTutorial = useCallback(() => {
    localStorage.setItem(TUTORIAL_KEY, '1')
    setShowTutorial(false)
    playSound('levelup')
  }, [playSound])

  // Tick game state every second
  useEffect(() => {
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [tick])

  // Check achievements every 3 seconds
  useEffect(() => {
    const interval = setInterval(checkAchievements, 3000)
    return () => clearInterval(interval)
  }, [checkAchievements])

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
      playSound('levelup')
    }
  }, [level, prevLevel, playSound])

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'farm', label: 'Farm', icon: '🌾' },
    { id: 'shop', label: 'Seeds', icon: '🌱' },
    { id: 'animals', label: 'Animals', icon: '🐄' },
    { id: 'inventory', label: 'Items', icon: '🎒' },
  ]

  if (loading) return <LoadingScreen />

  return (
    <SolanaWalletProvider>
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
            onClick={() => { setActiveTab(tab.id); playSound('click') }}
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
        {/* Extra buttons */}
        <button
          onClick={() => { setShowAchievements(true); playSound('click') }}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all text-yellow-400 hover:text-yellow-200"
        >
          <span className="text-xl">🏆</span>
          <span className="text-[10px] font-medium">Awards</span>
        </button>
        <button
          onClick={() => { setShowPriceTable(true); playSound('click') }}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all text-blue-400 hover:text-blue-200"
        >
          <span className="text-xl">📊</span>
          <span className="text-[10px] font-medium">Guide</span>
        </button>
        <button
          onClick={() => { setShowSettings(true); playSound('click') }}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all text-gray-400 hover:text-gray-200"
        >
          <span className="text-xl">⚙️</span>
          <span className="text-[10px] font-medium">Settings</span>
        </button>
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
      {showTutorial && (
        <Tutorial onComplete={completeTutorial} />
      )}
      {showAchievements && (
        <AchievementPanel onClose={() => setShowAchievements(false)} />
      )}
      {showPriceTable && (
        <PriceTable onClose={() => setShowPriceTable(false)} />
      )}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onChange={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Toasts & overlays */}
      <AchievementToast />
      <TxStatus />
      {settings.particlesEnabled && <ParticleLayer particles={particles} />}
    </div>
    </SolanaWalletProvider>
  )
}

export default function App() {
  const [mode, setMode] = useState<GameMode>(() => {
    const saved = localStorage.getItem('dreamfarm-mode') as GameMode
    return saved ?? 'menu'
  })

  const handleSelect = (m: 'openworld' | 'classic') => {
    localStorage.setItem('dreamfarm-mode', m)
    setMode(m)
  }

  if (mode === 'menu') return <ModeSelector onSelect={handleSelect} />
  if (mode === 'openworld') return <GameCanvas />
  return <ClassicFarm />
}
