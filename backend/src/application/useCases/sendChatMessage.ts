import type { Chat } from '../../domain/chat.ts'
import type { ChatMessageCreationDTO, ChatMessageDetailedDTO } from '../../domain/chatMessage.ts'
import type { User, UserDTO } from '../../domain/user.ts'
import { NotFoundError } from '../errors.ts'
import type IUseCase from '../IUseCase.ts'
import type { IChatDAO } from '../ports/chatDAO.ts'

export type SendChatMessageResult = {
  recipients: Array<UserDTO>
  chatMessage: ChatMessageDetailedDTO
}

export class SendChatMessage implements IUseCase<Promise<SendChatMessageResult>> {
  constructor(private chatDAO: IChatDAO) {}

  async call(
    chatId: Chat['id'],
    currentUserId: User['id'],
    message: ChatMessageCreationDTO,
  ): Promise<SendChatMessageResult> {
    const foundedChat = await this.chatDAO.findChat(chatId)
    const participants = foundedChat?.participants ?? []

    const currentUser = participants.find((user) => user.id === currentUserId)
    const isChatWithCurrentUser = !!currentUser

    if (!isChatWithCurrentUser) {
      throw new NotFoundError(`No chat with id ${chatId} was found`)
    }

    const chatMessage = await this.chatDAO.sendMessage(currentUserId, message, chatId)
    const { senderId, ...chatContent } = chatMessage
    const chatMessageDetailed: ChatMessageDetailedDTO = {
      ...chatContent,
      sender: currentUser,
    }
    const recipients = participants.filter((participant) => participant.id !== currentUserId)

    return { recipients, chatMessage: chatMessageDetailed }
  }
}
