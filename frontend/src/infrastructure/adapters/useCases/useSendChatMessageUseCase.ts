import { useChatMessagesStoreAdapter } from '../storages/useChatMessagesStoreAdapter'
import {
  sendChatMessage as _sendChatMessage,
  type SendChatMessagePayload,
} from '@/application/useCases/sendChatMessage'
import { wsc } from '@/infrastructure/api/webSocketClient'

export const useSendChatMessageUseCase = () => {
  const chatMessagesStore = useChatMessagesStoreAdapter()

  const sendChatMessage = (payload: SendChatMessagePayload) =>
    _sendChatMessage({ webSocketClient: wsc, chatMessagesStore }, payload)

  return { sendChatMessage }
}
