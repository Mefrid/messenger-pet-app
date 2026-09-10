import type { IChat } from '@/domain/chat'
import type { ChatMessageDetailed } from '@/domain/chatMessage'
import type { IUser } from '@/domain/user'

export enum WebSocketIncomingType {
  ReceivedChatMessage = 'received_chat_message',
  UserPresenceChanged = 'user_presence_changed',
  StartTyping = 'start_typing',
  StoppedTyping = 'stopped_typing',
}

export enum WebSocketOutgoingType {
  SendChatMessage = 'send_chat_message',
  StartTyping = 'start_typing',
  StoppedTyping = 'stopped_typing',
}

export type WebSocketIncomingTypesPayload = {
  [WebSocketIncomingType.ReceivedChatMessage]: {
    chatMessage: ChatMessageDetailed
  }
  [WebSocketIncomingType.UserPresenceChanged]: {
    userId: IUser['id']
    status: 'online' | 'offline'
  }
  [WebSocketIncomingType.StartTyping]: {
    userId: IUser['id']
    chatId: IChat['id']
  }
  [WebSocketIncomingType.StoppedTyping]: {
    userId: IUser['id']
    chatId: IChat['id']
  }
}

export type WebSocketOutgoingTypesPayload = {
  [WebSocketOutgoingType.SendChatMessage]: {
    chatId: string
    textContent: string
  }
  [WebSocketOutgoingType.StartTyping]: {
    chatId: IChat['id']
  }
  [WebSocketOutgoingType.StoppedTyping]: {
    chatId: IChat['id']
  }
}

export interface IWebSocketClient {
  connect(accessToken: string): void
  isConnected(): boolean
  close(): void
  subscribe<T extends WebSocketIncomingType>(
    event: T,
    handler: (payload: WebSocketIncomingTypesPayload[T]) => void,
  ): void
  sendMessage<T extends WebSocketOutgoingType>(
    type: T,
    payload: WebSocketOutgoingTypesPayload[T],
  ): void
}
