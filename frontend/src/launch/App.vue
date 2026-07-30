<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { siteInfo } from '../data/content'

const scrolled = ref(false)
const menuOpen = ref(false)
const route = useRoute()
const editorUrl = `${import.meta.env.BASE_URL}editor/index.html`
const onScroll = () => { scrolled.value = window.scrollY > 8 }

watch(() => route.fullPath, () => { menuOpen.value = false })

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <a class="skip-link" href="#main-content">跳到主要内容</a>

  <header class="nav" :class="{ scrolled, 'menu-open': menuOpen }">
    <div class="container nav-inner">
      <router-link to="/" class="brand" aria-label="Make It Visible 首页">
        <span class="dot" aria-hidden="true"></span>
        <span class="brand-copy">
          <strong>{{ siteInfo.name }}</strong>
          <small>{{ siteInfo.chineseName }}</small>
        </span>
      </router-link>

      <button
        class="nav-toggle"
        :class="{ active: menuOpen }"
        @click="menuOpen = !menuOpen"
        aria-label="打开或关闭菜单"
        :aria-expanded="menuOpen"
      >
        <span></span><span></span><span></span>
      </button>

      <nav class="nav-links" :class="{ open: menuOpen }" aria-label="主要导航">
        <router-link to="/">首页</router-link>
        <router-link to="/services">功能</router-link>
        <router-link to="/showcases">案例</router-link>
        <router-link to="/contact">反馈</router-link>
        <a :href="editorUrl" class="nav-cta">开始创作</a>
      </nav>
    </div>
  </header>

  <main id="main-content">
    <router-view />
  </main>

  <footer class="footer launch-footer">
    <div class="container footer-grid">
      <div>
        <div class="brand footer-brand"><span class="dot"></span>{{ siteInfo.name }}</div>
        <p>{{ siteInfo.slogan }}把心里的画面，做成每天都看得见的样子。</p>
      </div>
      <div class="footer-links">
        <router-link to="/privacy">隐私说明</router-link>
        <router-link to="/contact">反馈与联系</router-link>
        <a href="https://github.com/Yiiyaaa/make-it-visible" target="_blank" rel="noreferrer">GitHub</a>
      </div>
      <div class="footer-note">
        <span>无需注册 · 图片不上传</span>
        <span>© 2026 Yveline</span>
      </div>
    </div>
  </footer>
</template>
