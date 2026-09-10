import {
  createDirectChat as _createDirectChat,
  type CreateDirectChatPayload,
} from '@/application/useCases/createDirectChat'
import { useChatsRepository, useRouter } from '@/infrastructure/shared/diComposables'
import { useAsync } from '@/infrastructure/shared/ui/composables/useAsync'
import { useChatsStoreAdapter } from '../storages/useChatsStoreAdapter'

export const useCreateDirectChatUseCase = () => {
  const chatsRepository = useChatsRepository()
  const router = useRouter()
  const chatsStore = useChatsStoreAdapter()

  const _tryCreateDirectChat = (payload: CreateDirectChatPayload) =>
    _createDirectChat({ router, chatsRepository, chatsStore }, payload)

  const { loading, asyncAction: createDirectChat } = useAsync(_tryCreateDirectChat)

  return { loading, createDirectChat }
}
