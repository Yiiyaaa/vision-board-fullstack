<script setup>
import { showcases, serviceCategories } from '../../data/content'

const editorUrl = `${import.meta.env.BASE_URL}editor/index.html`
const featured = showcases.filter((item) => item.featured)
const topServices = serviceCategories.flatMap((category) => category.services).slice(0, 6)
</script>

<template>
  <section class="launch-hero">
    <div class="hero-orbit orbit-one" aria-hidden="true"></div>
    <div class="hero-orbit orbit-two" aria-hidden="true"></div>
    <div class="container launch-hero-grid">
      <div class="launch-hero-copy">
        <div class="eyebrow reveal">Private, playful, entirely yours</div>
        <h1 class="reveal d1">
          先看见，<br />
          再慢慢<em>靠近。</em>
        </h1>
        <p class="reveal d2">
          把照片、目标和一句想记住的话拼在一起，30 秒做成属于你的高清愿景板壁纸。
        </p>
        <div class="cta-row reveal d3">
          <a :href="editorUrl" class="btn btn-primary btn-large">免费开始创作 <span class="arrow">→</span></a>
          <router-link to="/showcases" class="btn btn-large">先看看成品</router-link>
        </div>
        <ul class="trust-list reveal d3" aria-label="产品特点">
          <li><span>✓</span>无需注册</li>
          <li><span>✓</span>图片不上传</li>
          <li><span>✓</span>PNG / JPG / WebP</li>
        </ul>
      </div>

      <div class="hero-art reveal d2" aria-label="六种愿景板创作示例">
        <div class="hero-sheet">
          <img src="/showcases/vision-board-grid.jpg" alt="旅行、阅读、健康、家居、创作与婚礼六种愿景板示例" />
        </div>
        <div class="paper-note note-top">MAKE IT<br />VISIBLE</div>
        <div class="paper-note note-bottom">your life,<br /><em>in sight</em></div>
      </div>
    </div>
  </section>

  <section class="container promise-strip" aria-label="隐私与使用承诺">
    <div><b>01</b><span>选择照片</span><small>从你的设备本地读取</small></div>
    <div><b>02</b><span>自由拼贴</span><small>布局、文字、颜色都能改</small></div>
    <div><b>03</b><span>下载成品</span><small>作品只属于你</small></div>
  </section>

  <section class="section container">
    <div class="section-heading">
      <div>
        <div class="eyebrow" v-reveal>Made for real life</div>
        <h2 v-reveal class="d1">不是模板答案，<br />是你想靠近的生活。</h2>
      </div>
      <p class="lead" v-reveal>
        愿景板可以关于一次旅行、一个家，也可以只是提醒自己：今年想过得更舒展一点。
      </p>
    </div>

    <div class="showcase-grid showcase-grid-featured">
      <article v-for="(item, index) in featured" :key="item.id" class="showcase-card" v-reveal :class="`d${index + 1}`">
        <div class="showcase-image" :style="{ backgroundPosition: item.position }" role="img" :aria-label="item.title"></div>
        <div class="showcase-copy">
          <span class="case-number">0{{ index + 1 }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <div><span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span></div>
        </div>
      </article>
    </div>
    <p class="section-link centered-link"><router-link to="/showcases" class="btn">查看六种创作方向 <span class="arrow">→</span></router-link></p>
  </section>

  <section class="section feature-section">
    <div class="container">
      <div class="section-heading">
        <div>
          <div class="eyebrow" v-reveal>Everything you need</div>
          <h2 v-reveal class="d1">让工具退后，<br />让画面先发生。</h2>
        </div>
        <p class="lead" v-reveal>不需要学习复杂设计软件。上传、拼贴、写字，然后带走你的作品。</p>
      </div>

      <div class="feature-ledger">
        <article v-for="(service, index) in topServices" :key="service.id" class="feature-row" v-reveal>
          <span class="feature-index">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="feature-icon">{{ service.icon }}</span>
          <div>
            <h3>{{ service.title }}</h3>
            <p>{{ service.summary }}</p>
          </div>
          <span class="feature-arrow" aria-hidden="true">↗</span>
        </article>
      </div>
    </div>
  </section>

  <section class="container privacy-callout" v-reveal>
    <div class="privacy-mark" aria-hidden="true">◎</div>
    <div>
      <div class="eyebrow">Privacy by design</div>
      <h2>你的照片，从头到尾都留在浏览器里。</h2>
      <p>没有账号，没有上传队列，也没有云端作品库。自动保存使用本机浏览器存储，导出同样在本机完成。</p>
    </div>
    <router-link to="/privacy" class="text-link">了解隐私设计 <span>→</span></router-link>
  </section>

  <section class="container final-launch">
    <div class="final-launch-copy">
      <div class="eyebrow">MAKE IT VISIBLE</div>
      <h2>现在，把它放到眼前。</h2>
      <p>不需要先想清楚所有答案。先挑几张让你心里一亮的照片。</p>
      <a :href="editorUrl" class="btn btn-primary btn-large">打开空白画布 <span class="arrow">→</span></a>
    </div>
    <div class="final-launch-shape" aria-hidden="true">
      <span></span>
    </div>
  </section>
</template>
