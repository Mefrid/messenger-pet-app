<script setup lang="ts">
import { InputText } from 'primevue'

const textValue = defineModel<string>({ required: true })
const {
  type = 'text',
  autocomplete,
  placeholder,
  disabled,
  autofocus,
  rounded,
} = defineProps<{
  type?: 'text' | 'password'
  placeholder?: string
  autocomplete?: string
  disabled?: boolean
  autofocus?: boolean
  rounded?: boolean
}>()
</script>

<template>
  <InputText
    :pt="{ root: ['base', rounded ? 'rounded-input' : ''] }"
    v-model="textValue"
    :type="type"
    :autocomplete="autocomplete"
    :placeholder="placeholder"
    :disabled="disabled"
    :autofocus="autofocus"
  />
</template>

<style lang="css" scoped>
.base {
  font-size: 16px;
}

.rounded-input {
  border-radius: 50px !important;
  padding-inline: 0.9rem !important;
}
</style>
