import type { Ref } from 'vue'
import {
  useAuthRepository,
  useAuthTokenProvider,
  useRouter,
} from '@/infrastructure/shared/diComposables'
import { login as _login, type LoginPayload } from '@/application/useCases/login'
import { useCurrentUserAdapter } from '../storages/useCurrentUserAdapter'
import { wsc } from '@/infrastructure/api/webSocketClient'
import { useAsync } from '@/infrastructure/shared/ui/composables/useAsync'
import type { ServerError } from '@/infrastructure/api/httpClient'

export const useLoginUseCase = (loginPayload: Ref<LoginPayload>) => {
  const authRepository = useAuthRepository()
  const authTokenProvider = useAuthTokenProvider()
  const currentUserStore = useCurrentUserAdapter()
  const router = useRouter()

  const _tryLogin = () =>
    _login(
      { authRepository, currentUserStore, authTokenProvider, webSocketClient: wsc, router },
      { login: loginPayload.value.login, password: loginPayload.value.password },
    )

  const {
    loading,
    error,
    clearError,
    asyncAction: login,
  } = useAsync<ServerError, typeof _tryLogin>(_tryLogin)

  return { loading, error, clearError, login }
}
