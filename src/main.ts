import 'normalize.css'
import { createApp } from 'vue'
import './assets/css/index.less'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import pinia from './store'
import VChart from 'vue-echarts'
import './utils/echarts-setup' // 引入按需配置

// 全局注册 VChart 组件
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('VChart', VChart)
app.use(router)
app.use(pinia)
app.mount('#app')
