import { ChatType, type ChatDetailedDTO } from '../../domain/chat.ts'
import { ValidationError } from '../errors.ts'
import type IUseCase from '../IUseCase.ts'
import type { IChatDAO } from '../ports/chatDAO.ts'

export type CreateDirectChatResponse = ChatDetailedDTO

type CreateDirectChatDetailedDTO = {
  userId: string
  currentUserId: string
}

export class CreateDirectChat implements IUseCase<Promise<CreateDirectChatResponse>> {
  constructor(private chatDAO: IChatDAO) {}

  async call(
    createDirectChatDetailedDTO: CreateDirectChatDetailedDTO,
  ): Promise<CreateDirectChatResponse> {
    const { userId, currentUserId } = createDirectChatDetailedDTO

    if (!userId) {
      throw new ValidationError('"userId" is required.')
    }

    if (userId === currentUserId) {
      throw new ValidationError('You cannot create a chat with yourself.')
    }

    const existingChat = await this.chatDAO.findDirectChatWithUser(currentUserId, userId)

    if (existingChat) {
      return existingChat
    }

    const createdChat = await this.chatDAO.createChat(currentUserId, [userId], ChatType.Direct)

    return createdChat
  }
}
