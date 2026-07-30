export const siteInfo = {
  name: 'Make It Visible',
  chineseName: '愿景板工作室',
  email: 'ylinylin1010@gmail.com',
  slogan: '先看见，再靠近。',
}

export const serviceCategories = [
  {
    id: 1,
    name: '快速成形',
    order: 0,
    services: [
      {
        id: 1,
        icon: '✦',
        title: '自动拼贴',
        summary: '照片一放，版式自己长出来',
        description: '压边、平铺、留白三种边缘风格，也可以固定喜欢的布局后只替换照片。',
      },
      {
        id: 2,
        icon: '▦',
        title: '多种画布',
        summary: '手机、桌面与方形作品',
        description: '内置横版、竖版、方形尺寸，也支持自定义宽高，做壁纸或社交分享都合适。',
      },
      {
        id: 3,
        icon: '⌁',
        title: '布局模板',
        summary: '从一个好结构开始',
        description: '不必面对空白画布。挑选模板、加入照片，再慢慢调整成你的样子。',
      },
    ],
  },
  {
    id: 2,
    name: '留下你的语气',
    order: 1,
    services: [
      {
        id: 4,
        icon: 'Aa',
        title: '文字贴纸',
        summary: '字体、描边、阴影与发光',
        description: '中英文字体与心愿文案库，支持背景、透明度、行距和字距等细致调整。',
      },
      {
        id: 5,
        icon: '◒',
        title: '从照片取色',
        summary: '让整张愿景板自然统一',
        description: '上传后自动提取主题色，也可以使用 HEX、RGB、HSL 调色或从画布直接取色。',
      },
      {
        id: 6,
        icon: '↥',
        title: '高清导出',
        summary: 'PNG、JPG 与 WebP',
        description: '完成后直接导出高清文件。整个过程在浏览器里进行，不需要上传作品。',
      },
    ],
  },
]

export const showcases = [
  {
    id: 1,
    title: '沿着海岸出发',
    description: '把想去的地方、想走的路和路上的光收进一张旅行愿景板。',
    tags: ['旅行', '蓝色', '年度愿望'],
    featured: true,
    position: '0% 0%',
  },
  {
    id: 2,
    title: '安静阅读的一年',
    description: '书架、纸页、热茶和晨光，给阅读计划一个想靠近的画面。',
    tags: ['阅读', '成长', '慢生活'],
    featured: true,
    position: '50% 0%',
  },
  {
    id: 3,
    title: '照顾身体',
    description: '把运动、饮食与户外时刻放在一起，提醒自己持续而温柔地行动。',
    tags: ['健康', '运动', '自我关怀'],
    featured: true,
    position: '100% 0%',
  },
  {
    id: 4,
    title: '理想中的家',
    description: '喜欢的材质、光线与生活细节，先在愿景板里住进去。',
    tags: ['家居', '自然', '空间灵感'],
    featured: false,
    position: '0% 100%',
  },
  {
    id: 5,
    title: '创作与新开始',
    description: '把工作台、草图和想完成的作品并置，让方向每天都被看见。',
    tags: ['创作', '事业', '新项目'],
    featured: false,
    position: '50% 100%',
  },
  {
    id: 6,
    title: '关于相聚的想象',
    description: '花、布料、餐桌与柔软日光，一起确认重要日子的气质。',
    tags: ['婚礼', '花艺', '仪式感'],
    featured: false,
    position: '100% 100%',
  },
]
