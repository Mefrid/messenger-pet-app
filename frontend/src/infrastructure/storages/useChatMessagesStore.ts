import { defineStore } from 'pinia'
import { useChatsRepository } from '../shared/diComposables'
import type { IChat } from '@/domain/chat'
import { wait } from '../shared/utils/wait'
import type { IChatMessage } from '@/domain/chatMessage'

type ChatsWithMessages = Record<IChat['id'], IChatMessage[]>
export type ChatMessagesGroupedByDate = Map<string, IChatMessage[]>
type ChatsWithGroupedMessages = Record<IChat['id'], ChatMessagesGroupedByDate>

interface ChatMessagesState {
  chatsWithMessages: ChatsWithMessages
  initializedChats: Array<IChat['id']>
}

export const useChatMessagesStore = defineStore('chat_messages', {
  state: (): ChatMessagesState => ({
    chatsWithMessages: {},
    initializedChats: [],
  }),
  actions: {
    async fetchMessagesForChat(chatId: IChat['id']) {
      if (this.initializedChats.includes(chatId)) {
        return
      }

      const chatsRepository = useChatsRepository()
      const [chats] = await Promise.all([chatsRepository.fetchChatMessages(chatId), wait(300)])

      this.chatsWithMessages[chatId] = chats
      this.initializedChats.push(chatId)
    },

    addMessageToChat(chatId: IChat['id'], message: IChatMessage) {
      const firstMessage = this.chatsWithMessages[chatId]?.[0]
      if (firstMessage?.id === message.id) {
        return
      }

      if (!this.chatsWithMessages[chatId]) {
        this.chatsWithMessages[chatId] = []
      }

      this.chatsWithMessages[chatId].unshift(message)
    },
  },
  getters: {
    chatsWithGroupedMessages(state) {
      const result: ChatsWithGroupedMessages = {}

      for (const [chatId, messages] of Object.entries(state.chatsWithMessages)) {
        const grouped = new Map<string, IChatMessage[]>()
        const sortedMessages = messages.toSorted(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
        )

        for (const message of sortedMessages) {
          const date = message.timestamp

          const dateKey = [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, '0'),
            String(date.getDate()).padStart(2, '0'),
          ].join('-')

          const messagesForDate = grouped.get(dateKey)

          if (messagesForDate) {
            messagesForDate.push(message)
          } else {
            grouped.set(dateKey, [message])
          }
        }

        result[chatId] = grouped
      }

      return result
    },
  },
})
