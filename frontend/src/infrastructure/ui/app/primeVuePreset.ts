import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

export const AppPreset = definePreset(Aura, {
  semantic: {
    text: {
      color: 'var(--p-stone-200)',
    },
    primary: {
      50: 'var(--p-blue-50)',
      100: 'var(--p-blue-100)',
      200: 'var(--p-blue-200)',
      300: 'var(--p-blue-300)',
      400: 'var(--p-blue-400)',
      500: 'var(--p-blue-500)',
      600: 'var(--p-blue-600)',
      700: 'var(--p-blue-700)',
      800: 'var(--p-blue-800)',
      900: 'var(--p-blue-900)',
      950: 'var(--p-blue-950)',
      contrastColor: 'light-dark({surface.500}, var(--p-stone-200))',
    },
  },
})
