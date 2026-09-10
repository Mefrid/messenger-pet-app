import type { UserDTO } from '../../domain/user.js'
import { UnauthorizedError, ValidationError } from '../errors.js'
import type IUseCase from '../IUseCase.js'
import type { IAuthTokenProvider } from '../ports/authTokenProvider.js'
import type { IPasswordHasher } from '../ports/passwordHasher.js'
import type { IUserDAO } from '../ports/userDAO.js'

export interface ILoginResponse {
  accessToken: string
  refreshToken: string
  user: UserDTO
}

export class LoginUser implements IUseCase<Promise<ILoginResponse>> {
  constructor(
    private userDAO: IUserDAO,
    private authTokenProvider: IAuthTokenProvider,
    private passwordHasher: IPasswordHasher,
  ) {}

  async call(login: string, password: string): Promise<ILoginResponse> {
    if (!login || !password) {
      throw new ValidationError('Login and password are required')
    }

    const foundUser = await this.userDAO.findUserByLogin(login)
    if (!foundUser) {
      throw new UnauthorizedError('Invalid login or password')
    }

    const existingPasswordHash = foundUser.passwordHash ?? ''
    const passwordsAreMatching = await this.passwordHasher.verify(password, existingPasswordHash)

    if (!passwordsAreMatching) {
      throw new UnauthorizedError('Invalid login or password')
    }

    const { passwordHash, ...userDTO } = foundUser
    const { id, name } = userDTO
    const accessToken = await this.authTokenProvider.createAccessToken({ id, name })
    const refreshToken = await this.authTokenProvider.createRefreshToken({ id, name })

    return { accessToken, refreshToken, user: userDTO }
  }
}
