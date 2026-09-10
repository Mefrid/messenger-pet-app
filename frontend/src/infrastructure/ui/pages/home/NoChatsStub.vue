<script setup lang="ts">
import BaseButton from '@/infrastructure/shared/ui/components/BaseButton.vue'
import BaseStub from '@/infrastructure/shared/ui/components/BaseStub.vue'

const emit = defineEmits(['onButtonClick'])
</script>

<template>
  <BaseStub title="No chats yet" description="Find user and start chat" icon-name="user-group">
    <BaseButton size="large" @click.prevent="() => emit('onButtonClick', [])">
      Find user
    </BaseButton>
  </BaseStub>
</template>
