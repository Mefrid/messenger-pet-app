import type { IUser } from '@/domain/user'

export interface IUsersRepository {
  searchUsers(searchSettings: SearchSettings): Promise<Paginated<IUser>>
  findUser(userId: IUser['id']): Promise<IUser>
}
