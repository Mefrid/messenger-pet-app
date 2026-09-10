import { ROUTE_NAMES, type IRouter } from '../ports/router'
import type { IAuthRepository } from '../ports/authRepository'
import type { IAuthTokenProvider } from '../ports/authTokenProvider'
import type { IWebSocketClient } from '../ports/webSocketClient'

export const logout = async (dependencies: {
  authRepository: IAuthRepository
  authTokenProvider: IAuthTokenProvider
  webSocketClient: IWebSocketClient
  router: IRouter
}) => {
  const { authRepository, authTokenProvider, webSocketClient, router } = dependencies

  await authRepository.logout()
  await authTokenProvider.clear()
  await router.changeRoute(ROUTE_NAMES.LOGIN)

  webSocketClient.close()
}
