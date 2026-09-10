import { WebSocket } from 'ws'
import {
  createOutgoingMessage,
  WebSocketOutgoingType,
  type WebSocketIncomingMessage,
  type WebSocketIncomingType,
} from '../webSocketEntities.ts'
import { services } from '../../../../config/services.ts'
import { SendChatMessage } from '../../../../application/useCases/sendChatMessage.ts'
import type { WebSocketMessageHandler } from '../webSocketServer.ts'
import type { IWebSocketServer } from '../../../../application/ports/webSocketServer.ts'

const userDAO = new services.userDAO()
const chatDAO = new services.chatDAO(userDAO)
const sendChatMessageUseCase = new SendChatMessage(chatDAO)

export const sendChatMessageController: WebSocketMessageHandler<
  WebSocketIncomingType.SendChatMessage
> = async (
  ws: WebSocket,
  message: WebSocketIncomingMessage<WebSocketIncomingType.SendChatMessage>,
  wss: IWebSocketServer,
) => {
  const { chatId, textContent } = message.payload
  const { recipients, chatMessage } = await sendChatMessageUseCase.call(chatId, ws.userId, {
    textContent,
  })
  const recipientIds = recipients.map((recipient) => recipient.id)
  Array.from(wss.getOpenConnections())
    .filter((client) => recipientIds.includes(client.userId))
    .forEach((client) =>
      client.send(
        createOutgoingMessage(WebSocketOutgoingType.ReceivedChatMessage, {
          chatMessage,
        }),
      ),
    )
}

const typingController = async (
  ws: WebSocket,
  message: WebSocketIncomingMessage<
    WebSocketIncomingType.StartTyping | WebSocketIncomingType.StoppedTyping
  >,
  wss: IWebSocketServer,
  typing: boolean,
) => {
  const { chatId } = message.payload
  const userId = ws.userId
  if (!chatId) {
    return
  }

  const chat = await chatDAO.findChat(chatId)
  if (!chat) {
    return
  }

  chat.participants.forEach((participant) => {
    if (participant.id === userId) {
      return
    }
    wss.getOpenConnectionsForUser(participant.id).forEach((ws) =>
      ws.send(
        createOutgoingMessage(
          typing ? WebSocketOutgoingType.StartTyping : WebSocketOutgoingType.StoppedTyping,
          {
            chatId,
            userId,
          },
        ),
      ),
    )
  })
}

export const startTypingController: WebSocketMessageHandler<
  WebSocketIncomingType.StartTyping
> = async (
  ws: WebSocket,
  message: WebSocketIncomingMessage<WebSocketIncomingType.StartTyping>,
  wss: IWebSocketServer,
) => typingController(ws, message, wss, true)

export const stopTypingController: WebSocketMessageHandler<
  WebSocketIncomingType.StoppedTyping
> = async (
  ws: WebSocket,
  message: WebSocketIncomingMessage<WebSocketIncomingType.StoppedTyping>,
  wss: IWebSocketServer,
) => typingController(ws, message, wss, false)
