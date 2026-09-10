<script setup lang="ts">
import { ROUTE_NAMES } from '@/application/ports/router'
import BaseButton from '@/infrastructure/shared/ui/components/BaseButton.vue'
import BaseIcon from '@/infrastructure/shared/ui/components/BaseIcon.vue'

const { searchIsVisible } = defineProps<{
  searchIsVisible: boolean
}>()

const emit = defineEmits<{
  (e: 'searchClick'): void
}>()
</script>

<template>
  <ul class="actions">
    <li v-if="searchIsVisible">
      <BaseButton
        :severity="'secondary'"
        icon-only
        :variant="'link'"
        @click="() => emit('searchClick')"
      >
        <BaseIcon :icon-name="'new-message'" :size="24" />
      </BaseButton>
    </li>
    <li>
      <RouterLink :to="{ name: ROUTE_NAMES.SETTINGS }">
        <BaseButton :severity="'secondary'" icon-only :variant="'link'">
          <BaseIcon :icon-name="'cog'" :size="24" />
        </BaseButton>
      </RouterLink>
    </li>
  </ul>
</template>

<style lang="css" scoped>
.actions {
  display: flex;
  justify-content: flex-end;
}
</style>
