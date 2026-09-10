<script setup lang="ts">
import { displayRelativeTime } from '@/infrastructure/shared/utils/date'

const { textContent, sendTimestamp, sentByMe } = defineProps<{
  textContent: string
  sendTimestamp: Date
  senderName?: string
  sentByMe?: boolean
}>()
</script>

<template>
  <p
    :class="{ message: true, 'sent-by-me': sentByMe }"
    :data-time="displayRelativeTime(sendTimestamp)"
  >
    {{ textContent }}
  </p>
</template>

<style lang="css" scoped>
.message {
  padding: 12px 16px;
  background-color: var(--p-surface-800);
  color: var(--p-content-color);
  border-radius: 24px 32px 32px 0px;
  max-width: 80%;
  width: fit-content;
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;

  &::after {
    font-size: 11px;
    color: var(--p-text-muted-color);
    padding-left: 6px;
    content: attr(data-time);
    translate: 0 50%;
    margin-left: auto;
  }
}

.sent-by-me {
  background-color: var(--p-primary-800);
  border-radius: 32px 24px 0px 32px;
  justify-self: flex-end;
  margin-left: auto;
}
</style>
