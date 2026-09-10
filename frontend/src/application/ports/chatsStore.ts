import type { ChatDetailed } from '@/domain/chat'

export interface IChatsStore {
  addChat(chat: ChatDetailed): void
}
