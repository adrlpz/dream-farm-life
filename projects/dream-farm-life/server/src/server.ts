// server.ts — Dream Farm Life WebSocket multiplayer server
import { WebSocketServer, WebSocket } from 'ws'

interface PlayerState {
  id: string
  name: string
  x: number
  y: number
  direction: string
  biome: string
  skin: number // character skin index (0-7)
  isRunning: boolean
  animFrame: number
  lastUpdate: number
}

interface ServerMessage {
  type: string
  data: any
}

const PORT = parseInt(process.env.WS_PORT || '8090')
const TICK_RATE = 20 // 20 updates per second
const PLAYER_TIMEOUT = 30000 // 30s timeout

const wss = new WebSocketServer({ port: PORT })
const players = new Map<string, PlayerState>()
const clients = new Map<string, WebSocket>()

console.log(`🌾 Dream Farm Life multiplayer server on port ${PORT}`)

function broadcast(msg: ServerMessage, excludeId?: string) {
  const data = JSON.stringify(msg)
  for (const [id, ws] of clients) {
    if (id !== excludeId && ws.readyState === WebSocket.OPEN) {
      ws.send(data)
    }
  }
}

function sendTo(id: string, msg: ServerMessage) {
  const ws = clients.get(id)
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg))
  }
}

function handleMessage(ws: WebSocket, raw: string) {
  try {
    const msg = JSON.parse(raw) as ServerMessage

    switch (msg.type) {
      case 'join': {
        const { id, name, x, y, direction, biome, skin } = msg.data
        const player: PlayerState = {
          id, name: name || `Farmer-${id.slice(0, 4)}`,
          x: x || 16, y: y || 16,
          direction: direction || 'down',
          biome: biome || 'farmland',
          skin: skin ?? Math.floor(Math.random() * 8),
          isRunning: false, animFrame: 0,
          lastUpdate: Date.now(),
        }
        players.set(id, player)
        clients.set(id, ws)

        // Send current players to new joiner
        sendTo(id, { type: 'existing_players', data: Array.from(players.values()).filter(p => p.id !== id) })

        // Broadcast join to others
        broadcast({ type: 'player_join', data: player }, id)

        console.log(`+ ${player.name} joined (${players.size} online)`)
        break
      }

      case 'move': {
        const { id, x, y, direction, biome, isRunning, animFrame } = msg.data
        const player = players.get(id)
        if (player) {
          player.x = x
          player.y = y
          player.direction = direction
          player.biome = biome
          player.isRunning = isRunning
          player.animFrame = animFrame
          player.lastUpdate = Date.now()

          // Broadcast to others (use 'move' for position-only)
          broadcast({ type: 'move', data: { id, x, y, direction, biome, isRunning, animFrame } }, id)
        }
        break
      }

      case 'action': {
        const { id, action, data } = msg.data
        // Broadcast actions like gather, harvest, build
        broadcast({ type: 'action', data: { id, action, ...data } }, id)
        break
      }

      case 'chat': {
        const { id, message } = msg.data
        const player = players.get(id)
        if (player) {
          broadcast({ type: 'chat', data: { id, name: player.name, message } })
        }
        break
      }

      case 'emote': {
        const { id, emote } = msg.data
        broadcast({ type: 'emote', data: { id, emote } }, id)
        break
      }

      case 'leave': {
        const playerId = msg.data.id
        const player = players.get(playerId)
        if (player) {
          broadcast({ type: 'player_leave', data: { id: playerId, name: player.name } })
          players.delete(playerId)
          clients.delete(playerId)
          console.log(`- ${player.name} left (${players.size} online)`)
        }
        break
      }
    }
  } catch (err) {
    console.error('Parse error:', err)
  }
}

wss.on('connection', (ws) => {
  ws.on('message', (data) => handleMessage(ws, data.toString()))

  ws.on('close', () => {
    // Find and remove disconnected player
    for (const [id, client] of clients) {
      if (client === ws) {
        const player = players.get(id)
        if (player) {
          broadcast({ type: 'player_leave', data: { id, name: player.name } })
          players.delete(id)
          clients.delete(id)
          console.log(`- ${player.name} disconnected (${players.size} online)`)
        }
        break
      }
    }
  })
})

// Cleanup timed-out players
setInterval(() => {
  const now = Date.now()
  for (const [id, player] of players) {
    if (now - player.lastUpdate > PLAYER_TIMEOUT) {
      broadcast({ type: 'player_leave', data: { id, name: player.name } })
      players.delete(id)
      clients.delete(id)
      console.log(`- ${player.name} timed out (${players.size} online)`)
    }
  }
}, 10000)

// Stats endpoint
const statsPort = PORT + 1
const statsWss = new WebSocketServer({ port: statsPort })
console.log(`📊 Stats on port ${statsPort}`)
