import { useChatsRepository } from '@/infrastructure/shared/diComposables'
import { useQuery } from '@/infrastructure/shared/ui/composables/useQuery'
import { type Ref } from 'vue'

export const useChat = (id: Ref<string>) => {
  const chatsRepository = useChatsRepository()
  const chatQuery = (newId: string) => {
    return chatsRepository.findChat(newId)
  }

  const { loading, error, data: chat } = useQuery([id], chatQuery)

  return { loading, error, chat }
}
