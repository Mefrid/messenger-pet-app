import { ROUTE_NAMES, type IRouter } from '../ports/router'
import type { IAuthRepository } from '../ports/authRepository'
import type { IAuthTokenProvider } from '../ports/authTokenProvider'
import type { ICurrentUserStore } from '../ports/currentUserStore'
import type { IWebSocketClient } from '../ports/webSocketClient'

export type LoginPayload = {
  login: string
  password: string
}

export const login = async (
  dependencies: {
    authRepository: IAuthRepository
    currentUserStore: ICurrentUserStore
    authTokenProvider: IAuthTokenProvider
    webSocketClient: IWebSocketClient
    router: IRouter
  },
  payload: LoginPayload,
) => {
  const { authRepository, currentUserStore, authTokenProvider, webSocketClient, router } =
    dependencies

  const { accessToken, user } = await authRepository.login(payload.login, payload.password)

  webSocketClient.connect(accessToken)
  await authTokenProvider.save(accessToken)
  currentUserStore.storeCurrentUser(user)
  await router.changeRoute(ROUTE_NAMES.HOME)

  return user
}
