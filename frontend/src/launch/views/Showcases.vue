<script setup>
import { showcases } from '../../data/content'

const editorUrl = `${import.meta.env.BASE_URL}editor/index.html`
</script>

<template>
  <section class="section container page-intro">
    <div class="eyebrow" v-reveal>Six ways to begin</div>
    <h2 v-reveal class="d1">这里没有标准答案。</h2>
    <p class="lead d1" v-reveal>同一块画布，可以装下目的地、日常、关系，也可以装下一种还没有名字的期待。</p>

    <div class="showcase-grid showcase-grid-all">
      <article v-for="(item, index) in showcases" :key="item.id" class="showcase-card" v-reveal :class="`d${index % 3}`">
        <div class="showcase-image" :style="{ backgroundPosition: item.position }" role="img" :aria-label="item.title"></div>
        <div class="showcase-copy">
          <span class="case-number">{{ String(index + 1).padStart(2, '0') }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <div><span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span></div>
        </div>
      </article>
    </div>

    <div class="page-cta" v-reveal>
      <p>从你最喜欢的三张照片开始就够了。</p>
      <a :href="editorUrl" class="btn btn-primary btn-large">创建我的愿景板 <span class="arrow">→</span></a>
    </div>
  </section>
</template>
