import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './views/Home.vue'
import Services from './views/Services.vue'
import Showcases from './views/Showcases.vue'
import Contact from './views/Contact.vue'
import Privacy from './views/Privacy.vue'

const routes = [
  { path: '/', name: 'home', component: Home, meta: { title: '在线愿景板' } },
  { path: '/services', name: 'services', component: Services, meta: { title: '功能' } },
  { path: '/showcases', name: 'showcases', component: Showcases, meta: { title: '案例' } },
  { path: '/contact', name: 'contact', component: Contact, meta: { title: '反馈与联系' } },
  { path: '/privacy', name: 'privacy', component: Privacy, meta: { title: '隐私说明' } },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  document.title = `${to.meta.title ? `${to.meta.title} · ` : ''}Make It Visible`
})

export default router
