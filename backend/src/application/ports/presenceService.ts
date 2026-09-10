import type { User } from '../../domain/user.ts'

export interface IPresenceService {
  isOnline(userId: User['id']): boolean

  connect(userId: User['id'], connection: WebSocketConnection): void

  disconnect(userId: User['id'], connection: WebSocketConnection): void
}
