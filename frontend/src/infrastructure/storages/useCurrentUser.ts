import type { IUser } from '@/domain/user'
import { defineStore } from 'pinia'
import { useAuthRepository } from '../shared/diComposables'

interface CurrentUserStore {
  currentUser: IUser | null
  isInitialized: boolean
}

export const useCurrentUser = defineStore('current_user', {
  state: (): CurrentUserStore => ({
    currentUser: null,
    isInitialized: false,
  }),
  actions: {
    async fetchUser() {
      if (this.isInitialized) {
        return
      }
      const authRep = useAuthRepository()
      this.currentUser = await authRep.me()
      this.isInitialized = true
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.currentUser,
  },
})
