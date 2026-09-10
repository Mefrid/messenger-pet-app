import type { IChatsStore } from '@/application/ports/chatsStore'
import { useChatsStore } from '@/infrastructure/storages/useChatsStore'

export const useChatsStoreAdapter = (): IChatsStore => {
  const store = useChatsStore()

  return {
    addChat(chat) {
      store.addChat(chat)
    },
  }
}
