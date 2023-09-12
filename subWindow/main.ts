import { createApp } from 'vue'
import App from './app.vue'
const app = createApp(App)
app.mount('#sub')
.$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})
