import { createApp } from 'vue'
import App from './launch/App.vue'
import router from './launch/router'
import './style.css'
import './launch.css'
import './launch-fixes.css'

const app = createApp(App)

app.directive('reveal', {
  mounted(el) {
    el.classList.add('reveal')
  },
})

app.use(router).mount('#app')
