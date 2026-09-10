import type { IUser } from '@/domain/user'
import { useChatsRepository } from '@/infrastructure/shared/diComposables'
import { useQuery } from '@/infrastructure/shared/ui/composables/useQuery'
import { computed, type Ref } from 'vue'

export const useChatWithUserId = (userId: Ref<IUser['id']>) => {
  const chatsRepository = useChatsRepository()
  const { data, loading } = useQuery([userId], (userId) =>
    chatsRepository.findDirectChatWith(userId),
  )
  const isNotFound = computed(() => {
    return !data.value && !loading.value
  })

  return { data, isNotFound, loading }
}
