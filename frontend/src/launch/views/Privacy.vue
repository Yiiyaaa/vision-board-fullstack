<template>
  <section class="section container reading-page">
    <div class="eyebrow" v-reveal>Privacy by design</div>
    <h2 v-reveal class="d1">你的照片，留在你的浏览器里。</h2>
    <p class="lead d1" v-reveal>Make It Visible 不要求注册。你选择的图片、愿景板内容与草稿不会上传到本站服务器。</p>

    <div class="reading-card" v-reveal>
      <h3>我们如何处理你的内容</h3>
      <p>图片由浏览器的 FileReader 在本机读取，并交给画布编辑器处理。自动保存使用浏览器的 IndexedDB，导出也在本机完成。</p>

      <h3>我们不会做什么</h3>
      <p>首发版本不提供账号、云端同步或作品托管，因此不会在服务器上保存你的照片或愿景板。反馈页也不会把表单内容提交到本站数据库。</p>

      <h3>你可以怎样清除数据</h3>
      <p>在编辑器中点击“新建”可以清空当前作品；你也可以通过浏览器的站点数据设置，删除本网站的本地存储与 IndexedDB 数据。</p>

      <h3>外部资源</h3>
      <p>为了呈现更多字体，页面可能从第三方字体镜像加载字体文件。若加载失败，网站会使用本机字体继续工作。</p>

      <h3>联系</h3>
      <p>如果你对隐私或功能有疑问，请前往 <router-link to="/contact">反馈与联系</router-link> 页面。</p>
    </div>
  </section>
</template>
