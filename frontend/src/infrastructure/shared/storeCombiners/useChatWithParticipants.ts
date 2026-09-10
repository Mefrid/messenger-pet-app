import type { ChatsStore } from '@/infrastructure/storages/useChatsStore'
import { computed } from 'vue'

export const useChatWithParticipants = (id: string, chats: ChatsStore) => {
  return computed(() => chats.chatsWithParticipants.find((chat) => chat.id === id))
}
