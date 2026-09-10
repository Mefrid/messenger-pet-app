import type { UserDTO } from './user.ts'

export class ChatMessage {
  constructor(
    public readonly id: UUID,
    public readonly senderId: UUID,
    public readonly chatId: UUID,
    public readonly timestamp: Timestamp,
    public readonly textContent: string,
  ) {}
}

export type ChatMessageDetailedDTO = Omit<ChatMessage, 'senderId'> & {
  sender: UserDTO
}

export type ChatMessageCreationDTO = Pick<ChatMessage, 'textContent'>
