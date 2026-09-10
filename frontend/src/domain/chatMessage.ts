import type { IUser } from './user'

export interface IChatMessage {
  id: string
  chatId: string
  senderId: string
  timestamp: Date
  textContent: string
}

export type ChatMessageDetailed = Omit<IChatMessage, 'senderId'> & {
  sender: IUser
}

// Not using uuid() and Date.now() to keep function clean of side effects
export const createChatMessage = (
  id: string,
  chatId: string,
  senderId: string,
  timestamp: Date,
  textContent: string,
): IChatMessage => ({
  id,
  chatId,
  senderId,
  timestamp,
  textContent,
})
