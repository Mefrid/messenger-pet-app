import type { IAuthRepository, LoginResult } from '@/application/ports/authRepository'
import type { IHttpClient } from '../httpClient'
import type { IUser } from '@/domain/user'

export class AuthApiRepository implements IAuthRepository {
  constructor(private httpClient: IHttpClient) {}

  async login(login: string, password: string): Promise<LoginResult> {
    const { data } = await this.httpClient.post<LoginResult>('/auth/login', {
      login,
      password,
    })
    return data
  }

  async me(): Promise<IUser> {
    const { data } = await this.httpClient.get<{ user: IUser }>('/auth/me')
    return data.user
  }

  async logout(): Promise<void> {
    await this.httpClient.post<LoginResult>('/auth/logout')
  }
}
