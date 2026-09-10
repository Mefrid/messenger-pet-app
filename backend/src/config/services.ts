import type { IAuthTokenProvider } from '../application/ports/authTokenProvider.js'
import type { IChatDAO } from '../application/ports/chatDAO.ts'
import type { IPasswordHasher } from '../application/ports/passwordHasher.js'
import type { IUserDAO } from '../application/ports/userDAO.js'
import { ArgonPasswordHasher } from '../implementation/services/argonPasswordHasher.js'
import { ChatPostgresDAO } from '../implementation/services/chatPostgresDAO.ts'
import { JWTProvider } from '../implementation/services/JWTProvider.js'
import { UserPostgresDAO } from '../implementation/services/userPostgresDAO.ts'

interface IServices {
  passwordHasher: new () => IPasswordHasher
  authProvider: new () => IAuthTokenProvider
  userDAO: new () => IUserDAO
  chatDAO: new (userDAO: IUserDAO) => IChatDAO
}

export const services: IServices = {
  passwordHasher: ArgonPasswordHasher,
  authProvider: JWTProvider,
  userDAO: UserPostgresDAO,
  chatDAO: ChatPostgresDAO,
}
