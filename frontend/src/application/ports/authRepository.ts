import type { IUser } from '@/domain/user'

export type LoginResult = { accessToken: string; user: IUser }
export type LoginError = string

export interface IAuthRepository {
  me(): Promise<IUser>
  login(login: string, password: string): Promise<LoginResult>
  logout(): Promise<void>
}
