import { useChatsRepository } from '@/infrastructure/shared/diComposables'
import { useQuery } from '@/infrastructure/shared/ui/composables/useQuery'

export const useChatsQuery = () => {
  const chatsRepository = useChatsRepository()
  const chatsQuery = () => {
    return chatsRepository.fetchCurrentChats()
  }

  const { loading, error, data: chats } = useQuery([], chatsQuery)

  return { loading, error, chats }
}
