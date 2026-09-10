<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseInput from '@/infrastructure/shared/ui/components/BaseInput.vue'
import BaseButton from '@/infrastructure/shared/ui/components/BaseButton.vue'
import { useLoginUseCase } from '@/infrastructure/adapters/useCases/useLoginUseCase'

const form = ref({
  login: '',
  password: '',
})

const { loading, error, clearError, login } = useLoginUseCase(form)
const errorText = computed(() => error.value?.message)

watch([() => form.value.login, () => form.value.password], () => {
  clearError()
})
</script>

<template>
  <section>
    <Transition name="fade-slide" appear>
      <form @submit.prevent="login">
        <h1>Sign in</h1>
        <BaseInput
          v-model="form.login"
          placeholder="Login"
          type="text"
          :disabled="loading"
          autocomplete="username"
        />
        <BaseInput
          v-model="form.password"
          placeholder="Password"
          type="password"
          :disabled="loading"
          autocomplete="current-password"
        />
        <span style="color: red" v-if="errorText">
          {{ errorText }}
        </span>
        <BaseButton class="submit-button" type="submit">Submit</BaseButton>
      </form>
    </Transition>
  </section>
</template>

<style lang="css" scoped>
section {
  display: flex;
  justify-content: center;
  min-height: 100dvh;
  width: 100%;
}

form {
  margin-block: 20dvh;
  padding-inline: 24px;
  width: min(100%, 400px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  align-items: stretch;
  height: max-content;
  padding-block: 24px;
}

h1 {
  margin-block: 0 24px;
  text-align: center;
}

.submit-button {
  margin-top: 16px;
}

.fade-slide-enter-from {
  opacity: 0.2;
  transform: translateY(70px);
}

.fade-slide-enter-active {
  transition: all 0.3s ease-out;
}

@media (--mobile-breakpoint) {
  form {
    border: 1px solid var(--p-surface-700);
    border-radius: 16px;
    padding: 24px 24px;
  }
}
</style>
