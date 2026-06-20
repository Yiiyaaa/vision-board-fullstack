<script setup>
import { ref, onMounted, computed } from 'vue'
import { getServices, getShowcases } from '../api'

const cats = ref([])
const featured = ref([])
const loading = ref(true)
// the static fullscreen vision-board editor (bundled under public/editor/)
const editorUrl = '/editor/index.html'

const topServices = computed(() => {
  const all = []
  cats.value.forEach((c) => c.services.forEach((s) => all.push(s)))
  return all.slice(0, 6)
})

const grads = [
  'linear-gradient(135deg,#edcbcf,#d9d3ea)',
  'linear-gradient(135deg,#f0dfc4,#edcbcf)',
  'linear-gradient(135deg,#d9d3ea,#b7a8b9)',
  'linear-gradient(135deg,#f7e1d7,#d9d3ea)',
]

onMounted(async () => {
  try {
    cats.value = await getServices()
    featured.value = await getShowcases(true)
  } catch (e) { /* offline-safe */ }
  loading.value = false
})
</script>

<template>
  <!-- ① Hero -->
  <section class="hero">
    <div class="hero-glow"></div>
    <div class="container">
      <div class="eyebrow reveal">在线愿景板工具</div>
      <h1 v-reveal class="d1">你有奇思妙想,<br />我有<em>自由画布</em>。</h1>
      <p v-reveal class="d2">拼贴照片、排版文字、一键导出高清壁纸。</p>
      <div class="cta-row reveal d3">
        <a :href="editorUrl" class="btn btn-primary">开始创作 <span class="arrow">→</span></a>
        <router-link to="/showcases" class="btn">看看案例</router-link>
      </div>
    </div>
  </section>

  <!-- ② 案例预览 · 单标题,直接展示案例 -->
  <section class="section container" v-if="featured.length">
    <h2 v-reveal class="d1">看看不同的创作</h2>
    <div class="grid cols-3" style="margin-top:8px">
      <div v-for="(w, i) in featured" :key="w.id" class="card" style="padding:0;overflow:hidden" v-reveal :class="'d' + (i % 3)">
        <div class="cover" :style="{ height: '156px', background: grads[i % grads.length] }"></div>
        <div style="padding:22px">
          <h3>{{ w.title }}</h3>
          <p>{{ w.description }}</p>
          <div><span v-for="t in w.tags" :key="t" class="tag">{{ t }}</span></div>
        </div>
      </div>
    </div>
    <p class="section-link" v-reveal><router-link to="/showcases" class="btn">查看全部案例 <span class="arrow">→</span></router-link></p>
  </section>

  <!-- ③ 功能预览 · 功能一览 + 贴纸卡片 -->
  <section class="section container">
    <h2 v-reveal class="d1">功能一览</h2>
    <p class="lead d1" v-reveal>其他想要的功能,欢迎联系告诉我</p>
    <div v-if="loading" class="loading">加载中…</div>
    <div v-else class="grid cols-3">
      <div v-for="(s, i) in topServices" :key="s.id" class="card" v-reveal :class="'d' + (i % 3)">
        <div class="icon">{{ s.icon }}</div>
        <h3>{{ s.title }}</h3>
        <p>{{ s.summary }}</p>
      </div>
    </div>
    <p class="section-link" v-reveal><router-link to="/services" class="btn">查看全部功能 <span class="arrow">→</span></router-link></p>
  </section>

  <!-- ④ Make It Visible · 最终 CTA(无内嵌编辑器,直接跳全屏编辑器) -->
  <section class="container" style="margin-top:8px;margin-bottom:64px">
    <div class="final-cta" v-reveal>
      <div class="fc-glow" aria-hidden="true"></div>
      <div class="eyebrow" style="display:inline-block">MAKE IT VISIBLE</div>
      <h2 class="fc-title"><em>Make It Visible</em></h2>
      <p class="fc-sub">先看见,再靠近。把心里的愿景,拼成每天都看得见的样子。</p>
      <a :href="editorUrl" class="btn btn-primary">开始创作 <span class="arrow">→</span></a>
    </div>
  </section>
</template>
