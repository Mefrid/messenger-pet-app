import type { Chat } from '../../../domain/chat.ts'
import type { ChatMessageDetailedDTO } from '../../../domain/chatMessage.ts'
import type { User } from '../../../domain/user.ts'

export enum WebSocketOutgoingType {
  ReceivedChatMessage = 'received_chat_message',
  UserPresenceChanged = 'user_presence_changed',
  StartTyping = 'start_typing',
  StoppedTyping = 'stopped_typing',
}

export enum WebSocketIncomingType {
  SendChatMessage = 'send_chat_message',
  StartTyping = 'start_typing',
  StoppedTyping = 'stopped_typing',
}

export type UserPresenceStatus = 'online' | 'offline'

export type WebSocketOutgoingTypesPayload = {
  [WebSocketOutgoingType.ReceivedChatMessage]: {
    chatMessage: ChatMessageDetailedDTO
  }
  [WebSocketOutgoingType.UserPresenceChanged]: {
    userId: User['id']
    status: UserPresenceStatus
  }
  [WebSocketOutgoingType.StartTyping]: {
    userId: User['id']
    chatId: Chat['id']
  }
  [WebSocketOutgoingType.StoppedTyping]: {
    userId: User['id']
    chatId: Chat['id']
  }
}

export type WebSocketIncomingTypesPayload = {
  [WebSocketIncomingType.SendChatMessage]: {
    chatId: string
    textContent: string
  }
  [WebSocketIncomingType.StartTyping]: {
    chatId: Chat['id']
  }
  [WebSocketIncomingType.StoppedTyping]: {
    chatId: Chat['id']
  }
}

export type WebSocketIncomingMessage<T extends WebSocketIncomingType> = {
  type: T
  payload: WebSocketIncomingTypesPayload[T]
}

export type WebSocketOutgoingMessage<T extends WebSocketOutgoingType> = {
  type: T
  payload: WebSocketOutgoingTypesPayload[T]
}

export const createOutgoingMessage = <T extends WebSocketOutgoingType>(
  type: T,
  payload: WebSocketOutgoingTypesPayload[T],
): string => {
  const message: WebSocketOutgoingMessage<T> = {
    type,
    payload,
  }

  return JSON.stringify(message)
}
