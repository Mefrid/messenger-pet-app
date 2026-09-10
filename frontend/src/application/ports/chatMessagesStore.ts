import type { IChat } from '@/domain/chat'
import type { IChatMessage } from '@/domain/chatMessage'

export interface IChatMessagesStore {
  addMessage(chatId: IChat['id'], message: IChatMessage): void
}
