import type { User } from '../../domain/user.js'

export type AuthTokenPayload = {
  userId: string
  type: 'access' | 'refresh'
}

export interface IAuthTokenProvider {
  createAccessToken(payload: PartialWithSomeRequired<User, 'id'>): Promise<string> | string
  createRefreshToken(payload: PartialWithSomeRequired<User, 'id'>): Promise<string> | string

  verifyAccessToken(token: string): Promise<AuthTokenPayload>
  verifyRefreshToken(token: string): Promise<AuthTokenPayload>

  revokeRefreshToken(token: string): Promise<void>
}
