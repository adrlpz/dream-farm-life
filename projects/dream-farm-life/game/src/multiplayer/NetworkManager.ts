// NetworkManager.ts — Client-side multiplayer networking
export interface RemotePlayer {
  id: string
  name: string
  x: number
  y: number
  direction: string
  biome: string
  skin: number
  isRunning: boolean
  animFrame: number
  // Interpolation
  targetX: number
  targetY: number
  lastUpdate: number
  // Emote
  emote: string | null
  emoteTimer: number
  // Chat
  chatMessage: string | null
  chatTimer: number
}

export interface NetworkMessage {
  type: string
  data: any
}

type MessageHandler = (msg: NetworkMessage) => void

export class NetworkManager {
  private ws: WebSocket | null = null
  private url: string
  private playerId: string
  private playerName: string
  private handlers = new Map<string, MessageHandler[]>()
  private reconnectTimer = 0
  private reconnectAttempts = 0
  private maxReconnectAttempts = 10
  private sendQueue: NetworkMessage[] = []
  private connected = false

  // Remote players
  remotePlayers = new Map<string, RemotePlayer>()
  private notifications: string[] = []

  constructor(url: string, playerId: string, playerName: string) {
    this.url = url
    this.playerId = playerId
    this.playerName = playerName
  }

  connect(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        this.ws = new WebSocket(this.url)

        this.ws.onopen = () => {
          this.connected = true
          this.reconnectAttempts = 0

          // Send join message
          this.send({
            type: 'join',
            data: {
              id: this.playerId,
              name: this.playerName,
              x: 16, y: 16,
              direction: 'down',
              biome: 'farmland',
              skin: Math.floor(Math.random() * 8),
            },
          })

          // Flush queue
          for (const msg of this.sendQueue) {
            this.ws!.send(JSON.stringify(msg))
          }
          this.sendQueue = []

          resolve(true)
        }

        this.ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data) as NetworkMessage
            this.handleMessage(msg)
          } catch {}
        }

        this.ws.onclose = () => {
          this.connected = false
          this.remotePlayers.clear()
          this.scheduleReconnect()
        }

        this.ws.onerror = () => {
          resolve(false)
        }
      } catch {
        resolve(false)
      }
    })
  }

  disconnect() {
    if (this.ws) {
      this.send({ type: 'leave', data: { id: this.playerId } })
      this.ws.close()
      this.ws = null
    }
    this.connected = false
    this.remotePlayers.clear()
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)
    this.reconnectAttempts++
    this.reconnectTimer = window.setTimeout(() => this.connect(), delay)
  }

  private send(msg: NetworkMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg))
    } else {
      this.sendQueue.push(msg)
    }
  }

  private handleMessage(msg: NetworkMessage) {
    switch (msg.type) {
      case 'existing_players': {
        for (const p of msg.data) {
          this.remotePlayers.set(p.id, {
            ...p,
            targetX: p.x, targetY: p.y,
            lastUpdate: Date.now(),
            emote: null, emoteTimer: 0,
            chatMessage: null, chatTimer: 0,
          })
        }
        if (msg.data.length > 0) {
          this.notifications.push(`👥 ${msg.data.length} player(s) online`)
        }
        break
      }

      case 'player_join': {
        const p = msg.data
        this.remotePlayers.set(p.id, {
          ...p,
          targetX: p.x, targetY: p.y,
          lastUpdate: Date.now(),
          emote: null, emoteTimer: 0,
          chatMessage: null, chatTimer: 0,
        })
        this.notifications.push(`👋 ${p.name} joined`)
        break
      }

      case 'player_leave': {
        const { id, name } = msg.data
        this.remotePlayers.delete(id)
        this.notifications.push(`👋 ${name} left`)
        break
      }

      case 'move': {
        const { id, x, y, direction, biome, isRunning, animFrame } = msg.data
        const player = this.remotePlayers.get(id)
        if (player) {
          player.targetX = x
          player.targetY = y
          player.direction = direction
          player.biome = biome
          player.isRunning = isRunning
          player.animFrame = animFrame
          player.lastUpdate = Date.now()
        }
        break
      }

      case 'action': {
        // Handle remote player actions (particles, sounds)
        const { id, action } = msg.data
        const handler = this.handlers.get('action')
        if (handler) handler.forEach(h => h(msg))
        break
      }

      case 'chat': {
        const { id, name, message } = msg.data
        const player = this.remotePlayers.get(id)
        if (player) {
          player.chatMessage = message
          player.chatTimer = 5 // 5 seconds
        }
        // Also emit for chat UI
        const handler = this.handlers.get('chat')
        if (handler) handler.forEach(h => h(msg))
        break
      }

      case 'emote': {
        const { id, emote } = msg.data
        const player = this.remotePlayers.get(id)
        if (player) {
          player.emote = emote
          player.emoteTimer = 3 // 3 seconds
        }
        break
      }
    }

    // Generic handler
    const generic = this.handlers.get('*')
    if (generic) generic.forEach(h => h(msg))
  }

  // Send player position update
  sendMove(x: number, y: number, direction: string, biome: string, isRunning: boolean, animFrame: number) {
    this.send({
      type: 'move',
      data: { id: this.playerId, x, y, direction, biome, isRunning, animFrame },
    })
  }

  // Send action (gather, harvest, build, etc.)
  sendAction(action: string, data: Record<string, any> = {}) {
    this.send({
      type: 'action',
      data: { id: this.playerId, action, ...data },
    })
  }

  // Send chat message
  sendChat(message: string) {
    this.send({
      type: 'chat',
      data: { id: this.playerId, message },
    })
  }

  // Send emote
  sendEmote(emote: string) {
    this.send({
      type: 'emote',
      data: { id: this.playerId, emote },
    })
  }

  // Update remote players (interpolation + timers)
  update(dt: number) {
    for (const [id, player] of this.remotePlayers) {
      // Interpolate position
      const lerpSpeed = 10
      player.x += (player.targetX - player.x) * Math.min(1, lerpSpeed * dt)
      player.y += (player.targetY - player.y) * Math.min(1, lerpSpeed * dt)

      // Timers
      if (player.emoteTimer > 0) {
        player.emoteTimer -= dt
        if (player.emoteTimer <= 0) { player.emote = null; player.emoteTimer = 0 }
      }
      if (player.chatTimer > 0) {
        player.chatTimer -= dt
        if (player.chatTimer <= 0) { player.chatMessage = null; player.chatTimer = 0 }
      }
    }
  }

  // Event handler
  on(event: string, handler: MessageHandler) {
    if (!this.handlers.has(event)) this.handlers.set(event, [])
    this.handlers.get(event)!.push(handler)
  }

  off(event: string, handler: MessageHandler) {
    const list = this.handlers.get(event)
    if (list) {
      const idx = list.indexOf(handler)
      if (idx >= 0) list.splice(idx, 1)
    }
  }

  consumeNotifications(): string[] {
    const n = [...this.notifications]
    this.notifications = []
    return n
  }

  get isConnected(): boolean { return this.connected }
  get onlineCount(): number { return this.remotePlayers.size + (this.connected ? 1 : 0) }
}
