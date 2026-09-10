import {
  type AuthTokenPayload,
  type IAuthTokenProvider,
} from '../../application/ports/authTokenProvider.js'
import { SignJWT, jwtVerify } from 'jose'
import { config } from '../../config/appConfig.js'
import type { User } from '../../domain/user.js'
import { UnauthorizedError } from '../../application/errors.js'
import { pool } from '../infrastructure/database/db.ts'
import { createHash } from 'node:crypto'

export class JWTProvider implements IAuthTokenProvider {
  private accessSecret: Uint8Array
  private refreshSecret: Uint8Array

  constructor() {
    const textEncoder = new TextEncoder()
    this.accessSecret = textEncoder.encode(config.accessTokenSecret)
    this.refreshSecret = textEncoder.encode(config.refreshTokenSecret)
  }

  createAccessToken(payload: PartialWithSomeRequired<User, 'id'>) {
    return new SignJWT({
      type: 'access',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(payload.id)
      .setIssuedAt()
      .setExpirationTime('5m')
      .sign(this.accessSecret)
  }
  async createRefreshToken(payload: PartialWithSomeRequired<User, 'id'>) {
    const expirationSpan = 7 * 24 * 60 * 60 * 1000 // 7 days
    const expirationDate = Date.now() + expirationSpan

    const refreshToken = await new SignJWT({
      type: 'refresh',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(payload.id)
      .setIssuedAt()
      .setExpirationTime(expirationDate)
      .sign(this.refreshSecret)

    const hashedToken = this.hash(refreshToken)

    await pool.query(
      `
        INSERT INTO refresh_tokens (token_hash, user_id, expires_at)
        VALUES ($1, $2, $3)
      `,
      [hashedToken, payload.id, new Date(expirationDate).toISOString()],
    )
    return refreshToken
  }

  async verifyAccessToken(token: string) {
    const { payload } = await jwtVerify<AuthTokenPayload>(token, this.accessSecret, {
      algorithms: ['HS256'],
    })
    if (payload.type !== 'access') {
      throw new UnauthorizedError()
    }

    if (!payload.sub || typeof payload.sub !== 'string') {
      throw new UnauthorizedError()
    }

    return {
      userId: payload.sub,
      type: 'access',
    } satisfies AuthTokenPayload
  }

  async verifyRefreshToken(token: string) {
    const { payload } = await jwtVerify<AuthTokenPayload>(token, this.refreshSecret, {
      algorithms: ['HS256'],
    })
    if (payload.type !== 'refresh') {
      throw new UnauthorizedError('Token type must be "refresh".')
    }

    if (!payload.sub || typeof payload.sub !== 'string') {
      throw new UnauthorizedError('"sub" claim must be string.')
    }

    const result = await pool.query(
      `
        SELECT expires_at, revoked_at
        FROM refresh_tokens
        WHERE token_hash = $1
      `,
      [this.hash(token)],
    )
    if (result.rowCount === 0) {
      throw new UnauthorizedError('Refresh token was not found.')
    }

    const refreshToken = result.rows[0]
    const expirationDate = new Date(refreshToken.expires_at)

    if (new Date() > expirationDate) {
      throw new UnauthorizedError('Refresh token has been expired.')
    }

    if (!!refreshToken.revoked_at) {
      throw new UnauthorizedError('Refresh token has been revoked.')
    }

    return {
      userId: payload.sub,
      type: 'refresh',
    } satisfies AuthTokenPayload
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await pool.query(
      `
      UPDATE refresh_tokens
      SET revoked_at = NOW()
      WHERE token_hash = $1
    `,
      [this.hash(token)],
    )
  }

  private hash(token: string) {
    return createHash('sha256').update(token).digest('hex')
  }
}
