import type { User, UserDTO } from '../../domain/user.js'

export interface IUserDAO {
  findUsers(searchSettings: SearchSettings, excludeIds?: User['id'][]): Promise<Paginated<UserDTO>>
  findUser(userId: UUID): User | null | Promise<User | null>
  findUserByLogin(login: string): User | null | Promise<User | null>

  mapToDTO(user: User): UserDTO
  mapUser(userRaw: any): User
}
