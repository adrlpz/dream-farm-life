// TouchControls.tsx — Virtual joystick for mobile
import { useRef, useCallback } from 'react'

interface TouchControlsProps {
  onMove: (dx: number, dy: number) => void
}

export function TouchControls({ onMove }: TouchControlsProps) {
  const joystickRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(false)
  const centerRef = useRef({ x: 0, y: 0 })

  const handleStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    const rect = joystickRef.current?.getBoundingClientRect()
    if (!rect) return
    centerRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    activeRef.current = true
  }, [])

  const handleMove = useCallback((e: React.TouchEvent) => {
    if (!activeRef.current) return
    e.preventDefault()
    const touch = e.touches[0]
    const radius = 40
    let dx = touch.clientX - centerRef.current.x
    let dy = touch.clientY - centerRef.current.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist > radius) {
      dx = (dx / dist) * radius
      dy = (dy / dist) * radius
    }

    if (knobRef.current) {
      knobRef.current.style.transform = `translate(${dx}px, ${dy}px)`
    }
    onMove(dx / radius, dy / radius)
  }, [onMove])

  const handleEnd = useCallback(() => {
    activeRef.current = false
    if (knobRef.current) {
      knobRef.current.style.transform = 'translate(0, 0)'
    }
    onMove(0, 0)
  }, [onMove])

  return (
    <div
      className="absolute bottom-8 left-8 select-none"
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      onTouchCancel={handleEnd}
    >
      <div
        ref={joystickRef}
        className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
      >
        <div
          ref={knobRef}
          className="w-10 h-10 bg-white/50 rounded-full shadow-lg"
        />
      </div>
    </div>
  )
}
