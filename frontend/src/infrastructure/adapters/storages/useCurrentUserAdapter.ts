import type { ICurrentUserStore } from '@/application/ports/currentUserStore'
import { useCurrentUser } from '@/infrastructure/storages/useCurrentUser'

export const useCurrentUserAdapter = (): ICurrentUserStore => {
  const store = useCurrentUser()

  return {
    getCurrentUser() {
      return store.currentUser
    },

    storeCurrentUser(user) {
      store.currentUser = user
    },
  }
}
