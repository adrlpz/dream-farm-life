import { useState, useEffect, useCallback } from 'react'

interface Settings {
  soundEnabled: boolean
  musicEnabled: boolean
  particlesEnabled: boolean
  autoSaveInterval: number // seconds
  showGridLabels: boolean
}

const DEFAULT_SETTINGS: Settings = {
  soundEnabled: true,
  musicEnabled: true,
  particlesEnabled: true,
  autoSaveInterval: 30,
  showGridLabels: false,
}

const STORAGE_KEY = 'dream-farm-settings'

function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
  } catch {}
  return DEFAULT_SETTINGS
}

function saveSettings(settings: Settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

// Simple audio context for sound effects
let audioCtx: AudioContext | null = null
function getAudioCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext()
  return audioCtx
}

// Synth sound effects (no external files needed)
const SOUNDS: Record<string, (ctx: AudioContext) => void> = {
  plant: (ctx) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(400, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1)
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
    osc.start()
    osc.stop(ctx.currentTime + 0.15)
  },
  harvest: (ctx) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(500, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15)
    osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.25)
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
    osc.start()
    osc.stop(ctx.currentTime + 0.3)
  },
  coin: (ctx) => {
    ;[600, 800].forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08)
      gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.12)
      osc.start(ctx.currentTime + i * 0.08)
      osc.stop(ctx.currentTime + i * 0.08 + 0.12)
    })
  },
  levelup: (ctx) => {
    ;[500, 600, 700, 800, 1000].forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08)
      gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.15)
      osc.start(ctx.currentTime + i * 0.08)
      osc.stop(ctx.currentTime + i * 0.08 + 0.15)
    })
  },
  click: (ctx) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(300, ctx.currentTime)
    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06)
    osc.start()
    osc.stop(ctx.currentTime + 0.06)
  },
  error: (ctx) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(200, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2)
    gain.gain.setValueAtTime(0.1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25)
    osc.start()
    osc.stop(ctx.currentTime + 0.25)
  },
}

export type SoundName = keyof typeof SOUNDS

export function useSettings() {
  const [settings, setSettingsState] = useState<Settings>(loadSettings)

  const setSettings = useCallback((update: Partial<Settings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...update }
      saveSettings(next)
      return next
    })
  }, [])

  const playSound = useCallback(
    (name: SoundName) => {
      if (!settings.soundEnabled) return
      try {
        const ctx = getAudioCtx()
        if (ctx.state === 'suspended') ctx.resume()
        SOUNDS[name]?.(ctx)
      } catch {}
    },
    [settings.soundEnabled]
  )

  return { settings, setSettings, playSound }
}

export function SettingsPanel({
  settings,
  onChange,
  onClose,
}: {
  settings: Settings
  onChange: (update: Partial<Settings>) => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center z-[85] p-4" onClick={onClose}>
      <div className="card max-w-xs w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-green-800/40">
          <h2 className="text-lg font-bold text-white">⚙️ Settings</h2>
          <button onClick={onClose} className="text-green-400 hover:text-white text-xl">✕</button>
        </div>

        <div className="px-4 py-3 space-y-3">
          <ToggleRow
            icon="🔊"
            label="Sound Effects"
            description="Plants, harvests, coins"
            value={settings.soundEnabled}
            onChange={(v) => onChange({ soundEnabled: v })}
          />
          <ToggleRow
            icon="🎵"
            label="Music"
            description="Background music"
            value={settings.musicEnabled}
            onChange={(v) => onChange({ musicEnabled: v })}
          />
          <ToggleRow
            icon="✨"
            label="Particles"
            description="Visual effects"
            value={settings.particlesEnabled}
            onChange={(v) => onChange({ particlesEnabled: v })}
          />
          <ToggleRow
            icon="🏷️"
            label="Grid Labels"
            description="Show plot numbers"
            value={settings.showGridLabels}
            onChange={(v) => onChange({ showGridLabels: v })}
          />

          <div className="pt-2 border-t border-green-800/30">
            <button
              onClick={() => {
                if (confirm('Reset all game progress? This cannot be undone!')) {
                  localStorage.clear()
                  window.location.reload()
                }
              }}
              className="w-full text-xs text-red-400 hover:text-red-300 py-2 rounded-lg border border-red-800/30 hover:bg-red-900/20 transition"
            >
              🗑️ Reset Game
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ToggleRow({
  icon,
  label,
  description,
  value,
  onChange,
}: {
  icon: string
  label: string
  description: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xl">{icon}</span>
      <div className="flex-1">
        <p className="text-white text-sm font-medium">{label}</p>
        <p className="text-green-500 text-[10px]">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-10 h-5 rounded-full relative transition-colors ${
          value ? 'bg-green-500' : 'bg-gray-600'
        }`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
            value ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}
