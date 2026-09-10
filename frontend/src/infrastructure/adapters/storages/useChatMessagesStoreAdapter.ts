import type { IChatMessagesStore } from '@/application/ports/chatMessagesStore'
import { useChatMessagesStore } from '@/infrastructure/storages/useChatMessagesStore'

export const useChatMessagesStoreAdapter = (): IChatMessagesStore => {
  const store = useChatMessagesStore()

  return {
    addMessage(chatId, message) {
      store.addMessageToChat(chatId, message)
    },
  }
}
