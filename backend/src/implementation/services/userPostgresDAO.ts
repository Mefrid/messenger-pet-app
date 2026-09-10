import type { IUserDAO } from '../../application/ports/userDAO.js'
import { User, type UserDTO } from '../../domain/user.js'
import { pool } from '../infrastructure/database/db.ts'

export class UserPostgresDAO implements IUserDAO {
  async findUsers(
    searchSettings: SearchSettings,
    excludeIds: User['id'][] = [],
  ): Promise<Paginated<UserDTO>> {
    const { query: queryRaw, page, perPage } = searchSettings
    const offset = Math.max(perPage * (page - 1), 0)
    const excludeCondition = `WHERE id <> ALL($1::uuid[])`
    const condition = `AND ($2 = '' OR login ILIKE $2 OR name ILIKE $2 OR surname ILIKE $2)`
    const query = queryRaw ? `%${queryRaw}%` : ''

    const [searchResult, totalNumberResult] = await Promise.all([
      pool.query(
        `
        SELECT * FROM users
        ${excludeCondition}
        ${condition}
        ORDER BY created_at DESC
        LIMIT $3 OFFSET $4
      `,
        [excludeIds, query, perPage, offset],
      ),
      pool.query(
        `
        SELECT COUNT(*) AS total FROM users
        ${excludeCondition}
        ${condition}
        `,
        [excludeIds, query],
      ),
    ])
    const users = searchResult.rows.map((rawUser) => {
      return this.mapToDTO(this.mapUser(rawUser))
    })
    const totalCount = Number(totalNumberResult.rows[0].total)

    return { data: users, total: totalCount }
  }

  async findUser(userId: UUID) {
    const result = await pool.query(
      `
        SELECT * FROM users
        WHERE id = $1
      `,
      [userId],
    )
    if (result.rowCount === 0) return null

    return this.mapUser(result.rows[0])
  }

  async findUserByLogin(login: string) {
    const result = await pool.query(
      `
        SELECT *
        FROM users
        WHERE login = $1
      `,
      [login],
    )
    if (result.rowCount === 0) return null

    return this.mapUser(result.rows[0])
  }

  /*
    It better be a separated UserMapper class, but I chose keep it simple
  */
  mapUser(userRaw: any): User {
    return new User(
      userRaw.id,
      userRaw.name,
      userRaw.surname,
      userRaw.login,
      userRaw.avatar_url,
      new Date(userRaw.birth_date),
      userRaw.password_hash,
    )
  }

  mapToDTO(user: User): UserDTO {
    const { passwordHash, ...dto } = user
    return dto
  }
}
