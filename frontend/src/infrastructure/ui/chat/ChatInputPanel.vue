<script setup lang="ts">
import BaseButton from '@/infrastructure/shared/ui/components/BaseButton.vue'
import BaseIcon from '@/infrastructure/shared/ui/components/BaseIcon.vue'
import BaseInput from '@/infrastructure/shared/ui/components/BaseInput.vue'
import { onUnmounted, ref } from 'vue'

const TYPING_TIMEOUT = 3000

const emit = defineEmits<{
  (e: 'sendMessage', value: string): void
  (e: 'startTyping'): void
  (e: 'stopTyping'): void
}>()

const message = ref('')
const isTyping = ref(false)
const stopTypingTimeout = ref<number | undefined>()

onUnmounted(() => {
  if (stopTypingTimeout.value) {
    clearTimeout(stopTypingTimeout.value)
  }
  emit('stopTyping')
})

const handleInputChange = () => {
  if (!isTyping.value) {
    isTyping.value = true
    emit('startTyping')
  }
  if (stopTypingTimeout.value) {
    clearTimeout(stopTypingTimeout.value)
  }
  stopTypingTimeout.value = setTimeout(() => {
    emit('stopTyping')
    isTyping.value = false
    stopTypingTimeout.value = undefined
  }, TYPING_TIMEOUT)
}

const handleMessageSubmit = () => {
  emit('stopTyping')
  emit('sendMessage', message.value)
  message.value = ''
}

const handleSubmitClick = (event: MouseEvent) => {
  event.preventDefault()
  handleMessageSubmit()
}
</script>

<template>
  <form class="input-panel" @submit.prevent="handleMessageSubmit">
    <BaseInput
      class="message-input"
      :placeholder="'Message'"
      rounded
      v-model="message"
      @keydown="handleInputChange"
    />
    <BaseButton
      size="large"
      rounded
      icon-only
      :disabled="!message"
      type="submit"
      @mousedown="handleSubmitClick"
    >
      <BaseIcon :icon-name="'send'" />
    </BaseButton>
  </form>
</template>

<style lang="css" scoped>
.message-input {
  flex-grow: 1;
}

.input-panel {
  display: flex;
  gap: 8px;
  padding-inline: var(--page-padding-x);
  padding-bottom: var(--page-padding-bottom);
  position: sticky;
  bottom: 0;
  margin-top: 34px;
}
</style>
