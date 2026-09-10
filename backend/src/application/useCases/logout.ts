import type IUseCase from '../IUseCase.ts'
import type { IAuthTokenProvider } from '../ports/authTokenProvider.ts'

export class LogoutUser implements IUseCase<Promise<void>> {
  constructor(private authTokenProvider: IAuthTokenProvider) {}

  async call(refreshToken: string): Promise<void> {
    if (!refreshToken) {
      return
    }
    await this.authTokenProvider.revokeRefreshToken(refreshToken)
  }
}
