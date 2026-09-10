export type Token = string

export interface IAuthTokenProvider {
  save(token: Token): Promise<void>

  get(): Promise<Token>

  clear(): Promise<void>
}
