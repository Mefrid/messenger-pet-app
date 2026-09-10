import type { User, UserDTO } from '../../domain/user.js'
import { ValidationError } from '../errors.js'
import type IUseCase from '../IUseCase.js'
import type { IUserDAO } from '../ports/userDAO.js'

export type FindUsersResponse = Paginated<UserDTO>

const MAX_QUERY_LENGTH = 128

export class FindUsers implements IUseCase<Promise<FindUsersResponse>> {
  constructor(private userDAO: IUserDAO) {}

  async call(searchSetting: SearchSettings, currentUserId: User['id']): Promise<FindUsersResponse> {
    const { query = '', page = 0, perPage = 20 } = searchSetting

    if (query.length > MAX_QUERY_LENGTH) {
      throw new ValidationError(`Max length of query is ${MAX_QUERY_LENGTH}`)
    }

    const foundUsers = await this.userDAO.findUsers({ query, page, perPage }, [currentUserId])

    return foundUsers
  }
}
