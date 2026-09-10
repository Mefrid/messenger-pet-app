<script setup lang="ts">
import type { ChatDetailed } from '@/domain/chat.ts'
import UserRow from '../userRow/UserRow.vue'
import { computed } from 'vue'
import { getUserFullname, type IUser } from '@/domain/user.ts'
import { displayRelativeTime } from '@/infrastructure/shared/utils/date.ts'
import type { IChatMessage } from '@/domain/chatMessage.ts'
import { createTypingMessage } from '@/infrastructure/shared/utils/createTypingMessage.ts'

const { chat, currentUserId, lastMessage, typingUsers } = defineProps<{
  chat: ChatDetailed
  typingUsers: Array<IUser['id']>
  lastMessage?: IChatMessage
  currentUserId: IUser['id']
}>()
const onlyParticipant = computed(() =>
  chat.type === 'direct' ? chat.participants.find((user) => user.id !== currentUserId) : undefined,
)
const title = computed(() =>
  onlyParticipant.value ? getUserFullname(onlyParticipant.value) : 'Group chat',
)

const typingMessage = computed(() => createTypingMessage(typingUsers, chat.participants))

const subtitle = computed(() => {
  if (typingMessage.value) {
    return typingMessage.value
  }
  if (lastMessage) {
    return lastMessage.senderId === currentUserId
      ? `You: ${lastMessage.textContent}`
      : lastMessage.textContent
  }
  return ''
})
</script>

<template>
  <UserRow
    :title="title"
    :subtitle="subtitle"
    :avatar-url="onlyParticipant?.avatarUrl!"
    :avatar-size="54"
    :online="onlyParticipant?.online"
  >
    <template #endContent v-if="lastMessage">
      <span class="time">{{ displayRelativeTime(lastMessage.timestamp) }}</span>
    </template>
  </UserRow>
</template>

<style scoped lang="css">
.time {
  display: block;
  font-size: 11px;
  margin-top: 8px;
  color: var(--p-text-muted-color);
}
</style>
