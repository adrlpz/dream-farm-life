// ParticleSystem.ts — Simple particle effects (sparkles, dust, etc.)
export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

export class ParticleSystem {
  particles: Particle[] = []

  emit(x: number, y: number, count: number, color: string, spread = 1) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * spread,
        vy: (Math.random() - 0.5) * spread - 0.5,
        life: 0.5 + Math.random() * 0.5,
        maxLife: 0.5 + Math.random() * 0.5,
        color,
        size: 2 + Math.random() * 3,
      })
    }
  }

  update(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.vy += 2 * dt // gravity
      p.life -= dt
      if (p.life <= 0) {
        this.particles.splice(i, 1)
      }
    }
  }

  render(ctx: CanvasRenderingContext2D, camX: number, camY: number, zoom: number, canvasW: number, canvasH: number, tileSize: number) {
    const cx = canvasW / 2
    const cy = canvasH / 2
    for (const p of this.particles) {
      const sx = (p.x - camX) * tileSize * zoom + cx
      const sy = (p.y - camY) * tileSize * zoom + cy
      const alpha = p.life / p.maxLife
      ctx.globalAlpha = alpha
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(sx, sy, p.size * zoom, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }
}
