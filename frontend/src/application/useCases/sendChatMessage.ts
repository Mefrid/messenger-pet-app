import type { IChat } from '@/domain/chat'
import { WebSocketOutgoingType, type IWebSocketClient } from '../ports/webSocketClient'
import type { IChatMessagesStore } from '../ports/chatMessagesStore'
import type { IUser } from '@/domain/user'
import { createChatMessage } from '@/domain/chatMessage'

export type SendChatMessagePayload = {
  chatId: IChat['id']
  currentUserId: IUser['id']
  textContent: string
}

export const sendChatMessage = async (
  dependencies: {
    webSocketClient: IWebSocketClient
    chatMessagesStore: IChatMessagesStore
  },
  payload: SendChatMessagePayload,
) => {
  const { webSocketClient, chatMessagesStore } = dependencies
  const { chatId, textContent, currentUserId } = payload

  const now = new Date()

  const message = createChatMessage(
    `temp-${now.getTime()}`,
    chatId,
    currentUserId,
    now,
    textContent,
  )

  chatMessagesStore.addMessage(chatId, message)
  webSocketClient.sendMessage(WebSocketOutgoingType.SendChatMessage, {
    chatId,
    textContent,
  })
}
