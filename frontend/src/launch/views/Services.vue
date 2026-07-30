<script setup>
import { serviceCategories } from '../../data/content'

const editorUrl = `${import.meta.env.BASE_URL}editor/index.html`
</script>

<template>
  <section class="section container page-intro">
    <div class="eyebrow" v-reveal>Tools that stay out of the way</div>
    <h2 v-reveal class="d1">从几张照片，<br />到一张真正想留下的画面。</h2>
    <p class="lead d1" v-reveal>功能够用，但不过度。每一步都围绕“更快看见自己的想法”。</p>

    <div v-for="category in serviceCategories" :key="category.id" class="service-group">
      <div class="service-group-title" v-reveal>
        <span>0{{ category.id }}</span>
        <h3>{{ category.name }}</h3>
      </div>
      <div class="service-cards">
        <article v-for="service in category.services" :key="service.id" class="service-card" v-reveal>
          <div class="service-symbol">{{ service.icon }}</div>
          <h3>{{ service.title }}</h3>
          <strong>{{ service.summary }}</strong>
          <p>{{ service.description }}</p>
        </article>
      </div>
    </div>

    <div class="page-cta" v-reveal>
      <p>最好的介绍，是亲手做一次。</p>
      <a :href="editorUrl" class="btn btn-primary btn-large">开始创作 <span class="arrow">→</span></a>
    </div>
  </section>
</template>
