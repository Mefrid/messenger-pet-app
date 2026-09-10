import type { Application } from 'express'
import auth from './controllers/authController.ts'
import chats from './controllers/chatsController.ts'
import users from './controllers/usersController.ts'
import { authMiddleware } from './middlewares/authMiddleware.js'

export default {
  attachHttpControllers(app: Application): void {
    app.use('/api/v1/auth', auth)
    app.use('/api/v1/chats', authMiddleware, chats)
    app.use('/api/v1/users', authMiddleware, users)
  },
}
