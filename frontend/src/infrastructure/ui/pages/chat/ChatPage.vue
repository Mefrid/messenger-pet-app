<script setup lang="ts">
import BasePage from '@/infrastructure/shared/ui/components/BasePage.vue'
import ChatUI from '../../chat/ChatUI.vue'
import { useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import ChatNotFoundStub from '../../chat/ChatNotFoundStub.vue'
import BaseSpinner from '@/infrastructure/shared/ui/components/BaseSpinner.vue'
import { useChatsStore } from '@/infrastructure/storages/useChatsStore.ts'
import { useChatWithParticipants } from '@/infrastructure/shared/storeCombiners/useChatWithParticipants.ts'
import { useChatMessagesStore } from '@/infrastructure/storages/useChatMessagesStore.ts'
import { useSendChatMessageUseCase } from '@/infrastructure/adapters/useCases/useSendChatMessageUseCase.ts'
import { useCurrentUser } from '@/infrastructure/storages/useCurrentUser.ts'
import { useChatsRepository } from '@/infrastructure/shared/diComposables.ts'

const chatsStore = useChatsStore()
const chatMessagesStore = useChatMessagesStore()
const currentUserStore = useCurrentUser()
const chatsRepository = useChatsRepository()

const { params } = useRoute()
const chatId = ref(params['id'] as string)

const { sendChatMessage } = useSendChatMessageUseCase()
const chat = useChatWithParticipants(chatId.value, chatsStore)
const messageGroups = computed(() => chatMessagesStore.chatsWithGroupedMessages[chatId.value])
const messagesAreFetched = computed(() => chatMessagesStore.initializedChats.includes(chatId.value))
const chatTypings = computed(() => chatsStore.chatsTyping[chatId.value] ?? [])

onMounted(async () => {
  await chatMessagesStore.fetchMessagesForChat(chatId.value)
  await chatsStore.fetchChats(chatsRepository)
})

const handleSentChatMessage = (textContent: string) => {
  sendChatMessage({
    chatId: chatId.value,
    textContent,
    currentUserId: currentUserStore.currentUser?.id as string,
  })
}
</script>
<template>
  <BasePage no-padding>
    <BaseSpinner v-if="!chatsStore.isInitialized || !messageGroups || !messagesAreFetched" />
    <ChatNotFoundStub v-else-if="chatsStore.isInitialized && !chat" />
    <ChatUI
      v-else
      :chat="chat!"
      :chat-typings="chatTypings"
      :message-groups="messageGroups"
      @send-message="handleSentChatMessage"
    />
  </BasePage>
</template>
