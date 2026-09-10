import type { App } from 'vue'
import { AccessTokenProvider } from '@/infrastructure/adapters/accessTokenProvider'
import { AxiosHttpClient } from '@/infrastructure/api/axiosHttpClient'
import { AuthApiRepository } from '@/infrastructure/api/repositories/authApiRepository'
import { LocalStorageProvider } from '@/infrastructure/shared/utils/deviceStorage/localStorageProvider'
import { UsersApiRepository } from '@/infrastructure/api/repositories/usersApiRepository'
import { VueRouter } from '@/infrastructure/shared/vueRouter'
import router from './router'
import { ChatsApiRepository } from '@/infrastructure/api/repositories/chatsApiRepsitory'
import { wsc } from '@/infrastructure/api/webSocketClient'

export const HTTP_CLIENT_KEY = Symbol('HTTP_CLIENT')
export const AUTH_TOKEN_PROVIDER_KEY = Symbol('AUTH_TOKEN_PROVIDER')
export const ROUTER_KEY = Symbol('ROUTER')

export const AUTH_REPOSITORY_KEY = Symbol('AUTH_REPOSITORY')
export const USERS_REPOSITORY_KEY = Symbol('USERS_REPOSITORY_KEY')
export const CHATS_REPOSITORY_KEY = Symbol('CHATS_REPOSITORY_KEY')

const localStorageStorage = new LocalStorageProvider()
const vueRouter = new VueRouter(router)
const authTokenProvider = new AccessTokenProvider(localStorageStorage)
const httpClient = new AxiosHttpClient(authTokenProvider, wsc, vueRouter)

const authRepository = new AuthApiRepository(httpClient)
const usersRepository = new UsersApiRepository(httpClient)
const chatsRepository = new ChatsApiRepository(httpClient)

const inject = (app: App) => {
  app.provide(HTTP_CLIENT_KEY, httpClient)
  app.provide(AUTH_TOKEN_PROVIDER_KEY, authTokenProvider)
  app.provide(ROUTER_KEY, vueRouter)

  app.provide(AUTH_REPOSITORY_KEY, authRepository)
  app.provide(USERS_REPOSITORY_KEY, usersRepository)
  app.provide(CHATS_REPOSITORY_KEY, chatsRepository)
}

export default {
  inject,
}
