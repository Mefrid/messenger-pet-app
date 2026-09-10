<script setup lang="ts">
import { Button, type ButtonProps } from 'primevue'

const props = defineProps<{
  variant?: 'outlined' | 'text' | 'link'
  size?: 'small' | 'large'
  severity?: 'secondary' | 'danger'
  raised?: boolean
  loading?: boolean
  rounded?: boolean
  iconOnly?: boolean
  disabled?: boolean
  type?: ButtonProps['type']
}>()
</script>

<template>
  <Button v-bind="props"><slot /></Button>
</template>
