<script setup lang="ts">
import { ROUTE_NAMES } from '@/application/ports/router'
import BaseSpinner from '@/infrastructure/shared/ui/components/BaseSpinner.vue'
import { useCurrentUser } from '@/infrastructure/storages/useCurrentUser'
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const MIN_TIME_TO_DISPLAY = 400

const user = useCurrentUser()
const route = useRoute()
const isAuthInfoLoading = computed(() => !user.isAuthenticated && route.name != ROUTE_NAMES.LOGIN)
const isVisible = ref(false)

watchEffect(() => {
  if (isAuthInfoLoading.value) {
    isVisible.value = true
    user.fetchUser()
  } else {
    setTimeout(() => {
      isVisible.value = false
    }, MIN_TIME_TO_DISPLAY)
  }
})
</script>

<template>
  <BaseSpinner v-if="isVisible" />
  <slot v-else />
</template>
