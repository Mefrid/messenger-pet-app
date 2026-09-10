import type { IAuthTokenProvider, Token } from '@/application/ports/authTokenProvider'
import type { IDeviceStorage } from '../shared/utils/deviceStorage/deviceStorage'

const ACCESS_TOKEN_KEY = 'accessToken'

export class AccessTokenProvider implements IAuthTokenProvider {
  constructor(private storage: IDeviceStorage) {}

  save(token: Token): Promise<void> {
    return this.storage.save(ACCESS_TOKEN_KEY, token)
  }

  get(): Promise<Token> {
    return this.storage.get(ACCESS_TOKEN_KEY) as Promise<Token>
  }

  clear(): Promise<void> {
    return this.storage.clear(ACCESS_TOKEN_KEY)
  }
}
