import type { IChatsRepository } from '../ports/chatsRepository'
import type { IChatsStore } from '../ports/chatsStore'
import { ROUTE_NAMES, type IRouter } from '../ports/router'

export type CreateDirectChatPayload = {
  userId: string
}

export const createDirectChat = async (
  dependencies: {
    chatsRepository: IChatsRepository
    chatsStore: IChatsStore
    router: IRouter
  },
  payload: CreateDirectChatPayload,
) => {
  const { chatsRepository, chatsStore, router } = dependencies
  const { userId } = payload

  const newChat = await chatsRepository.createDirectChatWith(userId)

  chatsStore.addChat(newChat)
  await router.replace(ROUTE_NAMES.CHAT, { id: newChat.id })
}
