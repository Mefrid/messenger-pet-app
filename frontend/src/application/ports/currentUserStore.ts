import type { IUser } from '@/domain/user'

export interface ICurrentUserStore {
  getCurrentUser(): IUser | null
  storeCurrentUser(user: IUser): Promise<void>
}
