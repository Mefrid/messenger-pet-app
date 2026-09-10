import { ref, watchEffect, type Ref } from 'vue'

export const useDebounce = <T>(originRef: Ref<T>, delay = 400) => {
  const debounced = ref<T>(originRef.value)

  watchEffect((onCleanup) => {
    const newValue = originRef.value

    const timeout = setTimeout(() => {
      debounced.value = newValue
    }, delay)

    onCleanup(() => clearTimeout(timeout))
  })

  return debounced
}
