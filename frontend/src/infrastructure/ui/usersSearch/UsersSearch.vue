<script setup lang="ts">
import { useUsersSearch } from '@/infrastructure/api/queries/useUsersSearch'
import BaseDrawer from '@/infrastructure/shared/ui/components/BaseDrawer.vue'
import BaseInput from '@/infrastructure/shared/ui/components/BaseInput.vue'
import BaseSpinner from '@/infrastructure/shared/ui/components/BaseSpinner.vue'
import BaseStub from '@/infrastructure/shared/ui/components/BaseStub.vue'
import { useDebounce } from '@/infrastructure/shared/ui/composables/useDebounce'
import { getUserFullname } from '@/domain/user'
import { ref } from 'vue'
import UserRow from '../userRow/UserRow.vue'
import { useCreateDirectChatUseCase } from '@/infrastructure/adapters/useCases/useCreateDirectChatUseCase.ts'

const isVisible = defineModel('isVisible', {
  required: true,
  default: false,
})
const searchQuery = ref('')
const { createDirectChat } = useCreateDirectChatUseCase()
const debouncedSearchQuery = useDebounce(searchQuery)
const { users, loading } = useUsersSearch(debouncedSearchQuery)
</script>

<template>
  <BaseDrawer header="New chat" v-model:isVisible="isVisible" height="full-height">
    <section class="search-form">
      <BaseInput v-model="searchQuery" placeholder="Enter login, name or surname" autofocus />
      <BaseStub
        v-if="!loading && users.length === 0"
        class="stub"
        :title="debouncedSearchQuery ? 'No users found with this text' : 'No users found yet'"
        :description="
          debouncedSearchQuery ? 'Try typing name or surname' : 'Start typing to find new users'
        "
      />
      <BaseSpinner v-if="loading" />
      <ul class="users-list" v-if="users.length > 0 && !loading">
        <li class="user-element" v-for="user in users" v-bind:key="user.id">
          <button
            class="blank-button user-button"
            @click="() => createDirectChat({ userId: user.id })"
            v-ripple
          >
            <UserRow
              :title="getUserFullname(user)"
              :avatar-url="user.avatarUrl"
              :avatar-size="40"
            />
          </button>
        </li>
      </ul>
    </section>
  </BaseDrawer>
</template>

<style lang="css" scoped>
.search-form {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 100%;
}

.stub {
  flex-grow: 1;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
}

.user-element {
  border-radius: 8px;
  padding: 8px 4px;
  cursor: pointer;
  transition: background-color 0.15s ease-out;

  &:hover {
    background-color: var(--p-highlight-background);
  }
}

.user-button {
  width: 100%;
}
</style>
