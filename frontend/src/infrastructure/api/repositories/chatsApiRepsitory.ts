import type { ChatDetailed, ChatListElementDetailed, IChat } from '@/domain/chat'
import type { IUser } from '@/domain/user'
import type { IHttpClient } from '../httpClient'
import type { IChatsRepository } from '@/application/ports/chatsRepository'
import type { IChatMessage } from '@/domain/chatMessage'

type ChatListElementDetailedDTO = Replace<
  ChatListElementDetailed,
  {
    lastMessage?: ChatMessageDTO
  }
>

export type ChatMessageDTO = Replace<
  IChatMessage,
  {
    timestamp: Date
  }
>

const createChatMessage = (rawChatMessage: ChatMessageDTO): IChatMessage => ({
  id: rawChatMessage.id,
  chatId: rawChatMessage.chatId,
  senderId: rawChatMessage.senderId,
  timestamp: new Date(rawChatMessage.timestamp),
  textContent: rawChatMessage.textContent,
})

export class ChatsApiRepository implements IChatsRepository {
  constructor(private httpClient: IHttpClient) {}

  async findDirectChatWith(userId: IUser['id']): Promise<ChatDetailed | null> {
    try {
      const { data } = await this.httpClient.get<ChatDetailed>(`/users/${userId}/direct-chat`)
      return data
    } catch {
      return Promise.resolve(null)
    }
  }

  async createDirectChatWith(userId: IUser['id']): Promise<ChatDetailed> {
    const { data } = await this.httpClient.post<ChatDetailed>(`/chats/direct`, {
      userId,
    })
    return data
  }

  async findChat(chatId: IChat['id']): Promise<ChatDetailed | null> {
    try {
      const { data } = await this.httpClient.get<ChatDetailed>(`/chats/${chatId}`)
      return data
    } catch {
      return Promise.resolve(null)
    }
  }

  async fetchCurrentChats(): Promise<ChatListElementDetailed[]> {
    try {
      const { data } = await this.httpClient.get<ChatListElementDetailedDTO[]>(`/chats`)
      const chats: ChatListElementDetailed[] = data.map((chat) => ({
        ...chat,
        ...(chat.lastMessage && {
          lastMessage: createChatMessage(chat.lastMessage),
        }),
      }))
      return chats
    } catch {
      return Promise.resolve([])
    }
  }

  async fetchChatMessages(chatId: IChat['id']): Promise<IChatMessage[]> {
    const { data } = await this.httpClient.get<ChatMessageDTO[]>(`/chats/${chatId}/messages`)
    const messages: IChatMessage[] = data.map((message) => createChatMessage(message))
    return messages
  }
}
