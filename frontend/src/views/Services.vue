<script setup>
import { ref, onMounted } from 'vue'
import { getServices } from '../api'

const cats = ref([])
const loading = ref(true)

onMounted(async () => {
  try { cats.value = await getServices() } catch (e) { /* offline-safe */ }
  loading.value = false
})
</script>

<template>
  <section class="section container">
    <div class="eyebrow" v-reveal>功能</div>
    <h2 v-reveal class="d1">自动拼贴、文字贴纸、高清导出、……</h2>
    <p class="lead d1" v-reveal>其他想要的功能,欢迎联系告诉我</p>

    <div v-if="loading" class="loading">加载中…</div>
    <template v-else>
      <div v-for="cat in cats" :key="cat.id" style="margin-bottom:54px">
        <h3 v-reveal style="font-family:var(--serif);font-weight:500;font-size:24px;margin-bottom:20px;color:var(--rose-deep)">{{ cat.name }}</h3>
        <div class="grid cols-3">
          <div v-for="(s, i) in cat.services" :key="s.id" class="card" v-reveal :class="'d' + (i % 3)">
            <div class="icon">{{ s.icon }}</div>
            <h3>{{ s.title }}</h3>
            <p style="margin-bottom:8px"><strong>{{ s.summary }}</strong></p>
            <p>{{ s.description }}</p>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>
