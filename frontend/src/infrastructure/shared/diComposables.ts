import { inject } from 'vue'
import {
  AUTH_REPOSITORY_KEY,
  AUTH_TOKEN_PROVIDER_KEY,
  CHATS_REPOSITORY_KEY,
  HTTP_CLIENT_KEY,
  ROUTER_KEY,
  USERS_REPOSITORY_KEY,
} from '@/infrastructure/ui/app/diContainer'
import type { IHttpClient } from '@/infrastructure/api/httpClient'
import type { IAuthRepository } from '@/application/ports/authRepository'
import type { IAuthTokenProvider } from '@/application/ports/authTokenProvider'
import type { IUsersRepository } from '@/application/ports/usersRepository'
import type { IChatsRepository } from '@/application/ports/chatsRepository'
import type { IRouter } from '@/application/ports/router'

export const useAuthTokenProvider = () => {
  const authTokenProvider = inject<IAuthTokenProvider>(AUTH_TOKEN_PROVIDER_KEY)!
  return authTokenProvider
}

export const useHttpClient = () => {
  const httpClient = inject<IHttpClient>(HTTP_CLIENT_KEY)!
  return httpClient
}

export const useRouter = () => {
  const router = inject<IRouter>(ROUTER_KEY)!
  return router
}

export const useAuthRepository = () => {
  const authRepository = inject<IAuthRepository>(AUTH_REPOSITORY_KEY)!
  return authRepository
}

export const useUsersRepository = () => {
  const usersRepository = inject<IUsersRepository>(USERS_REPOSITORY_KEY)!
  return usersRepository
}

export const useChatsRepository = () => {
  const chatsRepository = inject<IChatsRepository>(CHATS_REPOSITORY_KEY)!
  return chatsRepository
}
