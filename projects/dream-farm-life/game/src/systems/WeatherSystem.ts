// WeatherSystem.ts — Weather state machine with effects
export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'foggy'

export interface WeatherState {
  current: WeatherType
  intensity: number // 0-1
  duration: number  // seconds remaining
  nextChange: number // seconds until next weather check
}

const WEATHER_TRANSITIONS: Record<WeatherType, { to: WeatherType; weight: number }[]> = {
  sunny:  [{ to: 'sunny', weight: 50 }, { to: 'cloudy', weight: 35 }, { to: 'rainy', weight: 10 }, { to: 'foggy', weight: 5 }],
  cloudy: [{ to: 'cloudy', weight: 30 }, { to: 'sunny', weight: 30 }, { to: 'rainy', weight: 25 }, { to: 'stormy', weight: 10 }, { to: 'foggy', weight: 5 }],
  rainy:  [{ to: 'rainy', weight: 35 }, { to: 'cloudy', weight: 30 }, { to: 'stormy', weight: 15 }, { to: 'sunny', weight: 15 }, { to: 'foggy', weight: 5 }],
  stormy: [{ to: 'stormy', weight: 30 }, { to: 'rainy', weight: 40 }, { to: 'cloudy', weight: 20 }, { to: 'sunny', weight: 10 }],
  snowy:  [{ to: 'snowy', weight: 50 }, { to: 'cloudy', weight: 30 }, { to: 'foggy', weight: 15 }, { to: 'sunny', weight: 5 }],
  foggy:  [{ to: 'foggy', weight: 25 }, { to: 'cloudy', weight: 35 }, { to: 'sunny', weight: 25 }, { to: 'rainy', weight: 15 }],
}

const SEASON_WEATHER_BIAS: Record<string, WeatherType[]> = {
  spring: ['sunny', 'rainy', 'cloudy', 'foggy'],
  summer: ['sunny', 'sunny', 'cloudy', 'rainy'],
  fall:   ['cloudy', 'rainy', 'foggy', 'sunny'],
  winter: ['snowy', 'snowy', 'cloudy', 'foggy'],
}

const WEATHER_EMOJIS: Record<WeatherType, string> = {
  sunny: '☀️', cloudy: '☁️', rainy: '🌧️', stormy: '⛈️', snowy: '❄️', foggy: '🌫️',
}

export class WeatherSystem {
  state: WeatherState = {
    current: 'sunny',
    intensity: 0.5,
    duration: 0,
    nextChange: 120, // check every ~2 game hours
  }

  update(dt: number, season: string) {
    this.state.duration -= dt
    this.state.nextChange -= dt

    if (this.state.nextChange <= 0) {
      this.state.nextChange = 180 + Math.random() * 120 // 3-5 game hours
      this.transition(season)
    }

    // Gradually change intensity
    const targetIntensity = this.getTargetIntensity()
    this.state.intensity += (targetIntensity - this.state.intensity) * dt * 0.5
  }

  private transition(season: string) {
    const bias = SEASON_WEATHER_BIAS[season] ?? SEASON_WEATHER_BIAS.spring
    const transitions = WEATHER_TRANSITIONS[this.state.current]

    // Weighted random with season bias
    let totalWeight = 0
    const weights: { type: WeatherType; weight: number }[] = []

    for (const t of transitions) {
      let w = t.weight
      // Boost weight if matches season bias
      if (bias.includes(t.to)) w *= 2
      weights.push({ type: t.to, weight: w })
      totalWeight += w
    }

    let roll = Math.random() * totalWeight
    for (const w of weights) {
      roll -= w.weight
      if (roll <= 0) {
        this.state.current = w.type
        this.state.duration = 200 + Math.random() * 300
        break
      }
    }
  }

  private getTargetIntensity(): number {
    switch (this.state.current) {
      case 'sunny': return 0.2
      case 'cloudy': return 0.4
      case 'rainy': return 0.6 + Math.random() * 0.2
      case 'stormy': return 0.9 + Math.random() * 0.1
      case 'snowy': return 0.5
      case 'foggy': return 0.7
      default: return 0.3
    }
  }

  get emoji(): string {
    return WEATHER_EMOJIS[this.state.current]
  }

  get name(): string {
    return this.state.current.charAt(0).toUpperCase() + this.state.current.slice(1)
  }

  // Effects
  get watersCrops(): boolean {
    return this.state.current === 'rainy' || this.state.current === 'stormy'
  }

  get growthBonus(): number {
    if (this.state.current === 'rainy') return 1.3
    if (this.state.current === 'sunny') return 1.1
    if (this.state.current === 'stormy') return 0.8
    return 1.0
  }

  get cropDamageChance(): number {
    if (this.state.current === 'stormy') return 0.05 // 5% per tick
    return 0
  }

  get visibilityModifier(): number {
    if (this.state.current === 'foggy') return 0.5
    if (this.state.current === 'rainy') return 0.8
    if (this.state.current === 'stormy') return 0.6
    return 1.0
  }

  // Lighting overlay for rendering
  getLightingOverlay(hour: number): { color: string; alpha: number } {
    // Day/night based on hour
    let baseAlpha = 0
    let color = '#000020'

    if (hour >= 6 && hour < 8) {
      // Dawn
      const t = (hour - 6) / 2
      baseAlpha = 0.3 * (1 - t)
      color = '#ff8040'
    } else if (hour >= 8 && hour < 17) {
      // Day
      baseAlpha = 0
      color = '#000000'
    } else if (hour >= 17 && hour < 19) {
      // Dusk
      const t = (hour - 17) / 2
      baseAlpha = 0.15 + t * 0.25
      color = '#ff6020'
    } else if (hour >= 19 && hour < 21) {
      // Twilight
      const t = (hour - 19) / 2
      baseAlpha = 0.4 + t * 0.25
      color = '#101040'
    } else {
      // Night
      baseAlpha = 0.65
      color = '#000030'
    }

    // Weather darkening
    if (this.state.current === 'cloudy') baseAlpha += 0.05
    if (this.state.current === 'rainy') baseAlpha += 0.1
    if (this.state.current === 'stormy') baseAlpha += 0.2
    if (this.state.current === 'foggy') { baseAlpha += 0.1; color = '#808080' }

    return { color, alpha: Math.min(0.8, baseAlpha) }
  }

  // Particle configs for renderer
  getParticlesConfig(): { type: WeatherType; count: number; color: string; speed: number } | null {
    switch (this.state.current) {
      case 'rainy':
        return { type: 'rainy', count: Math.floor(this.state.intensity * 80), color: '#8ab4f8', speed: 400 }
      case 'stormy':
        return { type: 'stormy', count: Math.floor(this.state.intensity * 120), color: '#6090d0', speed: 600 }
      case 'snowy':
        return { type: 'snowy', count: Math.floor(this.state.intensity * 50), color: '#ffffff', speed: 60 }
      default:
        return null
    }
  }

  serialize() { return { ...this.state } }
  deserialize(data: WeatherState) { this.state = data }
}
