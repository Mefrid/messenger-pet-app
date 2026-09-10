import type { IUser } from '@/domain/user'

export const createTypingMessage = (typingsUserIds: Array<IUser['id']>, users: IUser[]) => {
  const names = typingsUserIds.map((userId) => users.find((user) => user.id === userId)!.name)
  return names.length > 0 ? `${names.join(', ')} are typing` : ''
}
