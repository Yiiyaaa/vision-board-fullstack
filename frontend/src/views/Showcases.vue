<script setup>
import { ref, onMounted } from 'vue'
import { getShowcases } from '../api'

const items = ref([])
const loading = ref(true)
const grads = [
  'linear-gradient(135deg,#edcbcf,#d9d3ea)',
  'linear-gradient(135deg,#f0dfc4,#edcbcf)',
  'linear-gradient(135deg,#d9d3ea,#b7a8b9)',
  'linear-gradient(135deg,#f7e1d7,#d9d3ea)',
  'linear-gradient(135deg,#e3dff0,#f0dfc4)',
  'linear-gradient(135deg,#f5d7e0,#cdbfe6)',
]

onMounted(async () => {
  try { items.value = await getShowcases(false) } catch (e) { /* offline-safe */ }
  loading.value = false
})
</script>

<template>
  <section class="section container">
    <div class="eyebrow" v-reveal>案例</div>
    <h2 v-reveal class="d1">这里没有标准答案</h2>
    <p class="lead d1" v-reveal>浏览不同主题风格,从一张喜欢的案例开始你的创作吧</p>

    <div v-if="loading" class="loading">加载中…</div>
    <div v-else-if="!items.length" class="loading">暂无案例。</div>
    <div v-else class="grid cols-3">
      <div v-for="(w, i) in items" :key="w.id" class="card" style="padding:0;overflow:hidden" v-reveal :class="'d' + (i % 3)">
        <div class="cover" :style="{ height: '160px', background: grads[i % grads.length] }"></div>
        <div style="padding:22px">
          <h3>{{ w.title }}</h3>
          <p>{{ w.description }}</p>
          <div><span v-for="t in w.tags" :key="t" class="tag">{{ t }}</span></div>
        </div>
      </div>
    </div>
  </section>
</template>
