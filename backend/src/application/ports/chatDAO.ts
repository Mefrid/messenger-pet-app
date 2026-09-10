import type { Chat, ChatDetailedDTO, ChatListDTO } from '../../domain/chat.js'
import type { ChatMessage, ChatMessageCreationDTO } from '../../domain/chatMessage.js'
import type { ChatParticipant } from '../../domain/chatParticipant.ts'
import type { User, UserDTO } from '../../domain/user.ts'

export interface IChatDAO {
  findCurrentChats(currentUserId: User['id']): Promise<ChatListDTO[]>
  findDirectChatWithUser(
    currentUserId: User['id'],
    userId: User['id'],
  ): Promise<ChatDetailedDTO | null>
  findChat(chatId: string): Promise<ChatDetailedDTO | null>
  findAllInterlocutors(userId: string): Promise<UserDTO[]>
  getMessagesInChat(chatId: Chat['id']): Promise<ChatMessage[]>

  sendMessage(
    currentUserId: User['id'],
    messageDTO: ChatMessageCreationDTO,
    chatId: Chat['id'],
  ): Promise<ChatMessage>
  createChat(
    currentUserId: User['id'],
    otherParticipantIds: User['id'][],
    type: Chat['type'],
  ): Promise<ChatDetailedDTO>

  mapChat(chatRaw: any, chatParticipants: ChatParticipant[]): Chat
  mapChatParticipant(chatParticipantRaw: any): ChatParticipant
  mapChatMessage(chatMessageRaw: any): ChatMessage
}
