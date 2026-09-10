import type { User } from '../../domain/user.ts'

export interface IWebSocket {
  readonly userId: string

  send(message: string): void
}

export interface IWebSocketServer {
  isOnline(userId: User['id']): boolean
  getOpenConnectionsForUser(userId: User['id']): IWebSocket[]
  getOpenConnections(): IWebSocket[]
}
