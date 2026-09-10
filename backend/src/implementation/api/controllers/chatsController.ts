import { Router, type Request } from 'express'
import type { User } from '../../../domain/user.ts'
import { CreateDirectChat } from '../../../application/useCases/createDirectChat.ts'
import { services } from '../../../config/services.ts'
import { FindChat } from '../../../application/useCases/findChat.ts'
import { FindChatMessages } from '../../../application/useCases/findChatMessages.ts'
import { wss } from '../server.ts'

const router = Router()

type CreateDirectChatPayload = {
  userId: User['id']
}

const userDAO = new services.userDAO()
const chatDAO = new services.chatDAO(userDAO)

const createDirectChatUseCase = new CreateDirectChat(chatDAO)
const findChatUseCase = new FindChat(chatDAO)
const findChatMessagesUseCase = new FindChatMessages(chatDAO)

router.post('/direct', async (req: Request<{}, {}, CreateDirectChatPayload>, res, next) => {
  try {
    const currentUserId = req.userId
    const { userId } = req.body

    const result = await createDirectChatUseCase.call({ userId, currentUserId })

    res.status(200).send(result)
  } catch (err) {
    return next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const currentUserId = req.userId
    const chatId = req.params.id

    const chat = await findChatUseCase.call(chatId, currentUserId)
    res.status(200).send(chat)
  } catch (err) {
    return next(err)
  }
})

router.get('/:id/messages', async (req, res, next) => {
  try {
    const currentUserId = req.userId
    const chatId = req.params.id

    const messages = await findChatMessagesUseCase.call(chatId, currentUserId)
    res.status(200).send(messages)
  } catch (err) {
    return next(err)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const currentUserId = req.userId

    const chatsRaw = await chatDAO.findCurrentChats(currentUserId)
    const chats = chatsRaw.map((chat) => ({
      ...chat,
      participants: chat.participants.map((participant) => ({
        ...participant,
        online: wss.isOnline(participant.id),
      })),
    }))
    res.status(200).send(chats)
  } catch (err) {
    return next(err)
  }
})

export default router
