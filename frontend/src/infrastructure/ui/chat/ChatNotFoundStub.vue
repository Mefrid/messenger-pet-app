<script setup lang="ts">
import { ROUTE_NAMES } from '@/application/ports/router'
import BaseButton from '@/infrastructure/shared/ui/components/BaseButton.vue'
import BaseStub from '@/infrastructure/shared/ui/components/BaseStub.vue'
</script>

<template>
  <BaseStub title="Oops, can't find that chat" description="It seems that chat doesn't exist">
    <RouterLink :to="{ name: ROUTE_NAMES.HOME }">
      <BaseButton size="large">Return to chats</BaseButton>
    </RouterLink>
  </BaseStub>
</template>
