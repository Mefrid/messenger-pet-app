import type { IChatMessagesStore } from '@/application/ports/chatMessagesStore'
import { WebSocketOutgoingType, type IWebSocketClient } from '@/application/ports/webSocketClient'
import { sendChatMessage } from '@/application/useCases/sendChatMessage'
import { describe, expect, test, vi } from 'vitest'

describe('Send chat message use case', () => {
  const webSocketClient: IWebSocketClient = {
    connect: vi.fn(),
    isConnected: vi.fn(() => true),
    subscribe: vi.fn(),
    close: vi.fn(),
    sendMessage: vi.fn(),
  }
  const chatMessagesStore: IChatMessagesStore = {
    addMessage: vi.fn(),
  }

  const dependencies = {
    webSocketClient,
    chatMessagesStore,
  }

  test('chat message is saved in store', async () => {
    await sendChatMessage(dependencies, {
      chatId: 'testChat',
      currentUserId: 'testUserId123',
      textContent: 'Test message',
    })
    expect(dependencies.chatMessagesStore.addMessage).toHaveBeenCalledWith(
      'testChat',
      expect.objectContaining({
        chatId: 'testChat',
        senderId: 'testUserId123',
        textContent: 'Test message',
      }),
    )
  })

  test('chat message is send via websocket', async () => {
    await sendChatMessage(dependencies, {
      chatId: 'testChat',
      currentUserId: 'testUserId123',
      textContent: 'Test message',
    })
    expect(dependencies.webSocketClient.sendMessage).toHaveBeenCalledWith(
      WebSocketOutgoingType.SendChatMessage,
      expect.objectContaining({
        chatId: 'testChat',
        textContent: 'Test message',
      }),
    )
  })
})
