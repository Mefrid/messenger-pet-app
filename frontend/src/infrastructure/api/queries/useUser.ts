import { useUsersRepository } from '@/infrastructure/shared/diComposables'
import { useQuery } from '@/infrastructure/shared/ui/composables/useQuery'
import { type Ref } from 'vue'

export const useUser = (id: Ref<string>) => {
  const usersRepository = useUsersRepository()
  const userQuery = (newId: string) => {
    return usersRepository.findUser(newId)
  }

  const { loading, error, data: user } = useQuery([id], userQuery)

  return { loading, error, user }
}
