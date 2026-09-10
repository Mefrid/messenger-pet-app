import type { IHttpClient } from '../httpClient'
import type { IUsersRepository } from '@/application/ports/usersRepository'
import type { IUser } from '@/domain/user'
import { createURLWithQueryParams } from '@/infrastructure/shared/utils/createURLQueryParams'

export class UsersApiRepository implements IUsersRepository {
  constructor(private httpClient: IHttpClient) {}

  async searchUsers(searchSettings: SearchSettings): Promise<Paginated<IUser>> {
    const { data } = await this.httpClient.get<Paginated<IUser>>(
      createURLWithQueryParams('/users', searchSettings),
    )
    return data
  }

  async findUser(userId: IUser['id']): Promise<IUser> {
    const { data } = await this.httpClient.get<IUser>(`/users/${userId}`)
    return data
  }
}
