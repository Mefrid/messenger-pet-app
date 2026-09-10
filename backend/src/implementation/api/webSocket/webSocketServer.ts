import { WebSocket, WebSocketServer as wsWebSocketServer } from 'ws'
import type { IWebSocket, IWebSocketServer } from '../../../application/ports/webSocketServer.ts'
import type { User } from '../../../domain/user.ts'
import type { Server } from 'http'
import url from 'url'
import type { IAuthTokenProvider } from '../../../application/ports/authTokenProvider.ts'
import type { IChatDAO } from '../../../application/ports/chatDAO.ts'
import {
  sendChatMessageController,
  startTypingController,
  stopTypingController,
} from './controllers/chatsWebSocketControllers.ts'
import { NotFoundError } from '../../../application/errors.ts'
import {
  createOutgoingMessage,
  type UserPresenceStatus,
  type WebSocketIncomingMessage,
  WebSocketIncomingType,
  WebSocketOutgoingType,
} from './webSocketEntities.ts'

export type WebSocketMessageHandler<T extends WebSocketIncomingType = WebSocketIncomingType> = (
  ws: WebSocket,
  websocketMessage: WebSocketIncomingMessage<T>,
  wss: IWebSocketServer,
) => Promise<void>

export const webSocketControllers: { [T in WebSocketIncomingType]: WebSocketMessageHandler<T> } = {
  [WebSocketIncomingType.SendChatMessage]: sendChatMessageController,
  [WebSocketIncomingType.StartTyping]: startTypingController,
  [WebSocketIncomingType.StoppedTyping]: stopTypingController,
}

type WebSocketConnectionsMap = Map<User['id'], Set<WebSocket>>

export class WebSocketServer implements IWebSocketServer {
  private userConnectionsMap: WebSocketConnectionsMap = new Map<User['id'], Set<WebSocket>>()
  private wss: wsWebSocketServer
  private chatDAO: IChatDAO

  constructor(server: Server, authProvider: IAuthTokenProvider, chatDAO: IChatDAO) {
    this.chatDAO = chatDAO
    this.userConnectionsMap = new Map<User['id'], Set<WebSocket>>()
    this.wss = new wsWebSocketServer({ server })

    this.wss.on('connection', async (ws, req) => {
      const queryObject = url.parse(req.url!, true).query
      const token = queryObject['token'] as string
      const tokenInfo = token
        ? await authProvider.verifyAccessToken(token).catch(() => undefined)
        : false

      if (!tokenInfo) {
        ws.close(4001, 'Unauthorized')
        return
      }

      const { userId } = tokenInfo
      ws.userId = userId
      let connections = this.userConnectionsMap.get(userId)

      if (!connections) {
        connections = new Set()
        this.userConnectionsMap.set(userId, connections)
      }

      connections.add(ws)

      // Now online
      if (connections.size === 1) {
        this.sendOnlineStatus('online', userId)
      }

      ws.addEventListener('message', (event) => {
        if (typeof event.data !== 'string') {
          return
        }
        const rawData = JSON.parse(event.data)
        const type = rawData.type as WebSocketIncomingType
        const incomingMessage = rawData as WebSocketIncomingMessage<any>

        const controller = webSocketControllers[type]
        if (!controller) {
          throw new NotFoundError(`Unknown websocket type ${type}`)
        }

        controller(ws, incomingMessage as never, this)
      })

      ws.on('close', () => {
        const connections = this.userConnectionsMap.get(userId)

        if (!connections) {
          return
        }

        connections.delete(ws)

        // Now offline
        if (connections.size === 0) {
          this.userConnectionsMap.delete(userId)

          this.sendOnlineStatus('offline', userId)
        }
      })
    })

    this.wss.on('error', (error) => {
      console.error('WebSocket error: ', error)
    })
  }

  getOpenConnections(): IWebSocket[] {
    return Array.from(this.wss.clients).map(this.mapWebSocket)
  }

  getOpenConnectionsForUser(userId: User['id']): IWebSocket[] {
    return this.getOpenConnections().filter((ws) => ws.userId === userId)
  }

  isOnline(userId: User['id']): boolean {
    const wsConnections = this.userConnectionsMap.get(userId)
    if (!wsConnections) {
      return false
    }
    return !!Array.from(wsConnections).find((ws) => ws.readyState === WebSocket.OPEN)
  }

  private mapWebSocket(client: WebSocket): IWebSocket {
    return {
      userId: client.userId,

      send: (message) => client.send(message),
    }
  }

  private async sendOnlineStatus(status: UserPresenceStatus, userId: User['id']) {
    try {
      const interlocutors = await this.chatDAO.findAllInterlocutors(userId)
      interlocutors.forEach((user) => {
        const wsConnections = this.userConnectionsMap.get(user.id)
        if (!wsConnections) {
          return
        }
        wsConnections.forEach((ws) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              createOutgoingMessage(WebSocketOutgoingType.UserPresenceChanged, {
                userId,
                status,
              }),
            )
          }
        })
      })
    } catch (error) {
      console.error('Error while sending online status', error)
    }
  }
}
