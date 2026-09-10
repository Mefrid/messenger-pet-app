import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Ripple from 'primevue/ripple'

import App from './App.vue'
import router from './router.ts'
import diContainer from './diContainer.ts'
import { AppPreset } from './primeVuePreset.ts'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: AppPreset,
  },
  ripple: true,
  license: import.meta.env.VITE_PRIME_UI_KEY,
})
diContainer.inject(app)

app.directive('ripple', Ripple)

app.mount('#app')
