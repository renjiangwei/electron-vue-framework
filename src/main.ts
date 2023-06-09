import { createApp } from 'vue'
import App from './App.vue'
import './utils/node-api'
import './styles/index.less'
import { setupPlugins } from './plugins'
import { setupStore } from './store'
import { router } from './router'
const app = createApp(App)
setupPlugins(app)
setupStore(app)
app.use(router)
app.mount('#app')
.$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})
