import { ref } from 'vue'
import { wait } from '../../utils/wait'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useAsync = <E extends Error, P extends (...args: any[]) => any>(
  action: P,
  defaultLoading = false,
  minLoadingTime = 400,
) => {
  const loading = ref(defaultLoading)
  const error = ref<E>()

  const asyncAction = async (...args: Parameters<P>): Promise<Awaited<ReturnType<P>>> => {
    loading.value = true
    try {
      const [result] = await Promise.all([action(...args), wait(minLoadingTime)])

      error.value = undefined

      return result
    } catch (e) {
      const actionError = e as E
      error.value = actionError

      throw actionError
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = undefined
  }

  return { loading, error, clearError, asyncAction }
}
