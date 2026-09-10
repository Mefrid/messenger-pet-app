import {
  useAuthRepository,
  useAuthTokenProvider,
  useRouter,
} from '@/infrastructure/shared/diComposables'
import { logout as _logout } from '@/application/useCases/logout'
import { wsc } from '@/infrastructure/api/webSocketClient'
import { useAsync } from '@/infrastructure/shared/ui/composables/useAsync'

export const useLogoutUseCase = () => {
  const authRepository = useAuthRepository()
  const authTokenProvider = useAuthTokenProvider()
  const router = useRouter()

  const tryLogout = () =>
    _logout({ authRepository, authTokenProvider, webSocketClient: wsc, router })

  const { loading, asyncAction: logout } = useAsync(tryLogout)

  return { loading, logout }
}
