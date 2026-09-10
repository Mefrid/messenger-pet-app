import type { Chat, ChatDetailedDTO } from '../../domain/chat.ts'
import type { User } from '../../domain/user.ts'
import { NotFoundError } from '../errors.js'
import type IUseCase from '../IUseCase.js'
import type { IChatDAO } from '../ports/chatDAO.ts'

export class FindChat implements IUseCase<Promise<ChatDetailedDTO>> {
  constructor(private chatDAO: IChatDAO) {}

  async call(chatId: Chat['id'], currentUserId: User['id']): Promise<ChatDetailedDTO> {
    const foundedChat = await this.chatDAO.findChat(chatId)
    const participants = foundedChat?.participants ?? []

    const isChatWithCurrentUser = !!participants.find((user) => user.id === currentUserId)

    if (!isChatWithCurrentUser) {
      throw new NotFoundError(`No chat with id ${chatId} was found`)
    }

    return foundedChat!
  }
}
