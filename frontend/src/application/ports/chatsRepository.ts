import type { ChatDetailed, ChatListElementDetailed, IChat } from '@/domain/chat'
import type { IChatMessage } from '@/domain/chatMessage'
import type { IUser } from '@/domain/user'

export interface IChatsRepository {
  findChat(chatId: IChat['id']): Promise<ChatDetailed | null>
  fetchCurrentChats(): Promise<ChatListElementDetailed[]>

  findDirectChatWith(userId: IUser['id']): Promise<ChatDetailed | null>
  createDirectChatWith(userId: IUser['id']): Promise<ChatDetailed>

  fetchChatMessages(chatId: IChat['id']): Promise<IChatMessage[]>
}
