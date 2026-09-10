import { type RequestHandler } from 'express'
import { services } from '../../../config/services.js'
import { UnauthorizedError } from '../../../application/errors.js'

const authProvider = new services.authProvider()

export const authMiddleware: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers['authorization']

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('No access token provided.')
  }

  const accessToken = authHeader.split(' ')[1]!

  try {
    const { userId } = await authProvider.verifyAccessToken(accessToken)

    req.userId = userId

    next()
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired access token.')
  }
}
