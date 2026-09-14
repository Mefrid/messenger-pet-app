import { defineStore } from 'pinia'
import type { IUser } from '@/domain/user'
import { ObjectValueSet } from '../shared/utils/objectValueSet'

interface UsersStore {
  users: ObjectValueSet<IUser, 'id'>
}

export const useUsersStore = defineStore('users', {
  state: (): UsersStore => ({
    users: new ObjectValueSet<IUser, 'id'>([], 'id'),
  }),

  actions: {
    addUser(user: IUser) {
      this.users.add(user)
    },

    addUsers(users: IUser[]) {
      this.users.addMultiple(users)
    },

    getUser(id: IUser['id']) {
      return this.users.get(id)
    },

    updateUser(userId: IUser['id'], newUser: Partial<IUser>) {
      const user = this.getUser(userId)
      if (!user) {
        console.error(`User with id ${userId} not found`)
        return
      }
      this.users.update(userId, {
        ...user,
        ...newUser,
      })
    },
  },
})
