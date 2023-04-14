import { setupAntd } from "./ant-design-vue"
import { App } from 'vue'
export const setupPlugins = (app: App) => {
  setupAntd(app)
}