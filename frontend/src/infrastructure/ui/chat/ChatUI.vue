<script setup lang="ts">
import UserRow from '../userRow/UserRow.vue'
import { getUserFullname } from '@/domain/user'
import type { ChatDetailed } from '@/domain/chat.ts'
import { computed, onMounted, watch } from 'vue'
import { ROUTE_NAMES } from '@/application/ports/router.ts'
import ChatMessageRow from './ChatMessageRow.vue'
import ChatInputPanel from './ChatInputPanel.vue'
import ChatNoMessagesStub from './ChatNoMessagesStub.vue'
import { useCurrentUser } from '@/infrastructure/storages/useCurrentUser.ts'
import type { ChatMessagesGroupedByDate } from '@/infrastructure/storages/useChatMessagesStore.ts'
import { displayRelativeDate } from '@/infrastructure/shared/utils/date.ts'
import { wsc } from '@/infrastructure/api/webSocketClient.ts'
import { WebSocketOutgoingType } from '@/application/ports/webSocketClient.ts'
import { createTypingMessage } from '@/infrastructure/shared/utils/createTypingMessage.ts'

const { chat, messageGroups, chatTypings } = defineProps<{
  chat: ChatDetailed
  chatTypings: string[]
  messageGroups: ChatMessagesGroupedByDate
}>()

const emit = defineEmits<{
  (e: 'sendMessage', value: string): void
}>()

const scrollToLastMessage = () => {
  setTimeout(() => document.getElementById('chat-end-anchor')?.scrollIntoView(), 0)
}

const isScrolledToBottom = () => {
  const totalPageHeight = document.documentElement.scrollHeight
  const currentScrollPosition = window.innerHeight + window.scrollY
  return currentScrollPosition >= totalPageHeight
}

watch(
  () => messageGroups,
  () => {
    if (isScrolledToBottom()) {
      scrollToLastMessage()
    }
  },
)

onMounted(() => {
  console.log(document.getElementById('chat-end-anchor'))
  scrollToLastMessage()
})

const currentUserStore = useCurrentUser()
const isDirectChat = computed(() => chat.type === 'direct')
const onlyParticipant = computed(() =>
  isDirectChat.value
    ? chat.participants.find((user) => user.id !== currentUserStore.currentUser?.id)
    : undefined,
)
const noMessages = computed(() => messageGroups.size === 0)
const usersTyping = computed(() => createTypingMessage(chatTypings, chat.participants))
const subtitle = computed(() => (onlyParticipant.value?.online ? 'Online now' : 'Offline'))

const handleMessageSent = (textContent: string) => {
  emit('sendMessage', textContent)
  scrollToLastMessage()
}

const handleStartTyping = () => {
  wsc.sendMessage(WebSocketOutgoingType.StartTyping, { chatId: chat.id })
}

const handleStopTyping = () => {
  wsc.sendMessage(WebSocketOutgoingType.StoppedTyping, { chatId: chat.id })
}
</script>

<template>
  <section class="chat">
    <UserRow
      v-if="isDirectChat && onlyParticipant"
      :title="getUserFullname(onlyParticipant)"
      :subtitle="subtitle"
      :back-route-name="ROUTE_NAMES.HOME"
      :avatar-url="onlyParticipant.avatarUrl"
      :avatar-size="46"
      :online="onlyParticipant.online"
      sticky
    />
    <ChatNoMessagesStub v-if="noMessages" />
    <TransitionGroup v-else class="message-groups" name="list" tag="ul">
      <li
        v-for="[messagesDate, messages] in messageGroups.entries()"
        :key="messagesDate"
        class="message-group"
      >
        <span class="date">{{ displayRelativeDate(new Date(messagesDate)) }}</span>
        <TransitionGroup class="messages" name="list" tag="ul">
          <li v-for="message in messages" class="message" :key="message.id">
            <ChatMessageRow
              :text-content="message.textContent"
              :send-timestamp="message.timestamp"
              :sent-by-me="message.senderId === currentUserStore.currentUser?.id"
            />
          </li>
        </TransitionGroup>
      </li>
    </TransitionGroup>
    <div class="chat-end-elements">
      <div id="chat-end-anchor"></div>
      <span v-if="usersTyping" class="typing-indicator">
        {{ usersTyping }}
      </span>
    </div>
    <ChatInputPanel
      @send-message="handleMessageSent"
      @start-typing="handleStartTyping"
      @stop-typing="handleStopTyping"
    />
  </section>
</template>

<style lang="css" scoped>
.chat {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.chat-end-elements {
  position: relative;
  padding-inline: var(--page-padding-x);
  margin-top: 4px;
}

.message-groups {
  overflow: hidden;
  padding-inline: var(--page-padding-x);
  flex: 1;
  align-content: flex-end;
  margin-top: 34px;
}

.message-group {
  & + & {
    margin-top: 24px;
  }
}

.date {
  font-size: 12px;
  text-align: center;
  display: block;
  width: 100%;
  margin-bottom: 16px;
}

#chat-end-anchor {
  position: absolute;
  bottom: 0;
  height: 1px;
}

.message + .message {
  margin-top: 16px;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.list-leave-active {
  position: absolute;
  width: calc(100% - 8px);
}

.typing-indicator {
  font-size: 12px;
  color: var(--p-text-muted-color);
  position: absolute;
  bottom: 0;
  translate: 0 calc(100% + 8px);

  &::after {
    content: '';
    animation: typing 1.5s steps(4, end) infinite;
  }
}

@keyframes typing {
  0% {
    content: '';
  }
  25% {
    content: '.';
  }
  50% {
    content: '..';
  }
  75% {
    content: '...';
  }
}
</style>
