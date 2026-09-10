import type { ChatMessage } from './chatMessage.ts'
import { ChatParticipant } from './chatParticipant.ts'
import type { User, UserDTO } from './user.ts'

export enum ChatType {
  Direct = 'direct',
  Group = 'group',
}

export class Chat {
  constructor(
    public readonly id: UUID,
    public readonly type: ChatType,
    private participants: ChatParticipant[],
  ) {}

  addParticipant(userId: User['id'], joinDate: Date) {
    this.participants.push(new ChatParticipant(userId, joinDate))
  }

  getParticipantIds() {
    return this.participants.map((participant) => participant.userId)
  }

  removeParticipant(userId: User['id']) {
    this.participants = this.participants.filter((participant) => participant.userId !== userId)
  }
}

export type ChatListDTO = {
  id: Chat['id']
  type: Chat['type']
  participants: UserDTO[]
  lastMessage?: ChatMessage
}

export type ChatDetailedDTO = {
  id: Chat['id']
  type: Chat['type']
  participants: UserDTO[]
}
