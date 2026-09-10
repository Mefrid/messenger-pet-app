import { ref, watch, type Ref } from 'vue'
import { useAsync } from './useAsync'

type RefTuple<T extends readonly (string | number)[]> = {
  [K in keyof T]: Ref<T[K]>
}

export const useQuery = <T, K extends readonly (string | number)[]>(
  keys: RefTuple<K>,
  query: (...keys: K) => Promise<T>,
  minLoadingTime?: number,
) => {
  const runQuery = () => query(...(keys.map((key) => key.value) as unknown as K))
  const result = ref<T>()

  const {
    loading,
    error,
    clearError,
    asyncAction: triggerQuery,
  } = useAsync(runQuery, true, minLoadingTime)

  watch(
    keys,
    async () => {
      result.value = await triggerQuery()
    },
    {
      immediate: true,
    },
  )

  return { loading, error, data: result, clearError }
}
