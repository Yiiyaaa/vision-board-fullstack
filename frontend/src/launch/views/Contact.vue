<script setup>
import { computed, ref } from 'vue'
import { siteInfo } from '../../data/content'

const form = ref({ name: '', contact: '', subject: '', content: '' })
const status = ref('')
const copied = ref(false)

const mailSubject = computed(() => form.value.subject.trim() || 'Make It Visible 使用反馈')
const mailBody = computed(() => [
  form.value.name ? `称呼：${form.value.name}` : '',
  form.value.contact ? `回复方式：${form.value.contact}` : '',
  '',
  form.value.content,
].filter((line, index, lines) => line || (index > 0 && lines[index - 1])).join('\n'))

function submit() {
  if (!form.value.content.trim()) {
    status.value = '请先写下反馈内容。'
    return
  }

  const href = `mailto:${siteInfo.email}?subject=${encodeURIComponent(mailSubject.value)}&body=${encodeURIComponent(mailBody.value)}`
  status.value = '邮件草稿已经打开。若没有反应，可以复制下方邮箱直接联系。'
  window.location.href = href
}

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(siteInfo.email)
    copied.value = true
    window.setTimeout(() => { copied.value = false }, 1800)
  } catch {
    status.value = `请手动复制：${siteInfo.email}`
  }
}
</script>

<template>
  <section class="section container contact-page">
    <div class="contact-intro">
      <div class="eyebrow" v-reveal>Feedback makes it better</div>
      <h2 v-reveal class="d1">哪里顺手，<br />哪里还差一点？</h2>
      <p class="lead d1" v-reveal>功能建议、导出问题、合作想法，或者只是想分享你做出的第一张愿景板，都欢迎告诉我。</p>

      <div class="contact-direct" v-reveal>
        <span>直接联系</span>
        <a :href="`mailto:${siteInfo.email}`">{{ siteInfo.email }}</a>
        <button type="button" @click="copyEmail">{{ copied ? '已复制' : '复制邮箱' }}</button>
      </div>
    </div>

    <div class="contact-form-card" v-reveal>
      <div v-if="status" class="notice ok" role="status">{{ status }}</div>
      <form @submit.prevent="submit">
        <div class="field-pair">
          <div class="field">
            <label for="contact-name">怎么称呼你（选填）</label>
            <input id="contact-name" v-model="form.name" maxlength="50" autocomplete="name" />
          </div>
          <div class="field">
            <label for="contact-way">希望如何回复（选填）</label>
            <input id="contact-way" v-model="form.contact" maxlength="100" placeholder="邮箱、微信或其他方式" />
          </div>
        </div>
        <div class="field">
          <label for="contact-subject">主题（选填）</label>
          <input id="contact-subject" v-model="form.subject" maxlength="120" placeholder="例如：移动端导出反馈" />
        </div>
        <div class="field">
          <label for="contact-content">想说的话</label>
          <textarea id="contact-content" v-model="form.content" required placeholder="越具体，越容易帮我把它变得更好。"></textarea>
        </div>
        <button class="btn btn-primary" type="submit">用邮件发送 <span class="arrow">→</span></button>
        <p class="form-privacy">提交按钮只会打开你的邮件客户端，网站不会储存这段内容。</p>
      </form>
    </div>
  </section>
</template>
