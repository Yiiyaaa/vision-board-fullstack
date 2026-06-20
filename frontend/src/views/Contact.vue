<script setup>
import { ref } from 'vue'
import { postInquiry } from '../api'

const form = ref({ name: '', contact: '', subject: '', content: '', website: '' })
const status = ref('')   // '' | 'ok' | 'err'
const msg = ref('')
const submitting = ref(false)

async function submit() {
  // only 内容 is required; the other three may stay empty
  if (!form.value.content.trim()) {
    status.value = 'err'; msg.value = '请先写下你的反馈内容'; return
  }
  submitting.value = true; status.value = ''
  try {
    await postInquiry({ ...form.value, source: '反馈与联系页' })
    status.value = 'ok'; msg.value = '提交成功,谢谢你告诉我❤️'
    // clear only on success
    form.value = { name: '', contact: '', subject: '', content: '', website: '' }
  } catch (e) {
    // keep everything the user typed so nothing is lost
    status.value = 'err'
    msg.value = '提交失败了,请检查网络后重试。你填写的内容已为你保留。'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="section container" style="max-width:680px">
    <div class="eyebrow" v-reveal>反馈与联系</div>
    <h2 v-reveal class="d1">说说你的想法</h2>
    <p class="lead d1" v-reveal>功能建议、使用问题、合作需求... ... 都可以写在这里。</p>

    <div class="card" v-reveal>
      <div v-if="status" :class="['notice', status]">{{ msg }}</div>
      <form @submit.prevent="submit">
        <!-- honeypot: hidden from real users; bots that fill it are rejected -->
        <input v-model="form.website" class="hp-field" type="text" name="website"
               tabindex="-1" autocomplete="off" aria-hidden="true" />

        <div class="field">
          <label>称呼(选填)</label>
          <input v-model="form.name" placeholder="你希望我怎么称呼你?" maxlength="50" />
        </div>
        <div class="field">
          <label>联系方式(选填)</label>
          <input v-model="form.contact" placeholder="想收到回复时,可以留下邮箱、微信或其他联系方式" maxlength="100" />
        </div>
        <div class="field">
          <label>主题(选填)</label>
          <input v-model="form.subject" placeholder="例如:用户反馈 / 品牌联名" maxlength="120" />
        </div>
        <div class="field">
          <label>内容 *</label>
          <textarea v-model="form.content" placeholder="说说你的想法、问题或建议……"></textarea>
        </div>
        <button class="btn btn-primary" type="submit" :disabled="submitting">
          {{ submitting ? '提交中…' : '提交' }}
        </button>
      </form>
    </div>
  </section>
</template>
