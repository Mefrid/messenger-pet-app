export interface IUser {
  readonly id: string
  readonly name: string
  readonly surname: string
  readonly login: string
  readonly avatarUrl: string
  readonly birthDate?: Date
  online?: boolean
}

export const getUserFullname = (user: IUser) => user.name + ' ' + user.surname
