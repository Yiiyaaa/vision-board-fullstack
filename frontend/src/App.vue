<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getSiteInfo } from './api'

const site = ref({ name: '愿景板工作室', email: '', phone: '', address: '' })
const scrolled = ref(false)
const menuOpen = ref(false)
const route = useRoute()
// the static fullscreen vision-board editor (bundled under public/editor/)
const editorUrl = '/editor/index.html'
const onScroll = () => { scrolled.value = window.scrollY > 8 }

// close the mobile menu whenever the route changes
watch(() => route.fullPath, () => { menuOpen.value = false })

onMounted(async () => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  try { const d = await getSiteInfo(); if (d && d.name) site.value = d } catch (e) { /* offline-safe */ }
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="nav" :class="{ scrolled, 'menu-open': menuOpen }">
    <div class="container nav-inner">
      <router-link to="/" class="brand"><span class="dot"></span>{{ site.name }}</router-link>
      <button class="nav-toggle" :class="{ active: menuOpen }" @click="menuOpen = !menuOpen"
              aria-label="菜单" :aria-expanded="menuOpen">
        <span></span><span></span><span></span>
      </button>
      <nav class="nav-links" :class="{ open: menuOpen }">
        <router-link to="/">首页</router-link>
        <router-link to="/services">功能</router-link>
        <router-link to="/showcases">案例</router-link>
        <router-link to="/contact">反馈与联系</router-link>
        <a :href="editorUrl" class="nav-cta">开始创作</a>
      </nav>
    </div>
  </header>

  <main>
    <router-view />
  </main>

  <footer class="footer">
    <div class="container f-grid">
      <div>
        <div class="brand" style="margin-bottom:8px"><span class="dot"></span>Vision Board Studio</div>
        <div class="muted">Ideas into Form</div>
      </div>
      <div class="muted">
        <div v-if="site.email">邮箱:{{ site.email }}</div>
        <div v-if="site.phone">电话:{{ site.phone }}</div>
        <div v-if="site.address">{{ site.address }}</div>
        <div style="margin-top:8px">© 2026 Yveline</div>
      </div>
    </div>
  </footer>
</template>
