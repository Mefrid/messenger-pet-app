import { defineStore } from 'pinia'
import type { ChatDetailed, ChatListElementDetailed, IChat } from '@/domain/chat'
import { useUsersStore } from './useUsersStore'
import { wait } from '../shared/utils/wait'
import { useChatMessagesStore } from './useChatMessagesStore'
import type { IChatsRepository } from '@/application/ports/chatsRepository'
import type { IUser } from '@/domain/user'

interface ChatsState {
  chats: IChat[]
  chatsTyping: Record<IChat['id'], Array<IUser['id']>>
  isInitialized: boolean
}

export const useChatsStore = defineStore('chats', {
  state: (): ChatsState => ({
    chats: [],
    chatsTyping: {},
    isInitialized: false,
  }),
  actions: {
    async fetchChats(chatsRepository: IChatsRepository) {
      if (this.isInitialized) {
        return
      }
      const chatMessagesStore = useChatMessagesStore()
      const usersStore = useUsersStore()

      const [chats] = await Promise.all([chatsRepository.fetchCurrentChats(), wait(400)])

      for (const chat of chats) {
        usersStore.addUsers(chat.participants)
        if (chat.lastMessage) {
          chatMessagesStore.addMessageToChat(chat.id, chat.lastMessage)
        }
      }

      this.chats = chats.map(mapChatToStore)

      this.isInitialized = true
    },

    addChat(chat: ChatDetailed) {
      const usersStore = useUsersStore()

      const isAlreadyExists = !!this.chats.find((existingChat) => existingChat.id === chat.id)

      if (!isAlreadyExists) {
        usersStore.addUsers(chat.participants)

        const newChat = mapChatToStore(chat)
        this.chats.push(newChat)
      }
    },

    updateTyping(userId: string, chatId: string, typing: boolean) {
      let newTypings = this.chatsTyping[chatId] ?? []

      if (typing && !newTypings.includes(userId)) {
        newTypings = [...newTypings, userId]
      } else {
        newTypings = newTypings.filter((id) => id !== userId)
      }

      this.chatsTyping[chatId] = newTypings
    },
  },
  getters: {
    isEmpty(state) {
      return state.chats.length === 0 && state.isInitialized
    },

    chatsWithParticipants(state): ChatDetailed[] {
      const usersStore = useUsersStore()
      return state.chats.map((chat) => ({
        ...chat,
        participants: chat.participants.map((participantId) => usersStore.getUser(participantId)!),
      }))
    },

    chatsWithLastMessage(): ChatListElementDetailed[] {
      const chatMessagesStore = useChatMessagesStore()

      return this.chatsWithParticipants
        .map<ChatListElementDetailed>((chat) => {
          const lastMessage = chatMessagesStore.chatsWithMessages[chat.id]?.[0]
          if (lastMessage) {
            return {
              ...chat,
              lastMessage,
            }
          }
          return chat
        })
        .filter((chat) => !!chat.lastMessage)
        .toSorted((a, b) => {
          const timestampA = a.lastMessage?.timestamp.getTime() as number
          const timestampB = b.lastMessage?.timestamp.getTime() as number

          return timestampB - timestampA
        })
    },
  },
})

const mapChatToStore = (chat: ChatDetailed): IChat => ({
  ...chat,
  participants: chat.participants.map((participant) => participant.id),
})

export type ChatsStore = ReturnType<typeof useChatsStore>
