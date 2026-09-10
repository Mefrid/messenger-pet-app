<script setup lang="ts">
import { getUserFullname } from '@/domain/user'
import { ROUTE_NAMES } from '@/application/ports/router'
import AvatarPhoto from '@/infrastructure/shared/ui/components/AvatarPhoto.vue'
import BaseButton from '@/infrastructure/shared/ui/components/BaseButton.vue'
import BaseIcon from '@/infrastructure/shared/ui/components/BaseIcon.vue'
import BasePage from '@/infrastructure/shared/ui/components/BasePage.vue'
import { useCurrentUser } from '@/infrastructure/storages/useCurrentUser'
import { useLogoutUseCase } from '@/infrastructure/adapters/useCases/useLogoutUseCase'

const userStore = useCurrentUser()
const fullName = getUserFullname(userStore.currentUser!)
const { loading, logout } = useLogoutUseCase()
</script>

<template>
  <BasePage>
    <RouterLink :to="{ name: ROUTE_NAMES.HOME }">
      <BaseIcon :icon-name="'arrow-left'" :size="32" />
    </RouterLink>
    <div class="profile">
      <AvatarPhoto
        :avatar-url="userStore.currentUser?.avatarUrl!"
        :user-name="fullName"
        :size="64"
      />
      <p class="user-name">{{ fullName }}</p>
    </div>
    <ul class="actions">
      <li>
        <BaseButton
          class="action"
          :severity="'danger'"
          :loading="loading"
          :variant="'outlined'"
          @click="logout"
        >
          Log out
        </BaseButton>
      </li>
    </ul>
  </BasePage>
</template>

<style lang="css" scoped>
.profile {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.user-name {
  font-size: 24px;
}

.actions {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
}

.action {
  width: 100%;
}
</style>
