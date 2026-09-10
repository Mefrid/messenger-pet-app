import { useUsersRepository } from '@/infrastructure/shared/diComposables'
import { useQuery } from '@/infrastructure/shared/ui/composables/useQuery'
import { ref, toRef, type Ref } from 'vue'

const PER_PAGE = 20

export const useUsersSearch = (query: Ref<string>) => {
  const usersRepository = useUsersRepository()
  const usersQuery = (newQuery: string, newPage: number) => {
    if (newQuery === '') {
      return Promise.resolve({
        data: [],
        total: 0,
      })
    }
    return usersRepository.searchUsers({ query: newQuery, page: newPage, perPage: PER_PAGE })
  }

  const currentPage = ref(1)

  const { loading, error, data } = useQuery([query, currentPage], usersQuery)
  const users = toRef(() => data.value?.data ?? [])
  const totalCount = toRef(() => data.value?.total ?? 0)

  return { loading, error, users, totalCount }
}
