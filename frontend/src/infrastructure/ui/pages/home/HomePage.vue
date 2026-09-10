<script setup lang="ts">
import NoChatsStub from './NoChatsStub.vue'
import UsersSearch from '../../usersSearch/UsersSearch.vue'
import { onMounted, ref } from 'vue'
import BasePage from '@/infrastructure/shared/ui/components/BasePage.vue'
import { ROUTE_NAMES } from '@/application/ports/router.ts'
import BaseSpinner from '@/infrastructure/shared/ui/components/BaseSpinner.vue'
import ChatRow from '../../chat/ChatRow.vue'
import { useCurrentUser } from '@/infrastructure/storages/useCurrentUser.ts'
import { useChatsStore } from '@/infrastructure/storages/useChatsStore.ts'
import HomeActions from './HomeActions.vue'
import { useChatsRepository } from '@/infrastructure/shared/diComposables.ts'

const currentUserStore = useCurrentUser()
const chatsStore = useChatsStore()
const chatsRepository = useChatsRepository()
const userSearchIsVisible = ref(false)

onMounted(() => {
  chatsStore.fetchChats(chatsRepository)
})

const openUsersSearch = () => (userSearchIsVisible.value = true)
</script>

<template>
  <BasePage>
    <BaseSpinner v-if="!chatsStore.isInitialized" />

    <HomeActions
      v-if="chatsStore.isInitialized"
      :search-is-visible="!chatsStore.isEmpty"
      @search-click="openUsersSearch"
    />

    <NoChatsStub v-if="chatsStore.isEmpty" class="stub" @on-button-click="openUsersSearch" />

    <ul v-else class="chats">
      <li v-for="chat in chatsStore.chatsWithLastMessage" :key="chat.id">
        <RouterLink :to="{ name: ROUTE_NAMES.CHAT, params: { id: chat.id } }">
          <ChatRow
            :chat="chat"
            :typing-users="chatsStore.chatsTyping[chat.id] ?? []"
            :last-message="chat.lastMessage"
            :current-user-id="currentUserStore.currentUser?.id!"
          />
        </RouterLink>
      </li>
    </ul>

    <UsersSearch v-model:is-visible="userSearchIsVisible" />
  </BasePage>
</template>

<style lang="css" scoped>
.chats {
  display: flex;
  flex-direction: column;
  gap: 28px;
  margin-top: 16px;
}
</style>
