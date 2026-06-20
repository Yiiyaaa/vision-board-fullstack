import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)

// Entrance animation via pure CSS (.reveal plays a fade-up that ENDS visible),
// so content is never stuck hidden even if JS/observers misbehave. The directive
// just tags the element; all timing lives in CSS.
app.directive('reveal', {
  mounted(el) {
    el.classList.add('reveal')
  },
})

app.use(router).mount('#app')

