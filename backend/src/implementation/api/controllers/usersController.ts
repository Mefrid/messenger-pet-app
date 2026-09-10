import { Router } from 'express'
import { FindUsers } from '../../../application/useCases/findUsers.ts'
import { services } from '../../../config/services.ts'
import { NotFoundError } from '../../../application/errors.ts'

const router = Router()

const userDAO = new services.userDAO()
const chatDAO = new services.chatDAO(userDAO)
const findUsersUseCase = new FindUsers(userDAO)

router.get('/', async (req, res, next) => {
  try {
    const query = req.query['query'] as string
    const page = Number(req.query['page'])
    const perPage = Number(req.query['perPage'])

    const searchResult = await findUsersUseCase.call({ query, page, perPage }, req.userId)
    res.status(200).send(searchResult)
  } catch (err) {
    return next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const userId = req.params.id

    const searchResult = await userDAO.findUser(userId)
    if (!searchResult) {
      throw new NotFoundError(`No user with id ${userId} was found`)
    }

    const user = userDAO.mapToDTO(searchResult)
    res.status(200).send(user)
  } catch (err) {
    return next(err)
  }
})

router.get('/:id/direct-chat', async (req, res, next) => {
  try {
    const userId = req.params.id
    const currentUserId = req.userId

    const searchResult = await chatDAO.findDirectChatWithUser(currentUserId, userId)
    if (!searchResult) {
      throw new NotFoundError(
        `No private chat was found between users ${currentUserId} and ${userId}`,
      )
    }
    res.status(200).send(searchResult)
  } catch (err) {
    return next(err)
  }
})

export default router
