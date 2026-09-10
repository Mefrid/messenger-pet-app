import { Router, type Request } from 'express'
import { LoginUser } from '../../../application/useCases/login.js'
import { services } from '../../../config/services.js'
import { NotFoundError, UnauthorizedError } from '../../../application/errors.js'
import { authMiddleware } from '../middlewares/authMiddleware.ts'
import { LogoutUser } from '../../../application/useCases/logout.ts'

type LoginPayload = {
  login: string
  password: string
}

const router = Router()

const userDAO = new services.userDAO()
const authTokenProvider = new services.authProvider()
const passwordHasher = new services.passwordHasher()

const loginUseCase = new LoginUser(userDAO, authTokenProvider, passwordHasher)
const logoutUseCase = new LogoutUser(authTokenProvider)

router.post('/login', async (req: Request<{}, {}, LoginPayload>, res, next) => {
  try {
    const { login, password } = req.body
    const { accessToken, refreshToken, user } = await loginUseCase.call(login, password)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      // secure: true
    })
    res.send({ accessToken, user })
  } catch (err) {
    return next(err)
  }
})

router.post('/logout', authMiddleware, async (req, res, next) => {
  try {
    const refreshToken = req.cookies['refreshToken']
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token is not provided.')
    }

    await logoutUseCase.call(refreshToken)

    res.clearCookie('refreshToken')
    res.status(200).send()
  } catch (err) {
    return next(err)
  }
})

/*
  Handling logic without separate use case because
  refreshing an access token is not use case from
  user point of view.
*/
router.post('/refresh', async (req, res, next) => {
  try {
    const refreshToken = req.cookies['refreshToken']
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token is not provided.')
    }
    const { userId } = await authTokenProvider.verifyRefreshToken(refreshToken)
    const accessToken = await authTokenProvider.createAccessToken({ id: userId })
    res.send({ accessToken })
  } catch (err) {
    return next(err)
  }
})

router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.userId
    const user = await userDAO.findUser(userId)

    if (user) {
      res.status(200).send({ user: userDAO.mapToDTO(user) })
    } else {
      throw new NotFoundError(`No user with id ${userId} was found`)
    }
  } catch (err) {
    return next(err)
  }
})

export default router
