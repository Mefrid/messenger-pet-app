import type { IChatMessage } from './chatMessage'
import type { IUser } from './user'

export interface IChat {
  id: string
  participants: IUser['id'][]
  type: 'direct' | 'group'
}

export type ChatDetailed = {
  id: string
  participants: IUser[]
  type: 'direct' | 'group'
}

export type ChatListElement = IChat & {
  lastMessage: IChatMessage
}

export type ChatListElementDetailed = ChatDetailed & {
  lastMessage?: IChatMessage
}
