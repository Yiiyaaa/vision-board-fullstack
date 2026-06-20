/* ── Canvas preset system (mutable current size) ────────── */
const CANVAS_PRESETS = {
  landscape: { w: 1920, h: 1080 },
  portrait:  { w: 1080, h: 1920 },
  square:    { w: 1080, h: 1080 },
};
let activeCanvasKey = 'landscape';
let CANVAS_W = CANVAS_PRESETS.landscape.w;
let CANVAS_H = CANVAS_PRESETS.landscape.h;

/* Raise Fabric cache limits so large photos aren't downscaled (clarity) */
fabric.perfLimitSizeTotal = 16777216;
fabric.maxCacheSideLimit  = 8192;
fabric.textureSize        = 4096;

/* ── Fonts ──────────────────────────────────────────────── */
const FONT_GROUPS = [
  { group: 'Handwriting (EN)', items: [
    ['Caveat','Caveat'], ['Patrick Hand','Patrick Hand'], ['Shadows Into Light','Shadows Into Light'],
    ['Kalam','Kalam'], ['Indie Flower','Indie Flower'], ['Gochi Hand','Gochi Hand'],
    ['Permanent Marker','Permanent Marker'], ['Sacramento','Sacramento'],
    ['Gloria Hallelujah','Gloria Hallelujah'], ['Homemade Apple','Homemade Apple'],
    ['Dancing Script','Dancing Script'], ['Architects Daughter','Architects Daughter'],
    ['Great Vibes','Great Vibes'], ['Allura','Allura'], ['Pacifico','Pacifico'],
    ['Satisfy','Satisfy'], ['Courgette','Courgette'], ['Amatic SC','Amatic SC'],
  ]},
  { group: '中文 手写 / 书法', items: [
    ['Ma Shan Zheng','马善政 楷书'], ['Zhi Mang Xing','智芒星 行书'], ['Long Cang','龙藏 草书'],
    ['Liu Jian Mao Cao','柳建毛草'], ['LXGW WenKai','霞鹜文楷'], ['ChillHuoKai','寒蝉活楷'],
    ['Mengshen-Handwritten','萌神手写'], ['CEF Fonts CJK','快去写作业'],
  ]},
  { group: '中文 黑体 / 创意', items: [
    ['Noto Sans SC','思源黑体'], ['Noto Serif SC','思源宋体'],
    ['Smiley Sans Oblique','得意黑'], ['ZCOOL KuaiLe','站酷快乐体'],
    ['ZCOOL XiaoWei','站酷小薇'], ['ZCOOL QingKe HuangYou','站酷黄油体'],
  ]},
  { group: '日系手写 (含汉字)', items: [
    ['Klee One','Klee 楷'], ['Yuji Syuku','Yuji 明朝'], ['Zen Kurenaido','Zen 手写'],
    ['Hachi Maru Pop','圆体 Pop'], ['Yusei Magic','Yusei Magic'],
    ['Zen Maru Gothic','Zen 圆体'], ['Shippori Mincho','しっぽり明朝'],
    ['Kaisei Decol','Kaisei Decol'], ['M PLUS Rounded 1c','M+ 圆体'],
  ]},
  { group: 'Display & Serif', items: [
    ['Playfair Display','Playfair Display'], ['DM Serif Display','DM Serif'],
    ['Cormorant Garamond','Cormorant Garamond'], ['Libre Baskerville','Libre Baskerville'],
    ['Abril Fatface','Abril Fatface'], ['Cinzel','Cinzel'], ['Italiana','Italiana'],
    ['Bebas Neue','Bebas Neue'], ['Poppins','Poppins'],
  ]},
  { group: 'Modern Sans', items: [
    ['Quicksand','Quicksand'], ['Comfortaa','Comfortaa'], ['Josefin Sans','Josefin Sans'],
  ]},
];

/* ── Phrase library (Vision Board affirmations) ─────────── */
const PHRASES = [
  // ── English ──
  "Make it visible, make it real.",
  "Everything is working out for me.",
  "I'm becoming who I am meant to be.",
  "Abundance flows to me with ease.",
  "She believed she could, so she did.",
  "Romanticize your life.",
  "Quiet luxury.",
  "Allow dreams.",
  "Soft life era.",
  "Main character energy.",
  "Healthy, wealthy, loved.",
  "Everything I want, wants me more",
  "Less noise, more life",
  "More room to wander",
  "Make space for what matters",
  "Open roads",
  "Somewhere New",
  "There's more ahead",
  "Choose or expand",
  "Leave room for surprise",
  "For the love of it",
  "My little universe",
  "Made of moments",
  "All the things I love",
  "This is the good part",
  "Build it slowly, one thing at a time",
  "Make it real",
  // ── 中文 ──
  "我允许一切发生",
  "把日子过成想要的样子",
  "心之所向，身之所往",
  "慢即是快",
  "自由 · 丰盛 · 平静",
  "健康 · 自由 · 热爱",
  "财富自由 · 时间自由",
  "好运正在加速向我奔来",
  "相信身体的直觉",
  "按自己的节奏",
  "世界是美好的",
  "做时间的朋友",
  "一次只做好一件事",
];

/* ── PaddedText: IText subclass — bg box + stroke + shadow + glow ── */
function roundRectPath(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y,     x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x,     y + h, r);
  ctx.arcTo(x,     y + h, x,     y,     r);
  ctx.arcTo(x,     y,     x + w, y,     r);
  ctx.closePath();
}
function hexToRgba(hex, a) {
  hex = toHex(hex);
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

const PaddedText = fabric.util.createClass(fabric.IText, {
  type: 'paddedText',
  bgEnabled: false, bgFill: '#fff7e6', bgFill2: '#ffd9c0', bgPadX: 28, bgPadY: 18, bgRadius: 0, bgOpacity: 100,
  bgType: 'solid', bgAngle: 135, bgTexture: 'paper',
  shadowEnabled: false, shadowColor: '#000000', shadowBlur: 8, shadowX: 6, shadowY: 6,
  glowEnabled: false, glowColor: '#ffe44d', glowSize: 16,

  initialize(text, options) {
    options = options || {};
    this.callSuper('initialize', text, options);
    this.set({ objectCaching: false, shadow: null });
  },

  _paintBg(ctx, w, h) {
    const op = (this.bgOpacity ?? 100) / 100;
    const x0 = -w / 2, y0 = -h / 2;
    ctx.save();
    roundRectPath(ctx, x0, y0, w, h, this.bgRadius);
    ctx.clip();
    if (this.bgType === 'gradient') {
      const ang = (this.bgAngle ?? 135) * Math.PI / 180;
      const dx = Math.cos(ang), dy = Math.sin(ang);
      const len = (Math.abs(dx) * w + Math.abs(dy) * h) / 2;
      const g = ctx.createLinearGradient(-dx * len, -dy * len, dx * len, dy * len);
      g.addColorStop(0, hexToRgba(this.bgFill, op));
      g.addColorStop(1, hexToRgba(this.bgFill2 || '#ffffff', op));
      ctx.fillStyle = g; ctx.fillRect(x0, y0, w, h);
    } else if (this.bgType === 'texture') {
      ctx.fillStyle = hexToRgba(this.bgFill, op); ctx.fillRect(x0, y0, w, h);
      const tex = getTexture(this.bgTexture || 'paper');
      if (tex) { ctx.globalAlpha = op; ctx.fillStyle = ctx.createPattern(tex, 'repeat'); ctx.fillRect(x0, y0, w, h); }
    } else {
      ctx.fillStyle = hexToRgba(this.bgFill, op); ctx.fillRect(x0, y0, w, h);
    }
    ctx.restore();
  },

  _render(ctx) {
    if (this.bgEnabled && this.bgFill) this._paintBg(ctx, this.width + this.bgPadX * 2, this.height + this.bgPadY * 2);
    if (this.shadowEnabled) {
      ctx.save();
      ctx.shadowColor = this.shadowColor; ctx.shadowBlur = this.shadowBlur;
      ctx.shadowOffsetX = this.shadowX; ctx.shadowOffsetY = this.shadowY;
      this.callSuper('_render', ctx);
      ctx.restore();
    }
    if (this.glowEnabled) {
      ctx.save();
      ctx.shadowColor = this.glowColor; ctx.shadowBlur = this.glowSize;
      ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
      this.callSuper('_render', ctx);
      this.callSuper('_render', ctx);
      ctx.restore();
    }
    this.callSuper('_render', ctx);
  },

  toObject(propertiesToInclude) {
    return this.callSuper('toObject', [
      'bgEnabled', 'bgFill', 'bgFill2', 'bgPadX', 'bgPadY', 'bgRadius', 'bgOpacity', 'bgType', 'bgAngle', 'bgTexture',
      'shadowEnabled', 'shadowColor', 'shadowBlur', 'shadowX', 'shadowY',
      'glowEnabled', 'glowColor', 'glowSize',
    ].concat(propertiesToInclude || []));
  },
});
PaddedText.fromObject = function (object, callback) {
  const t = new PaddedText(object.text, object);
  callback && callback(t);
  return t;
};
fabric.PaddedText = PaddedText;

/* ── Procedural background textures (transparent overlays, export-safe) ── */
const _texCache = {};
function makeTexture(kind) {
  const s = 140, c = document.createElement('canvas'); c.width = c.height = s;
  const x = c.getContext('2d');
  if (kind === 'paper') {
    for (let i = 0; i < 2600; i++) { const a = Math.random() * 0.05; x.fillStyle = (Math.random() < 0.5) ? `rgba(0,0,0,${a})` : `rgba(255,255,255,${a})`; x.fillRect(Math.random() * s, Math.random() * s, 1, 1); }
  } else if (kind === 'linen') {
    x.strokeStyle = 'rgba(0,0,0,0.035)'; x.lineWidth = 1;
    for (let i = 0; i < s; i += 4) { x.beginPath(); x.moveTo(i + .5, 0); x.lineTo(i + .5, s); x.stroke(); }
    x.strokeStyle = 'rgba(255,255,255,0.05)';
    for (let i = 0; i < s; i += 4) { x.beginPath(); x.moveTo(0, i + .5); x.lineTo(s, i + .5); x.stroke(); }
  } else if (kind === 'dots') {
    x.fillStyle = 'rgba(0,0,0,0.05)';
    for (let gy = 7; gy < s; gy += 14) for (let gx = 7; gx < s; gx += 14) { x.beginPath(); x.arc(gx, gy, 1.3, 0, 7); x.fill(); }
  } else if (kind === 'grid') {
    x.strokeStyle = 'rgba(0,0,0,0.05)'; x.lineWidth = 1;
    for (let i = 0; i <= s; i += 20) { x.beginPath(); x.moveTo(i + .5, 0); x.lineTo(i + .5, s); x.moveTo(0, i + .5); x.lineTo(s, i + .5); x.stroke(); }
  }
  return c;
}
function getTexture(kind) { return _texCache[kind] || (_texCache[kind] = makeTexture(kind)); }

const EXTRA_PROPS = ['frameRect', 'frameMeta', 'isSticker', 'lockRotation', 'objectCaching', 'isColorCard', 'cardColor', 'isDecorLine'];

let canvas, displayScale, activeFrameDrag = null;
let suppressSync = false, suppressCommit = false;

/* Color-card state (declared early so init() can use it before the section below runs) */
const COLOR_DEFAULTS = ['#edcbcf', '#d9d3ea', '#f0dfc4', '#e8c7a8', '#c9b6e2'];
let suggestedColors = COLOR_DEFAULTS.slice();
let picking = false;
let decorNum = 0;
let layoutLocked = false, savedSlots = null;
let alignGuides = [], lastAlignKey = '';

/* Collage edge style: overlap (压边) | flush (平铺) | gutter (留白) */
let collageEdge = 'overlap';
try { const _m = localStorage.getItem('vb-collage-edge'); if (_m === 'flush' || _m === 'gutter' || _m === 'overlap') collageEdge = _m; } catch (e) {}
const EDGE_HINTS = {
  overlap: '照片轻微互相压边,更有拼贴感',
  flush: '严丝合缝,整齐平铺',
  gutter: '照片间露出画布底色,画框感',
};

/* Landing-page state (declared early to avoid TDZ when init() runs) */
let landingTeardown = null, welcomeEntered = false;

/* small DOM helpers */
const $ = id => document.getElementById(id);
const val = id => $(id).value;
const intv = id => parseInt($(id).value, 10);
const chk = id => $(id).checked;
function setVal(id, v) { $(id).value = v; }
function setChk(id, b) { $(id).checked = b; }
function setLabel(id, v) { $(id).textContent = v; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

/* ── History (undo / redo) ──────────────────────────────── */
const history = { stack: [], index: -1, restoring: false, timer: null };
function snapshot() { return JSON.stringify(canvas.toJSON(EXTRA_PROPS)); }
function commit() {
  if (history.restoring || suppressCommit) return;
  clearTimeout(history.timer);
  history.timer = setTimeout(() => {
    const json = snapshot();
    if (json === history.stack[history.index]) return;
    history.stack = history.stack.slice(0, history.index + 1);
    history.stack.push(json);
    if (history.stack.length > 60) history.stack.shift();
    history.index = history.stack.length - 1;
    updateUndoButtons();
    saveDraft();
  }, 120);
}
function loadState(json) {
  history.restoring = true;
  canvas.loadFromJSON(json, () => {
    canvas.getObjects().forEach(o => { if (o.type === 'image' || o.type === 'paddedText') o.set('objectCaching', false); });
    canvas.renderAll();
    history.restoring = false;
    updateUndoButtons();
  });
}
function undo() { if (history.index > 0) { history.index--; loadState(history.stack[history.index]); } }
function redo() { if (history.index < history.stack.length - 1) { history.index++; loadState(history.stack[history.index]); } }
function updateUndoButtons() {
  $('btn-undo').disabled = history.index <= 0;
  $('btn-redo').disabled = history.index >= history.stack.length - 1;
}

/* ── Local draft autosave (IndexedDB) ──────────────────────
   Photos are inlined as base64 in snapshot(), so a board easily exceeds
   localStorage's ~5MB — IndexedDB has no hard cap. Every failure is swallowed
   so private-mode / disabled storage just degrades to "no autosave". */
const DRAFT_DB = 'vision-board', DRAFT_STORE = 'drafts', DRAFT_KEY = 'current';
let _draftDB = null, _draftDBP = null;
/* Open once and cache the connection — opening/closing per operation causes
   open-churn that can leave a request stuck on onblocked. */
function idbReady() {
  if (_draftDB) return Promise.resolve(_draftDB);
  if (_draftDBP) return _draftDBP;
  _draftDBP = new Promise((resolve, reject) => {
    if (!window.indexedDB) return reject(new Error('no-idb'));
    const req = indexedDB.open(DRAFT_DB, 1);
    req.onupgradeneeded = () => { if (!req.result.objectStoreNames.contains(DRAFT_STORE)) req.result.createObjectStore(DRAFT_STORE); };
    req.onsuccess = () => { _draftDB = req.result; resolve(_draftDB); };
    req.onerror = () => { _draftDBP = null; reject(req.error); };
    req.onblocked = () => { _draftDBP = null; reject(new Error('blocked')); };
  });
  return _draftDBP;
}
function idbPut(val) {
  return idbReady().then(db => new Promise((res, rej) => {
    const t = db.transaction(DRAFT_STORE, 'readwrite');
    t.objectStore(DRAFT_STORE).put(val, DRAFT_KEY);
    t.oncomplete = () => res(); t.onerror = () => rej(t.error);
  }));
}
function idbGet() {
  return idbReady().then(db => new Promise((res, rej) => {
    const t = db.transaction(DRAFT_STORE, 'readonly');
    const r = t.objectStore(DRAFT_STORE).get(DRAFT_KEY);
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  }));
}

let draftTimer = null;
function saveDraft() {
  if (!canvas || history.restoring) return;
  clearTimeout(draftTimer);
  draftTimer = setTimeout(() => {
    try {
      idbPut({ json: snapshot(), w: CANVAS_W, h: CANVAS_H, key: activeCanvasKey, ts: Date.now() }).catch(() => {});
    } catch (e) {}
  }, 400);
}

/* Restore a saved board on entry, or fall back to the empty-canvas init */
function restoreDraftOrInit() {
  const freshInit = () => { history.stack = [snapshot()]; history.index = 0; updateUndoButtons(); updateEmptyState(); };
  let idb;
  try { idb = idbGet(); } catch (e) { freshInit(); return; }
  idb.then(d => {
    if (!d || !d.json) { freshInit(); return; }
    if (d.w && d.h) { CANVAS_W = d.w; CANVAS_H = d.h; activeCanvasKey = d.key || 'custom'; }
    history.restoring = true;
    canvas.loadFromJSON(d.json, () => {
      canvas.getObjects().forEach(o => { if (o.type === 'image' || o.type === 'paddedText') o.set('objectCaching', false); });
      history.restoring = false;
      applyScale(); updatePresetButtons(); canvas.renderAll();
      history.stack = [snapshot()]; history.index = 0; updateUndoButtons();
      updateEmptyState();
      if (canvas.getObjects().length) showToast('已恢复上次草稿');
    });
  }).catch(freshInit);
}

/* New / clear — removes everything (undoable via Ctrl+Z; autosave overwrites) */
function newCanvas() {
  canvas.getObjects().slice().forEach(o => canvas.remove(o));
  canvas.discardActiveObject();
  canvas.renderAll();
  commit();
  updateEmptyState();
  showToast('已清空 · 可按 Ctrl+Z 撤销');
}

/* ── Init ───────────────────────────────────────────────── */
/* (bootstrapping happens at the very end of this file, after all
   top-level state declarations have run) */

function init() {
  canvas = new fabric.Canvas('c', {
    width: CANVAS_W, height: CANVAS_H,
    backgroundColor: '#ffffff',
    preserveObjectStacking: true,
    selection: true,
    enableRetinaScaling: true,
    imageSmoothingEnabled: true,
    perPixelTargetFind: true,
    targetFindTolerance: 4,
  });

  const coarse = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 820;
  fabric.Object.prototype.set({
    borderColor: 'rgba(183,168,185,0.75)', cornerColor: 'rgba(255,255,255,0.55)',
    cornerStrokeColor: 'rgba(183,168,185,0.9)',
    cornerSize: coarse ? 18 : 8, cornerStyle: 'circle', transparentCorners: false,
    borderScaleFactor: 1, borderOpacityWhenMoving: 1, padding: 4,
  });
  if (coarse && 'touchCornerSize' in fabric.Object.prototype) fabric.Object.prototype.touchCornerSize = 44;

  buildFontOptions();
  buildPhrases();
  renderColorCards();
  renderDecorSwatches();
  bindEvents();
  initWelcome();
  window.addEventListener('resize', applyScale);
  window.addEventListener('orientationchange', () => setTimeout(applyScale, 300));

  history.stack = [snapshot()];
  history.index = 0;
  updateUndoButtons();
}

/* ── Canvas scaling ─────────────────────────────────────── */
function applyScale() {
  const area = $('canvas-area');
  const availW = area.clientWidth - 40;
  const availH = area.clientHeight - 40;
  if (availW <= 0 || availH <= 0) return;
  displayScale = Math.max(0.05, Math.min(availW / CANVAS_W, availH / CANVAS_H, 1));

  const dispW = CANVAS_W * displayScale;
  const dispH = CANVAS_H * displayScale;
  canvas.setWidth(dispW); canvas.setHeight(dispH);
  canvas.setZoom(displayScale);
  canvas.renderAll();

  const wrap = $('canvas-wrap');
  wrap.style.width = dispW + 'px';
  wrap.style.height = dispH + 'px';
}

/* Empty-state guide visibility — gone once anything is on the canvas */
function updateEmptyState() {
  const el = $('canvas-empty'); if (!el || !canvas) return;
  el.classList.toggle('gone', canvas.getObjects().length > 0);
}

/* ════════ COLLAGE LAYOUT (BSP + overlap + framed photos) ════════ */
function partition(rect, count) {
  if (count <= 1) return [rect];
  let a = Math.round(count * (0.4 + Math.random() * 0.2));
  a = Math.max(1, Math.min(count - 1, a));
  const b = count - a;
  let frac = a / count + (Math.random() - 0.5) * 0.4;
  frac = Math.max(0.26, Math.min(0.74, frac));
  const out = [];
  if (rect.w >= rect.h) {
    const w1 = rect.w * frac;
    out.push(...partition({ x: rect.x, y: rect.y, w: w1, h: rect.h }, a));
    out.push(...partition({ x: rect.x + w1, y: rect.y, w: rect.w - w1, h: rect.h }, b));
  } else {
    const h1 = rect.h * frac;
    out.push(...partition({ x: rect.x, y: rect.y, w: rect.w, h: h1 }, a));
    out.push(...partition({ x: rect.x, y: rect.y + h1, w: rect.w, h: rect.h - h1 }, b));
  }
  return out;
}
function placeInFrame(img, f) {
  const cover = Math.max(f.w / img.width, f.h / img.height);
  img.set({
    originX: 'left', originY: 'top',   // normalise so the left/top math below is correct for any object
    scaleX: cover, scaleY: cover, angle: 0,
    left: f.x + (f.w - img.width * cover) / 2,
    top:  f.y + (f.h - img.height * cover) / 2,
    lockRotation: true,
    clipPath: new fabric.Rect({ left: f.x, top: f.y, width: f.w, height: f.h, absolutePositioned: true }),
  });
  img.setControlsVisibility({ mtr: false });
  img.frameRect = { x: f.x, y: f.y, w: f.w, h: f.h };
  img.setCoords();
}
function enforceFrame(img) {
  const f = img.frameRect; if (!f) return;
  const cover = Math.max(f.w / img.width, f.h / img.height);
  const s = Math.max(img.scaleX, cover);
  img.scaleX = img.scaleY = s;
  const sw = img.width * s, sh = img.height * s;
  img.left = Math.min(f.x, Math.max(f.x + f.w - sw, img.left));
  img.top  = Math.min(f.y, Math.max(f.y + f.h - sh, img.top));
  if (!img.clipPath) img.clipPath = new fabric.Rect({ left: f.x, top: f.y, width: f.w, height: f.h, absolutePositioned: true });
  img.setCoords();
}
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/* ── Collage slots: base rect + random expansion, frame derived per edge style ──
   A slot is { base:{x,y,w,h}, mx, my }. The base rects always tile the full
   canvas, so the three edge styles stay interchangeable on the same layout. */
function normSlot(s) {
  return (s && s.base) ? s : { base: { x: s.x, y: s.y, w: s.w, h: s.h }, mx: s.mx || 0, my: s.my || 0 };
}
function gutterSize() { return Math.round(Math.min(CANVAS_W, CANVAS_H) * 0.012); }
function slotFrame(slot) {
  const b = slot.base;
  if (collageEdge === 'overlap') {
    let f = { x: b.x - slot.mx, y: b.y - slot.my, w: b.w + slot.mx * 2, h: b.h + slot.my * 2 };
    f.x = Math.max(0, f.x); f.y = Math.max(0, f.y);
    f.w = Math.min(f.w, CANVAS_W - f.x); f.h = Math.min(f.h, CANVAS_H - f.y);
    return f;
  }
  if (collageEdge === 'gutter') {
    const g = gutterSize(), h = g / 2;
    /* canvas-touching edges get the full gap so border and inner seams match */
    const lx = b.x <= 1 ? g : h;
    const ty = b.y <= 1 ? g : h;
    const rx = (b.x + b.w >= CANVAS_W - 1) ? g : h;
    const by = (b.y + b.h >= CANVAS_H - 1) ? g : h;
    return { x: b.x + lx, y: b.y + ty, w: Math.max(40, b.w - lx - rx), h: Math.max(40, b.h - ty - by) };
  }
  // flush: edge-to-edge, but bleed a hair so neighbours overlap and the
  // canvas colour never shows through the sub-pixel seam (no visible overlap:
  // ~0.5% vs overlap's 1.5–7.5%). Canvas-touching edges don't bleed.
  const s = Math.max(3, Math.round(Math.min(CANVAS_W, CANVAS_H) * 0.005));
  const lx = b.x <= 1 ? 0 : s, ty = b.y <= 1 ? 0 : s;
  const rx = (b.x + b.w >= CANVAS_W - 1) ? 0 : s, by = (b.y + b.h >= CANVAS_H - 1) ? 0 : s;
  return { x: b.x - lx, y: b.y - ty, w: b.w + lx + rx, h: b.h + ty + by };
}
function placeInSlot(img, slot) {
  const ns = normSlot(slot);
  placeInFrame(img, slotFrame(ns));
  img.frameMeta = { base: { ...ns.base }, mx: ns.mx, my: ns.my };
}

/* Switch edge style: re-derive every framed photo from its slot in place —
   the photo↔slot assignment is preserved, only the geometry changes. */
function setCollageEdge(mode) {
  if (!EDGE_HINTS[mode] || mode === collageEdge) return;
  collageEdge = mode;
  try { localStorage.setItem('vb-collage-edge', mode); } catch (e) {}
  setSegActive('edge-group', 'edge', mode);
  const hint = $('edge-hint'); if (hint) hint.textContent = EDGE_HINTS[mode];
  const framed = canvas ? canvas.getObjects('image').filter(o => !o.isSticker && (o.frameMeta || o.frameRect)) : [];
  if (framed.length) {
    suppressCommit = true;
    framed.forEach(img => placeInSlot(img, img.frameMeta || img.frameRect));
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    suppressCommit = false; commit();
  }
}
/* Lightweight glass toast — replaces blocking alert() */
let toastTimer = null;
function showToast(msg) {
  let t = document.getElementById('vb-toast');
  if (!t) { t = document.createElement('div'); t.id = 'vb-toast'; t.className = 'vb-toast'; ($('app') || document.body).appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}

function collageLayout() {
  const images = canvas.getObjects('image').filter(o => !o.isSticker);
  if (!images.length) { showToast('先上传一些照片,再自动拼贴'); return; }
  suppressCommit = true;

  if (layoutLocked && savedSlots && savedSlots.length === images.length) {
    // locked: keep the slot structure, only redistribute the photos
    const slotsA = [...savedSlots];
    const imgsA = shuffle(images);
    imgsA.forEach((img, i) => placeInSlot(img, slotsA[i]));
  } else {
    const rects = partition({ x: 0, y: 0, w: CANVAS_W, h: CANVAS_H }, images.length);
    const imgsA = [...images].sort((a, b) => a.width / a.height - b.width / b.height);
    const rectsA = [...rects].sort((a, b) => a.w / a.h - b.w / b.h);
    imgsA.forEach((img, i) => {
      const c = rectsA[i];
      placeInSlot(img, {
        base: { x: c.x, y: c.y, w: c.w, h: c.h },
        mx: c.w * (0.015 + Math.random() * 0.06),
        my: c.h * (0.015 + Math.random() * 0.06),
      });
    });
    // image count changed while locked: this fresh partition becomes the new saved structure
    if (layoutLocked) savedSlots = images.map(img => normSlot(img.frameMeta));
  }

  shuffle(images).forEach(img => canvas.sendToBack(img));
  canvas.discardActiveObject();
  canvas.requestRenderAll();
  suppressCommit = false; commit();
}

/* Lock / unlock the current slot structure */
function toggleLayoutLock() {
  layoutLocked = !layoutLocked;
  const captureSlots = () => canvas.getObjects('image')
    .filter(o => !o.isSticker && (o.frameMeta || o.frameRect))
    .map(img => normSlot(img.frameMeta || img.frameRect));
  if (layoutLocked) {
    savedSlots = captureSlots();
    if (!savedSlots.length) { collageLayout(); savedSlots = captureSlots(); }
    if (!savedSlots.length) { layoutLocked = false; savedSlots = null; }
  } else {
    savedSlots = null;
  }
  const b = $('btn-lock-layout'); if (b) b.classList.toggle('locked', layoutLocked);
}
/* ── Alignment hints while dragging stickers / text / decor ──
   Pure feedback: thin dashed guides appear when edges or centres line up
   with the canvas, photo frames, or other floating elements. No snapping. */
function updateAlignGuides(o) {
  alignGuides = [];
  if (!o || o.frameRect) { lastAlignKey = ''; return; }
  const r = o.getBoundingRect(true, true);
  const xs = [r.left, r.left + r.width / 2, r.left + r.width];
  const ys = [r.top, r.top + r.height / 2, r.top + r.height];
  const tx = [0, CANVAS_W / 2, CANVAS_W];
  const ty = [0, CANVAS_H / 2, CANVAS_H];
  canvas.getObjects().forEach(other => {
    if (other === o || other.group) return;
    if (other.frameRect) {
      const f = other.frameRect;
      tx.push(f.x, f.x + f.w); ty.push(f.y, f.y + f.h);
    } else {
      const b = other.getBoundingRect(true, true);
      tx.push(b.left, b.left + b.width / 2, b.left + b.width);
      ty.push(b.top, b.top + b.height / 2, b.top + b.height);
    }
  });
  const thr = Math.max(3, 4 / (displayScale || 1));
  const seen = new Set();
  xs.forEach(x => tx.forEach(t => { if (Math.abs(x - t) <= thr) { const k = 'v' + Math.round(t); if (!seen.has(k)) { seen.add(k); alignGuides.push({ type: 'v', pos: t }); } } }));
  ys.forEach(y => ty.forEach(t => { if (Math.abs(y - t) <= thr) { const k = 'h' + Math.round(t); if (!seen.has(k)) { seen.add(k); alignGuides.push({ type: 'h', pos: t }); } } }));
  const key = [...seen].sort().join('|');
  if (key && key !== lastAlignKey && navigator.vibrate) { try { navigator.vibrate(8); } catch (e) {} }
  lastAlignKey = key;
}
function clearAlignGuides() {
  if (!alignGuides.length && !lastAlignKey) return;
  alignGuides = []; lastAlignKey = '';
  canvas.requestRenderAll();
}
function drawAlignGuides() {
  if (!alignGuides.length) return;
  const ctx = canvas.contextContainer, z = canvas.getZoom();
  ctx.save();
  ctx.strokeStyle = 'rgba(183,168,185,0.65)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  alignGuides.forEach(g => {
    ctx.beginPath();
    if (g.type === 'v') { ctx.moveTo(g.pos * z + 0.5, 0); ctx.lineTo(g.pos * z + 0.5, canvas.getHeight()); }
    else { ctx.moveTo(0, g.pos * z + 0.5); ctx.lineTo(canvas.getWidth(), g.pos * z + 0.5); }
    ctx.stroke();
  });
  ctx.restore();
}

function pointInFrame(p, f) { return !!f && p.x >= f.x && p.x <= f.x + f.w && p.y >= f.y && p.y <= f.y + f.h; }
function frameImageAt(p, self) {
  const objs = canvas.getObjects();
  for (let i = objs.length - 1; i >= 0; i--) {
    const o = objs[i];
    if (o === self || !o.frameRect) continue;
    if (pointInFrame(p, o.frameRect)) return o;
  }
  return null;
}

/* ════════ CANVAS SIZE (editor) ════════ */
function changeCanvasSize(w, h, key) {
  if (w === CANVAS_W && h === CANVAS_H && key === activeCanvasKey) return;
  const oldW = CANVAS_W, oldH = CANVAS_H;
  const rx = w / oldW, ry = h / oldH;
  CANVAS_W = w; CANVAS_H = h; activeCanvasKey = key;
  suppressCommit = true;
  canvas.getObjects().forEach(o => { if (o.frameRect) return; o.left *= rx; o.top *= ry; o.setCoords(); });
  applyScale();
  const photos = canvas.getObjects('image').filter(o => !o.isSticker);
  if (photos.length) collageLayout();
  else canvas.requestRenderAll();
  suppressCommit = false; commit();
  updatePresetButtons();
  saveDraft();   // size isn't in snapshot(), so persist it explicitly (covers empty canvas)
}
function setCanvasPreset(key) {
  const p = CANVAS_PRESETS[key];
  if (p) changeCanvasSize(p.w, p.h, key);
}
function applyCustomSize() {
  const w = clamp(parseInt(val('tb-cust-w'), 10) || 0, 200, 5000);
  const h = clamp(parseInt(val('tb-cust-h'), 10) || 0, 200, 5000);
  if (!w || !h) return;
  changeCanvasSize(w, h, 'custom');
  $('size-pop').classList.remove('show');
}
function updatePresetButtons() {
  document.querySelectorAll('#preset-group button').forEach(b =>
    b.classList.toggle('active', b.dataset.preset === activeCanvasKey));
  setLabel('preset-dims', `${CANVAS_W} × ${CANVAS_H}`);
}

/* ════════ TEXT STICKER ════════ */
function segVal(group, ds, def) { const b = document.querySelector('#' + group + ' button.active'); return b ? b.dataset[ds] : def; }
function setSegActive(group, ds, v) { document.querySelectorAll('#' + group + ' button').forEach(b => b.classList.toggle('active', b.dataset[ds] === v)); }
function updateBgTypeUI(t) {
  const g = $('bg-grad-ctl'), x = $('bg-tex-ctl');
  if (g) g.style.display = t === 'gradient' ? 'block' : 'none';
  if (x) x.style.display = t === 'texture' ? 'block' : 'none';
}
function gatherTextOptions() {
  return {
    fontFamily: val('text-font'), fontSize: intv('text-size'),
    fill: val('text-color'), opacity: intv('text-opacity') / 100,
    bold: styleActive('bold'), italic: styleActive('italic'),
    underline: styleActive('underline'), linethrough: styleActive('linethrough'),
    strokeOn: chk('stroke-enabled'), strokeColor: val('stroke-color'), strokeWidth: intv('stroke-width'),
    shadowOn: chk('shadow-enabled'), shadowColor: val('shadow-color'),
    shadowBlur: intv('shadow-blur'), shadowX: intv('shadow-x'), shadowY: intv('shadow-y'),
    glowOn: chk('glow-enabled'), glowColor: val('glow-color'), glowSize: intv('glow-size'),
    bgEnabled: chk('bg-enabled'), bgFill: val('bg-color'),
    bgPadX: intv('bg-padx'), bgPadY: intv('bg-pady'), bgRadius: intv('bg-radius'), bgOpacity: intv('bg-opacity'),
    bgType: segVal('bgtype-group', 'bgtype', 'solid'), bgFill2: val('bg-color2'),
    bgAngle: intv('bg-angle'), bgTexture: segVal('bgtex-group', 'tex', 'paper'),
    textAlign: document.querySelector('#align-group button.active').dataset.align,
    lineHeight: parseFloat(val('text-lh')), charSpacing: intv('text-ls'),
  };
}
function textProps(o) {
  return {
    fontFamily: o.fontFamily, fontSize: o.fontSize, fill: o.fill, opacity: o.opacity,
    fontWeight: o.bold ? 'bold' : 'normal', fontStyle: o.italic ? 'italic' : 'normal',
    underline: o.underline, linethrough: o.linethrough,
    stroke: o.strokeOn ? o.strokeColor : '', strokeWidth: o.strokeOn ? o.strokeWidth : 0, paintFirst: 'stroke',
    shadowEnabled: o.shadowOn, shadowColor: o.shadowColor, shadowBlur: o.shadowBlur, shadowX: o.shadowX, shadowY: o.shadowY,
    glowEnabled: o.glowOn, glowColor: o.glowColor, glowSize: o.glowSize,
    bgEnabled: o.bgEnabled, bgFill: o.bgFill, bgFill2: o.bgFill2, bgPadX: o.bgPadX, bgPadY: o.bgPadY, bgRadius: o.bgRadius, bgOpacity: o.bgOpacity,
    bgType: o.bgType, bgAngle: o.bgAngle, bgTexture: o.bgTexture,
    textAlign: o.textAlign, lineHeight: o.lineHeight, charSpacing: o.charSpacing,
    padding: o.bgEnabled ? Math.max(o.bgPadX, o.bgPadY) : 4,
  };
}
function addTextSticker() {
  const text = val('text-input').trim();
  if (!text) return;
  const o = gatherTextOptions();
  const make = () => {
    const t = new PaddedText(text, Object.assign(textProps(o), {
      left: CANVAS_W / 2, top: CANVAS_H / 2, originX: 'center', originY: 'center',
    }));
    canvas.add(t); canvas.setActiveObject(t); canvas.renderAll();
  };
  const spec = `${o.fontSize}px "${o.fontFamily}"`;
  (document.fonts ? document.fonts.load(spec) : Promise.resolve()).then(make).catch(make);
}
function applyControlsToActive() {
  if (suppressSync) return;
  const a = canvas.getActiveObject();
  if (!a || a.type !== 'paddedText') return;
  a.set(textProps(gatherTextOptions()));
  a.initDimensions(); a.setCoords();
  canvas.requestRenderAll();
}
function syncPanelFrom(o) {
  suppressSync = true;
  setVal('text-font', o.fontFamily);
  setVal('text-size', o.fontSize); setLabel('size-val', o.fontSize);
  setVal('text-color', toHex(o.fill));
  setVal('text-opacity', Math.round((o.opacity ?? 1) * 100)); setLabel('op-val', Math.round((o.opacity ?? 1) * 100));
  setStyleActive('bold', o.fontWeight === 'bold');
  setStyleActive('italic', o.fontStyle === 'italic');
  setStyleActive('underline', !!o.underline);
  setStyleActive('linethrough', !!o.linethrough);
  const hasStroke = !!o.stroke && o.strokeWidth > 0;
  setChk('stroke-enabled', hasStroke);
  setVal('stroke-color', toHex(o.stroke || '#ffffff'));
  setVal('stroke-width', o.strokeWidth || 6); setLabel('strokew-val', o.strokeWidth || 6);
  setChk('shadow-enabled', !!o.shadowEnabled);
  setVal('shadow-color', toHex(o.shadowColor));
  setVal('shadow-blur', o.shadowBlur); setLabel('shb-val', o.shadowBlur);
  setVal('shadow-x', o.shadowX); setLabel('shx-val', o.shadowX);
  setVal('shadow-y', o.shadowY); setLabel('shy-val', o.shadowY);
  setChk('glow-enabled', !!o.glowEnabled);
  setVal('glow-color', toHex(o.glowColor));
  setVal('glow-size', o.glowSize); setLabel('glow-val', o.glowSize);
  setChk('bg-enabled', !!o.bgEnabled);
  setVal('bg-color', toHex(o.bgFill));
  setVal('bg-padx', o.bgPadX); setLabel('padx-val', o.bgPadX);
  setVal('bg-pady', o.bgPadY); setLabel('pady-val', o.bgPadY);
  setVal('bg-radius', o.bgRadius); setLabel('rad-val', o.bgRadius);
  setVal('bg-opacity', o.bgOpacity ?? 100); setLabel('bgop-val', o.bgOpacity ?? 100);
  setSegActive('bgtype-group', 'bgtype', o.bgType || 'solid');
  setVal('bg-color2', toHex(o.bgFill2 || '#ffd9c0'));
  setVal('bg-angle', o.bgAngle ?? 135); setLabel('bgang-val', o.bgAngle ?? 135);
  setSegActive('bgtex-group', 'tex', o.bgTexture || 'paper');
  updateBgTypeUI(o.bgType || 'solid');
  setAlign(o.textAlign);
  setVal('text-lh', o.lineHeight); setLabel('lh-val', (+o.lineHeight).toFixed(2));
  setVal('text-ls', o.charSpacing || 0); setLabel('ls-val', o.charSpacing || 0);
  setVal('text-input', o.text);
  $('edit-hint').classList.add('show');
  suppressSync = false;
}
function clearEditState() { $('edit-hint').classList.remove('show'); }
function styleActive(name) { return document.querySelector(`#style-group button[data-style="${name}"]`).classList.contains('active'); }
function setStyleActive(name, on) { document.querySelector(`#style-group button[data-style="${name}"]`).classList.toggle('active', on); }
function setAlign(v) { document.querySelectorAll('#align-group button').forEach(b => b.classList.toggle('active', b.dataset.align === v)); }
function toHex(c) {
  if (!c) return '#000000';
  if (c[0] === '#') return c.length === 4 ? '#' + [...c.slice(1)].map(x => x + x).join('') : c.slice(0, 7);
  const m = c.match(/[\d.]+/g);
  if (!m) return '#000000';
  return '#' + m.slice(0, 3).map(n => Math.round(+n).toString(16).padStart(2, '0')).join('');
}

/* ── Fonts UI ───────────────────────────────────────────── */
function buildFontOptions() {
  const sel = $('text-font');
  FONT_GROUPS.forEach(g => {
    const og = document.createElement('optgroup');
    og.label = g.group;
    g.items.forEach(([family, label]) => og.appendChild(makeFontOption(family, label)));
    sel.appendChild(og);
  });
  sel.value = 'Caveat';
}
function makeFontOption(family, label) {
  const opt = document.createElement('option');
  opt.value = family; opt.textContent = label || family;
  opt.style.fontFamily = `"${family}", sans-serif`;
  return opt;
}
function uploadFont(file) {
  const name = file.name.replace(/\.(ttf|otf|woff2?)$/i, '');
  const reader = new FileReader();
  reader.onload = ev => {
    const ff = new FontFace(name, ev.target.result);
    ff.load().then(loaded => {
      document.fonts.add(loaded);
      const sel = $('text-font');
      let custom = sel.querySelector('optgroup[label="My Fonts"]');
      if (!custom) { custom = document.createElement('optgroup'); custom.label = 'My Fonts'; sel.insertBefore(custom, sel.firstChild); }
      custom.appendChild(makeFontOption(name, name));
      sel.value = name; applyControlsToActive();
    }).catch(() => alert('无法加载该字体文件。'));
  };
  reader.readAsArrayBuffer(file);
}

/* ── Phrase library ─────────────────────────────────────── */
function buildPhrases() {
  const list = $('phrase-list');
  PHRASES.forEach(p => {
    const chip = document.createElement('div');
    chip.className = 'phrase-chip';
    chip.textContent = p;
    chip.addEventListener('click', () => { setVal('text-input', p); addTextSticker(); });
    list.appendChild(chip);
  });
}

/* ── Image sticker (cutout / PNG) ───────────────────────── */
function uploadAsSticker(file) {
  const reader = new FileReader();
  reader.onload = ev => {
    fabric.Image.fromURL(ev.target.result, img => {
      const s = Math.min(420 / img.width, 420 / img.height, 1);
      img.set({ left: CANVAS_W / 2, top: CANVAS_H / 2, originX: 'center', originY: 'center', scaleX: s, scaleY: s, isSticker: true, objectCaching: false });
      canvas.add(img); canvas.setActiveObject(img); canvas.renderAll();
    });
  };
  reader.readAsDataURL(file);
}

/* ── Image upload (collage pool) ────────────────────────── */
function loadImageFile(file) {
  const reader = new FileReader();
  reader.onload = ev => {
    fabric.Image.fromURL(ev.target.result, img => {
      const s = Math.min(700 / img.width, 500 / img.height, 1);
      img.set({ left: Math.random() * Math.max(0, CANVAS_W - img.width * s), top: Math.random() * Math.max(0, CANVAS_H - img.height * s), scaleX: s, scaleY: s, isSticker: false, objectCaching: false });
      canvas.add(img); canvas.renderAll();
      refreshColorCards();
    });
  };
  reader.readAsDataURL(file);
}

/* ══════════ COLOR CARDS ══════════ */
function hex2(n) { return Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0'); }
function rgbToHex(r, g, b) { return '#' + hex2(r) + hex2(g) + hex2(b); }
function hexToRgb(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
function colorDist(a, b) { const x = hexToRgb(a), y = hexToRgb(b); return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]); }

/* Pull the dominant colours out of one image element */
function extractPalette(el, max) {
  const n = 40, c = document.createElement('canvas'); c.width = n; c.height = n;
  const x = c.getContext('2d');
  let d;
  try { x.drawImage(el, 0, 0, n, n); d = x.getImageData(0, 0, n, n).data; } catch (e) { return []; }
  const buckets = new Map();
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] < 128) continue;
    const r = d[i], g = d[i + 1], b = d[i + 2];
    const key = (r >> 4 << 8) | (g >> 4 << 4) | (b >> 4);
    const e = buckets.get(key) || { r: 0, g: 0, b: 0, n: 0 };
    e.r += r; e.g += g; e.b += b; e.n++; buckets.set(key, e);
  }
  const arr = [...buckets.values()].map(e => ({ hex: rgbToHex(e.r / e.n, e.g / e.n, e.b / e.n), n: e.n })).sort((p, q) => q.n - p.n);
  const out = [];
  for (const e of arr) { if (out.every(h => colorDist(h, e.hex) > 44)) { out.push(e.hex); if (out.length >= (max || 6)) break; } }
  return out;
}

/* Recompute the suggested swatches from all uploaded photos (not stickers/colour-cards) */
function refreshColorCards() {
  const photos = canvas.getObjects('image').filter(o => !o.isSticker && !o.isColorCard);
  const agg = [];
  photos.forEach(o => { const el = o.getElement && o.getElement(); if (el) extractPalette(el, 4).forEach(h => agg.push(h)); });
  const uniq = [];
  agg.forEach(h => { if (uniq.every(u => colorDist(u, h) > 40)) uniq.push(h); });
  if (uniq.length >= 3) suggestedColors = uniq.slice(0, 6);
  else suggestedColors = uniq.concat(COLOR_DEFAULTS).filter((h, i, a) => a.indexOf(h) === i).slice(0, 6);
  if (!suggestedColors.length) suggestedColors = COLOR_DEFAULTS.slice();
  renderColorCards();
  renderDecorSwatches();
}

/* Set the shared current colour (decor-color is the single source of truth) */
function setCurrentColor(hex) {
  setVal('decor-color', hex);
  $('decor-color').dispatchEvent(new Event('input', { bubbles: true }));
}

function renderColorCards() {
  const box = $('color-cards'); if (!box) return;
  box.innerHTML = '';
  suggestedColors.forEach(hex => {
    const sw = document.createElement('div');
    sw.className = 'swatch'; sw.style.background = hex; sw.title = hex + ' — 设为当前颜色';
    sw.addEventListener('click', () => {
      setCurrentColor(hex);
      sw.classList.add('flash'); setTimeout(() => sw.classList.remove('flash'), 550);
    });
    box.appendChild(sw);
  });
}

/* Eyedropper: sample a pixel from the rendered board into the current colour */
function startEyedropper() {
  picking = true;
  document.body.classList.add('picking');
  const b = $('decor-eyedropper'); if (b) b.classList.add('active');
  canvas.defaultCursor = 'crosshair'; canvas.hoverCursor = 'crosshair'; canvas.selection = false;
  showPickingBar();
}
function stopEyedropper() {
  picking = false; document.body.classList.remove('picking');
  const b = $('decor-eyedropper'); if (b) b.classList.remove('active');
  canvas.defaultCursor = 'default'; canvas.hoverCursor = 'move'; canvas.selection = true;
  hidePickingBar();
}
function showPickingBar() {
  let bar = document.getElementById('picking-bar');
  if (!bar) {
    bar = document.createElement('div'); bar.id = 'picking-bar'; bar.className = 'picking-bar cn';
    bar.innerHTML = '<span class="pb-dot"></span><span>点击照片取色</span><button class="pb-cancel cn" type="button">取消</button>';
    ($('app') || document.body).appendChild(bar);
    bar.querySelector('.pb-cancel').addEventListener('click', stopEyedropper);
  }
  bar.classList.add('show');
}
function hidePickingBar() { const bar = document.getElementById('picking-bar'); if (bar) bar.classList.remove('show'); }

/* ── Decor: thin line / dot / number ──────────────────────── */
function renderDecorSwatches() {
  const box = $('decor-swatches'); if (!box) return;
  box.innerHTML = '';
  suggestedColors.forEach(hex => {
    const sw = document.createElement('div');
    sw.className = 'swatch'; sw.style.background = hex; sw.title = hex + ' — 设为当前颜色';
    sw.addEventListener('click', () => setCurrentColor(hex));
    box.appendChild(sw);
  });
}
function placeDecor(obj) {
  obj.set({ left: CANVAS_W / 2 + (Math.random() - 0.5) * 300, top: CANVAS_H / 2 + (Math.random() - 0.5) * 200, isSticker: true });
  canvas.add(obj); canvas.setActiveObject(obj); canvas.renderAll();
}
function addDecorLine() {
  const len = CANVAS_W * 0.16;
  const sw = Math.round(+val('decor-line-width') * (CANVAS_W / 1920));
  placeDecor(new fabric.Line([0, 0, len, 0], { stroke: val('decor-color'), strokeWidth: Math.max(2, sw), strokeUniform: true, strokeLineCap: 'round', originX: 'center', originY: 'center', isDecorLine: true }));
}
function addDecorDot() {
  placeDecor(new fabric.Circle({ radius: Math.max(8, Math.round(CANVAS_W * 0.012)), fill: val('decor-color'), originX: 'center', originY: 'center' }));
}
function addDecorNumber() {
  decorNum += 1;
  placeDecor(new fabric.IText(String(decorNum), { fill: val('decor-color'), fontFamily: 'Hanken Grotesk, Inter, sans-serif', fontWeight: '600', fontSize: Math.round(CANVAS_W * 0.05), originX: 'center', originY: 'center', objectCaching: false }));
}

/* ── Download the selected text sticker as a transparent PNG ── */
function downloadSticker(obj) {
  if (!obj || obj.type !== 'paddedText') return;
  obj.clone(clone => {
    clone.set({ angle: 0 });
    const w = clone.width + (clone.bgEnabled ? clone.bgPadX * 2 : 0);
    const h = clone.height + (clone.bgEnabled ? clone.bgPadY * 2 : 0);
    const extra = Math.max(
      clone.shadowEnabled ? clone.shadowBlur * 1.5 + Math.abs(clone.shadowX) + Math.abs(clone.shadowY) : 0,
      clone.glowEnabled ? clone.glowSize * 1.5 : 0, 6);
    const m = 3;
    const cw = Math.ceil((w + extra * 2) * m), ch = Math.ceil((h + extra * 2) * m);
    const tmp = new fabric.StaticCanvas(null, { width: cw, height: ch, enableRetinaScaling: false });
    clone.set({ originX: 'center', originY: 'center', left: cw / 2, top: ch / 2, scaleX: m, scaleY: m, objectCaching: false });
    tmp.add(clone); tmp.renderAll();
    const url = tmp.toDataURL({ format: 'png' });
    tmp.dispose();
    const a = document.createElement('a'); a.download = 'text-sticker.png'; a.href = url;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }, ['bgEnabled', 'bgFill', 'bgFill2', 'bgType', 'bgAngle', 'bgTexture', 'bgPadX', 'bgPadY', 'bgRadius', 'bgOpacity',
      'shadowEnabled', 'shadowColor', 'shadowBlur', 'shadowX', 'shadowY', 'glowEnabled', 'glowColor', 'glowSize']);
}
function sampleColorAt(e) {
  const src = (e.touches || e.changedTouches) ? (e.touches && e.touches[0]) || e.changedTouches[0] : e;
  const lc = canvas.lowerCanvasEl, rect = lc.getBoundingClientRect();
  const px = Math.round((src.clientX - rect.left) * (lc.width / rect.width));
  const py = Math.round((src.clientY - rect.top) * (lc.height / rect.height));
  try { const d = lc.getContext('2d').getImageData(px, py, 1, 1).data; return rgbToHex(d[0], d[1], d[2]); } catch (err) { return null; }
}

/* ── Delete / layer order ───────────────────────────────── */
function deleteActive() {
  const a = canvas.getActiveObject();
  if (!a || a.isEditing) return;
  if (a.type === 'activeSelection') { a.forEachObject(o => canvas.remove(o)); canvas.discardActiveObject(); }
  else canvas.remove(a);
  canvas.renderAll();
}
function layerOp(fn) { const a = canvas.getActiveObject(); if (!a) return; fn(a); canvas.renderAll(); commit(); }

/* ── Context menu ───────────────────────────────────────── */
function showCtxMenu(x, y, target) {
  const isText = !!(target && target.type === 'paddedText');
  $('ctx-edit').classList.toggle('hidden', !isText);
  $('ctx-download').classList.toggle('hidden', !isText);
  const m = $('ctx-menu');
  m.style.display = 'block'; m.style.left = x + 'px'; m.style.top = y + 'px';
}
function hideCtxMenu() { $('ctx-menu').style.display = 'none'; }

/* ── Export ─────────────────────────────────────────────── */
function exportPNG() {
  const btn = $('btn-export');
  btn.disabled = true; btn.textContent = '导出中…';
  // crisp where it's safe: 2x unless the long edge would exceed 4096px
  const mult = Math.max(CANVAS_W, CANVAS_H) <= 4096 ? 2 : 1;
  // let the "导出中…" label paint before the synchronous toDataURL blocks the thread
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const curZoom = canvas.getZoom(), curW = canvas.getWidth(), curH = canvas.getHeight();
    canvas.discardActiveObject();
    canvas.setZoom(1); canvas.setWidth(CANVAS_W); canvas.setHeight(CANVAS_H); canvas.renderAll();
    let dataURL;
    try { dataURL = canvas.toDataURL({ format: 'png', multiplier: mult }); }
    finally {
      canvas.setWidth(curW); canvas.setHeight(curH); canvas.setZoom(curZoom); canvas.renderAll();
      btn.disabled = false; btn.textContent = '导出 PNG';
    }
    if (!dataURL) return;
    const a = document.createElement('a');
    a.download = 'vision-board-wallpaper.png'; a.href = dataURL;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    showToast('已导出 ' + (CANVAS_W * mult) + ' × ' + (CANVAS_H * mult) + ' PNG');
  }));
}

/* ══════════ Welcome — immersive landing ══════════ */
function initWelcome() {
  const welcome = $('welcome');
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // CTAs -> editor
  ['btn-start-hero'].forEach(id => {
    const el = $(id);
    if (el) el.addEventListener('click', e => {
      e.preventDefault();
      el.classList.remove('tap'); void el.offsetWidth; el.classList.add('tap');  // micro feedback
      setTimeout(enterEditor, 240);
    });
  });

  if (reduced) {
    welcome.classList.add('reduced');
    const pre = $('preloader'); if (pre) pre.style.display = 'none';
    welcome.querySelectorAll('.tline-in').forEach(el => el.classList.add('show'));
    welcome.querySelectorAll('.rfade, .rfade-scroll').forEach(el => el.classList.add('show', 'in'));
    const sh = $('scroll-hint'); if (sh) sh.classList.add('show');
    return;
  }

  /* ---- flowing-gradient WebGL ---- */
  let gl = null, prog = null, uTime, uRes, uScroll, uMouse, glW = 1, glH = 1, glTime = 0;
  const canvas = $('gradient-canvas');
  (function initGL() {
    try { gl = canvas.getContext('webgl', { antialias: false, alpha: false }) || canvas.getContext('experimental-webgl'); } catch (e) {}
    if (!gl) { welcome.classList.add('no-webgl'); canvas.style.display = 'none'; return; }
    const vs = 'attribute vec2 a; void main(){ gl_Position = vec4(a,0.0,1.0); }';
    const fs = `precision mediump float;
      uniform float u_time; uniform vec2 u_res; uniform float u_scroll; uniform vec2 u_mouse;
      vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
      vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
      vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
      float snoise(vec2 v){
        const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
        vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
        vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
        vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod289(i);
        vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
        vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0); m=m*m; m=m*m;
        vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 a0=x-ox;
        m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
        vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw; return 130.0*dot(m,g);
      }
      void main(){
        vec2 uv=gl_FragCoord.xy/u_res; float asp=u_res.x/u_res.y; vec2 p=vec2(uv.x*asp,uv.y);
        vec2 m=vec2(u_mouse.x*asp,u_mouse.y);
        float t=u_time*0.06;
        vec2 warp=(m-vec2(0.5*asp,0.5))*0.55;           // flow follows the cursor
        float n1=snoise(p*1.1+warp+vec2(t*0.8,t*0.6));
        float n2=snoise(p*1.9-warp*0.6+vec2(-t*0.5,t*0.4)+n1*0.5);
        float n3=snoise(p*0.6+warp*0.4+vec2(t*0.3,-t*0.25)+n2*0.35);
        vec3 porcelain=vec3(0.969,0.945,0.925), pink=vec3(0.929,0.796,0.812),
             violet=vec3(0.851,0.827,0.918), gold=vec3(0.941,0.875,0.769);
        vec3 col=porcelain;
        col=mix(col,violet,smoothstep(0.12,0.82,0.5+0.5*n1));
        col=mix(col,pink,smoothstep(0.25,0.92,0.5+0.5*n2)*0.82);
        col=mix(col,gold,smoothstep(0.42,1.0,0.5+0.5*n3)*0.72);
        vec2 core=vec2(0.5*asp,0.66-u_scroll*0.18)+(m-vec2(0.5*asp,0.5))*0.35;
        float breathe=0.9+0.1*sin(u_time*0.6);
        float glow=smoothstep(0.6*breathe,0.0,distance(p,core));
        col=mix(col,mix(vec3(1.0),gold,0.25),glow*0.55*breathe);
        float mb=smoothstep(0.42,0.0,distance(p,m));    // soft bloom at the cursor
        col=mix(col,mix(vec3(1.0),pink,0.3),mb*0.16);
        float tz=smoothstep(0.55,0.0,distance(uv,vec2(0.5,0.4)));
        col=mix(col,porcelain,tz*0.12);
        gl_FragColor=vec4(col,1.0);
      }`;
    function sh(type, src) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
    prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { gl = null; welcome.classList.add('no-webgl'); canvas.style.display = 'none'; return; }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    uTime = gl.getUniformLocation(prog, 'u_time');
    uRes = gl.getUniformLocation(prog, 'u_res');
    uScroll = gl.getUniformLocation(prog, 'u_scroll');
    uMouse = gl.getUniformLocation(prog, 'u_mouse');
    resizeGL();
    gl.clearColor(0.969, 0.945, 0.925, 1.0); gl.clear(gl.COLOR_BUFFER_BIT); // porcelain, avoids a black first frame
  })();
  function resizeGL() {
    if (!gl) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * (window.innerWidth <= 820 ? 0.5 : 1);
    glW = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    glH = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    canvas.width = glW; canvas.height = glH;
    gl.viewport(0, 0, glW, glH);
  }

  /* ---- lerp smooth scroll + parallax ---- */
  const track = $('w-track'), vp = $('w-viewport'), hint = $('scroll-hint');
  const parallaxEls = [...document.querySelectorAll('.vcard[data-speed]')];
  const revealEls = [...welcome.querySelectorAll('.rfade-scroll')];
  let scTarget = 0, scCurrent = 0, scMax = 0;
  function recalc() { scMax = Math.max(0, track.scrollHeight - vp.clientHeight); }
  function onWheel(e) { if (welcomeEntered) return; scTarget = clamp(scTarget + e.deltaY, 0, scMax); }
  let ty = 0;
  function onTouchStart(e) { ty = e.touches[0].clientY; }
  function onTouchMove(e) { const y = e.touches[0].clientY; scTarget = clamp(scTarget + (ty - y) * 1.4, 0, scMax); ty = y; }
  window.addEventListener('wheel', onWheel, { passive: true });
  vp.addEventListener('touchstart', onTouchStart, { passive: true });
  vp.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('resize', resizeGL);
  window.addEventListener('resize', recalc);
  recalc(); setTimeout(recalc, 500); setTimeout(recalc, 1500);

  /* ---- mouse-following flow + title link ---- */
  const heroTitle = $('hero-title');
  let mTX = 0.5, mTY = 0.5, mX = 0.5, mY = 0.5;
  function onMouse(e) {
    const t = e.touches ? e.touches[0] : e;
    mTX = t.clientX / window.innerWidth;
    mTY = t.clientY / window.innerHeight;
  }
  window.addEventListener('mousemove', onMouse, { passive: true });
  window.addEventListener('touchmove', onMouse, { passive: true });

  let raf = null, lastTs = 0, running = true, lastCW = 0;
  function loop(ts) {
    if (!running) return;
    if (gl && canvas.clientWidth && canvas.clientWidth !== lastCW) { lastCW = canvas.clientWidth; resizeGL(); }
    scCurrent += (scTarget - scCurrent) * 0.075;
    if (Math.abs(scTarget - scCurrent) < 0.04) scCurrent = scTarget;
    if (track) track.style.transform = `translate3d(0,${-scCurrent}px,0)`;
    parallaxEls.forEach(el => { const s = parseFloat(el.dataset.speed) || 0; el.style.transform = `translateY(${scCurrent * s}px)`; });
    revealEls.forEach(el => { if (el.getBoundingClientRect().top < window.innerHeight * 0.85) el.classList.add('in'); });
    if (hint) hint.classList.toggle('gone', scCurrent > 40);
    // ease the mouse toward its target (smooth, no jank)
    mX += (mTX - mX) * 0.06;
    mY += (mTY - mY) * 0.06;
    if (heroTitle) heroTitle.style.transform = `translate3d(${(mX - 0.5) * 30}px, ${(mY - 0.5) * 18}px, 0)`;
    if (gl && !document.hidden) {
      const dt = lastTs ? (ts - lastTs) / 1000 : 0;
      glTime += Math.min(dt, 0.05);
      gl.uniform1f(uTime, glTime);
      gl.uniform1f(uScroll, scMax ? scCurrent / scMax : 0);
      gl.uniform2f(uMouse, mX, 1.0 - mY);
      gl.uniform2f(uRes, glW, glH);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    lastTs = ts;
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);

  /* teardown handle for enterEditor */
  landingTeardown = function () {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('mousemove', onMouse);
    window.removeEventListener('touchmove', onMouse);
    window.removeEventListener('resize', resizeGL);
    window.removeEventListener('resize', recalc);
    vp.removeEventListener('touchstart', onTouchStart);
    vp.removeEventListener('touchmove', onTouchMove);
    if (gl) { const ext = gl.getExtension('WEBGL_lose_context'); if (ext) ext.loseContext(); }
  };

  /* ---- preloader → reveal choreography ---- */
  const start = () => {
    const plw = welcome.querySelector('.pl-stack'); if (plw) plw.classList.add('show');
    setTimeout(() => { const pre = $('preloader'); if (pre) pre.classList.add('out'); }, 1900);
    setTimeout(() => {
      welcome.querySelectorAll('.tline-in').forEach((el, i) => setTimeout(() => el.classList.add('show'), i * 130));
      welcome.querySelectorAll('.rfade').forEach(el => { el.style.setProperty('--d', el.dataset.d || 0); el.classList.add('show'); });
      const sh = $('scroll-hint'); if (sh) sh.classList.add('show');
    }, 2400);
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => setTimeout(start, 200));
  else setTimeout(start, 350);
}

function enterEditor() {
  if (welcomeEntered) return;
  welcomeEntered = true;
  if (landingTeardown) { landingTeardown(); landingTeardown = null; }
  CANVAS_W = CANVAS_PRESETS.landscape.w;
  CANVAS_H = CANVAS_PRESETS.landscape.h;
  activeCanvasKey = 'landscape';
  const w = $('welcome');
  w.classList.add('leaving');
  setTimeout(() => { w.style.display = 'none'; }, 700);
  $('app').classList.remove('hidden');
  setTimeout(() => {
    layoutEditor();
    applyScale();
    updatePresetButtons();
    initEditorBg();
    initTooltips();
    restoreDraftOrInit();
  }, 80);
}

/* Distribute tools: top (colors/decor/sticker), left (text), right (tips) on
   desktop; restore into the bottom-drawer accordions on mobile. Moving the
   body nodes preserves every control's listeners. */
function layoutEditor() {
  const desktop = window.innerWidth > 820;
  if (desktop) {
    const top = $('ed-top');
    ['body-colors', 'body-decor', 'body-image'].forEach(id => { const el = $(id); if (el && el.parentElement !== top) top.appendChild(el); });
    const tips = $('ed-tips'), tb = $('body-tips'); if (tb && tb.parentElement !== tips) tips.appendChild(tb);
    ['acc-image', 'acc-colors', 'acc-decor', 'acc-tips'].forEach(id => { const a = $(id); if (a) a.style.display = 'none'; });
    const at = $('acc-text'); if (at) at.style.display = '';
  } else {
    [['acc-colors', 'body-colors'], ['acc-decor', 'body-decor'], ['acc-image', 'body-image'], ['acc-tips', 'body-tips']]
      .forEach(([accId, bodyId]) => { const a = $(accId), b = $(bodyId); if (a && b && b.parentElement !== a) a.appendChild(b); if (a) a.style.display = ''; });
    const t = $('ed-tips'); if (t) t.classList.remove('open');
    const ap = $('app'); if (ap) ap.classList.remove('tips-open', 'text-open');
  }
}

/* Replace native title tooltips with refined translucent cards */
let tooltipsInit = false;
function initTooltips() {
  if (tooltipsInit) return; tooltipsInit = true;
  const tip = document.createElement('div'); tip.className = 'tooltip-card'; document.body.appendChild(tip);
  document.querySelectorAll('#app [title]').forEach(el => {
    const text = el.getAttribute('title'); if (!text) return;
    el.removeAttribute('title'); el.dataset.tip = text;
    el.addEventListener('mouseenter', () => {
      tip.textContent = el.dataset.tip;
      const r = el.getBoundingClientRect();
      tip.style.left = (r.left + r.width / 2) + 'px';
      tip.style.top = (r.bottom + 8) + 'px';
      tip.classList.add('show');
    });
    el.addEventListener('mouseleave', () => tip.classList.remove('show'));
  });
}

/* ── Editor background: soft flowing gradient (static, no mouse) ── */
let editorBgStarted = false;
function initEditorBg() {
  if (editorBgStarted) return; editorBgStarted = true;
  const cv = $('editor-bg'); if (!cv) return;
  let gl;
  try { gl = cv.getContext('webgl', { antialias: false, alpha: false }) || cv.getContext('experimental-webgl'); } catch (e) {}
  if (!gl) { cv.style.display = 'none'; return; }
  const vs = 'attribute vec2 a; void main(){ gl_Position = vec4(a,0.0,1.0); }';
  const fs = `precision mediump float; uniform float u_time; uniform vec2 u_res;
    vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
    float snoise(vec2 v){const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
      vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
      vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod289(i);
      vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
      vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);m=m*m;m=m*m;
      vec3 x=2.0*fract(p*C.www)-1.0;vec3 h=abs(x)-0.5;vec3 ox=floor(x+0.5);vec3 a0=x-ox;
      m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
      vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;return 130.0*dot(m,g);}
    void main(){
      vec2 uv=gl_FragCoord.xy/u_res; float asp=u_res.x/u_res.y; vec2 p=vec2(uv.x*asp,uv.y);
      float t=u_time*0.05;
      float n1=snoise(p*1.0+vec2(t*0.7,t*0.5));
      float n2=snoise(p*1.7+vec2(-t*0.45,t*0.35)+n1*0.5);
      float n3=snoise(p*0.55+vec2(t*0.25,-t*0.2)+n2*0.35);
      vec3 porcelain=vec3(0.969,0.945,0.925),pink=vec3(0.929,0.796,0.812),violet=vec3(0.851,0.827,0.918),gold=vec3(0.941,0.875,0.769);
      vec3 col=porcelain;
      col=mix(col,violet,smoothstep(0.15,0.85,0.5+0.5*n1));
      col=mix(col,pink,smoothstep(0.30,0.95,0.5+0.5*n2)*0.7);
      col=mix(col,gold,smoothstep(0.45,1.0,0.5+0.5*n3)*0.6);
      gl_FragColor=vec4(col,1.0);
    }`;
  function sh(type, src) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { cv.style.display = 'none'; return; }
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uTime = gl.getUniformLocation(prog, 'u_time'), uRes = gl.getUniformLocation(prog, 'u_res');
  let gw = 1, gh = 1, lastCW = 0;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * (window.innerWidth <= 820 ? 0.6 : 1);
    gw = Math.max(1, Math.floor(cv.clientWidth * dpr)); gh = Math.max(1, Math.floor(cv.clientHeight * dpr));
    cv.width = gw; cv.height = gh; gl.viewport(0, 0, gw, gh);
  }
  resize();
  gl.clearColor(0.969, 0.945, 0.925, 1.0); gl.clear(gl.COLOR_BUFFER_BIT);
  window.addEventListener('resize', resize);
  let t0 = 0, gt = 0;
  function loop(ts) {
    if (cv.clientWidth && cv.clientWidth !== lastCW) { lastCW = cv.clientWidth; resize(); }
    if (!document.hidden) {
      const dt = t0 ? (ts - t0) / 1000 : 0; gt += Math.min(dt, 0.05);
      gl.uniform1f(uTime, gt); gl.uniform2f(uRes, gw, gh);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    t0 = ts; requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* ── Sidebar resize / collapse (desktop) ────────────────── */
const SIDEBAR_MIN = 264, SIDEBAR_MAX = 560;
function initSidebarResize() {
  const sb = $('sidebar'), rez = $('resizer'), app = $('app');
  let dragging = false, startX = 0, startW = 0;
  rez.addEventListener('mousedown', e => {
    if (window.innerWidth <= 820) return;
    dragging = true; startX = e.clientX; startW = sb.offsetWidth;
    document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none';
    e.preventDefault();
  });
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    const w = clamp(startW + (e.clientX - startX), SIDEBAR_MIN, SIDEBAR_MAX);
    sb.style.width = w + 'px';
    applyScale();
  });
  window.addEventListener('mouseup', () => {
    if (dragging) { dragging = false; document.body.style.cursor = ''; document.body.style.userSelect = ''; }
  });
  const toggle = () => { app.classList.toggle('panel-collapsed'); setTimeout(applyScale, 260); };
  $('collapse-btn').addEventListener('click', toggle);
  $('resizer-collapse').addEventListener('click', toggle);
}

/* ── Event binding ──────────────────────────────────────── */
function bindEvents() {
  $('btn-upload').addEventListener('click', () => $('file-input').click());
  $('file-input').addEventListener('change', e => { Array.from(e.target.files).forEach(loadImageFile); e.target.value = ''; });
  $('btn-mosaic').addEventListener('click', collageLayout);
  $('btn-lock-layout').addEventListener('click', toggleLayoutLock);
  $('btn-export').addEventListener('click', exportPNG);
  $('btn-new').addEventListener('click', newCanvas);
  $('btn-undo').addEventListener('click', undo);
  $('btn-redo').addEventListener('click', redo);

  // Canvas size: shape presets + custom popup
  document.querySelectorAll('#preset-group button').forEach(b =>
    b.addEventListener('click', () => setCanvasPreset(b.dataset.preset)));
  $('size-custom-btn').addEventListener('click', e => { e.stopPropagation(); $('size-pop').classList.toggle('show'); });
  $('tb-cust-apply').addEventListener('click', applyCustomSize);
  document.addEventListener('click', e => {
    if (!e.target.closest('.size-control')) $('size-pop').classList.remove('show');
    if (!e.target.closest('.mosaic-group')) { const p = $('mosaic-pop'); if (p) p.classList.remove('show'); }
  });

  // Collage edge-style popover (压边 / 平铺 / 留白)
  // Lift it out of the topbar's stacking context (z-index:2) so its own
  // z-index can sit above the .main preview layer — otherwise .main covers it
  // and swallows the clicks. Re-parent to .app to keep the editor's light vars.
  const mosaicPop = $('mosaic-pop');
  if (mosaicPop && mosaicPop.parentElement.id !== 'app') $('app').appendChild(mosaicPop);
  $('mosaic-opt-btn').addEventListener('click', e => {
    e.stopPropagation();
    const pop = $('mosaic-pop');
    if (pop.classList.contains('show')) { pop.classList.remove('show'); return; }
    pop.classList.add('show');
    const r = $('mosaic-opt-btn').getBoundingClientRect();
    const pw = pop.offsetWidth;
    pop.style.left = clamp(r.right - pw, 8, window.innerWidth - pw - 8) + 'px';
    pop.style.top = (r.bottom + 8) + 'px';
  });
  document.querySelectorAll('#edge-group button').forEach(b =>
    b.addEventListener('click', () => setCollageEdge(b.dataset.edge)));
  setSegActive('edge-group', 'edge', collageEdge);
  setLabel('edge-hint', EDGE_HINTS[collageEdge]);

  // Tabs
  document.querySelectorAll('#text-tabs button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('#text-tabs button').forEach(x => x.classList.toggle('active', x === b));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.toggle('active', p.dataset.pane === b.dataset.tab));
  }));

  $('btn-add-text').addEventListener('click', addTextSticker);

  ['text-font', 'text-color', 'stroke-color', 'shadow-color', 'glow-color', 'bg-color', 'bg-color2']
    .forEach(id => $(id).addEventListener('input', applyControlsToActive));
  ['stroke-enabled', 'shadow-enabled', 'glow-enabled', 'bg-enabled']
    .forEach(id => $(id).addEventListener('change', applyControlsToActive));

  const ranges = [
    ['text-size', 'size-val'], ['text-opacity', 'op-val'], ['stroke-width', 'strokew-val'],
    ['shadow-blur', 'shb-val'], ['shadow-x', 'shx-val'], ['shadow-y', 'shy-val'],
    ['glow-size', 'glow-val'], ['bg-padx', 'padx-val'], ['bg-pady', 'pady-val'],
    ['bg-radius', 'rad-val'], ['bg-opacity', 'bgop-val'], ['bg-angle', 'bgang-val'], ['text-ls', 'ls-val'],
  ];
  ranges.forEach(([id, lbl]) => $(id).addEventListener('input', () => { setLabel(lbl, val(id)); applyControlsToActive(); }));
  $('text-lh').addEventListener('input', () => { setLabel('lh-val', (+val('text-lh')).toFixed(2)); applyControlsToActive(); });

  // Background type + texture
  document.querySelectorAll('#bgtype-group button').forEach(b =>
    b.addEventListener('click', () => { setSegActive('bgtype-group', 'bgtype', b.dataset.bgtype); updateBgTypeUI(b.dataset.bgtype); applyControlsToActive(); }));
  document.querySelectorAll('#bgtex-group button').forEach(b =>
    b.addEventListener('click', () => { setSegActive('bgtex-group', 'tex', b.dataset.tex); applyControlsToActive(); }));

  document.querySelectorAll('#style-group button').forEach(b =>
    b.addEventListener('click', () => { b.classList.toggle('active'); applyControlsToActive(); }));
  document.querySelectorAll('#align-group button').forEach(b =>
    b.addEventListener('click', () => { setAlign(b.dataset.align); applyControlsToActive(); }));

  $('text-input').addEventListener('input', () => {
    if (suppressSync) return;
    const a = canvas.getActiveObject();
    if (a && a.type === 'paddedText') { a.set('text', val('text-input')); a.initDimensions(); a.setCoords(); canvas.requestRenderAll(); }
  });

  $('btn-font-upload').addEventListener('click', () => $('font-file-input').click());
  $('font-file-input').addEventListener('change', e => { if (e.target.files[0]) uploadFont(e.target.files[0]); e.target.value = ''; });

  const dz = $('sticker-drop');
  dz.addEventListener('click', () => $('sticker-file-input').click());
  $('sticker-file-input').addEventListener('change', e => { Array.from(e.target.files).forEach(uploadAsSticker); e.target.value = ''; });
  ['dragenter', 'dragover'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add('dragover'); }));
  ['dragleave', 'dragend'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove('dragover'); }));
  dz.addEventListener('drop', e => {
    e.preventDefault(); dz.classList.remove('dragover');
    const files = [...(e.dataTransfer ? e.dataTransfer.files : [])].filter(f => f.type.startsWith('image/'));
    files.forEach(uploadAsSticker);
  });

  // Eyedropper -> current colour
  canvas.on('mouse:down', opt => {
    if (!picking) return;
    const hex = sampleColorAt(opt.e);
    if (hex) setCurrentColor(hex);
    canvas.discardActiveObject();
    stopEyedropper();
    canvas.requestRenderAll();
  });

  // Decor (line / dot / number)
  $('decor-line').addEventListener('click', addDecorLine);
  $('decor-dot').addEventListener('click', addDecorDot);
  $('decor-eyedropper').addEventListener('click', () => { picking ? stopEyedropper() : startEyedropper(); });
  $('decor-line-width').addEventListener('input', () => {
    setLabel('linew-val', val('decor-line-width'));
    const a = canvas.getActiveObject();
    if (a && a.isDecorLine) {
      a.set('strokeWidth', Math.max(2, Math.round(+val('decor-line-width') * (CANVAS_W / 1920))));
      canvas.requestRenderAll();
    }
  });
  $('decor-line-width').addEventListener('change', () => { const a = canvas.getActiveObject(); if (a && a.isDecorLine) commit(); });
  // current colour applies live to a selected decor line / dot
  $('decor-color').addEventListener('input', () => {
    const a = canvas.getActiveObject();
    if (!a) return;
    if (a.isDecorLine) { a.set('stroke', val('decor-color')); canvas.requestRenderAll(); }
    else if (a.type === 'circle' && a.isSticker) { a.set('fill', val('decor-color')); canvas.requestRenderAll(); }
  });

  // right-edge Tips toggle (shows the text on the background; the canvas
  // yields the right margin so the text always sits on the gradient)
  $('ed-tips-label').addEventListener('click', () => {
    const open = $('ed-tips').classList.toggle('open');
    $('app').classList.toggle('tips-open', open);
    applyScale();
  });
  window.addEventListener('resize', layoutEditor);

  // Tool popovers: only one open at a time (desktop floating popovers)
  document.querySelectorAll('#sidebar .acc').forEach(acc => acc.addEventListener('toggle', () => {
    if (acc.open) document.querySelectorAll('#sidebar .acc[open]').forEach(o => { if (o !== acc) o.open = false; });
  }));

  // Text panel pushes the canvas right on desktop (mirror of the Tips push)
  $('acc-text').addEventListener('toggle', () => {
    if (window.innerWidth <= 820) return;
    $('app').classList.toggle('text-open', $('acc-text').open);
    applyScale();
  });

  // Selection sync
  canvas.on('selection:created', e => onSelect(e.selected && e.selected[0]));
  canvas.on('selection:updated', e => onSelect(e.selected && e.selected[0]));
  canvas.on('selection:cleared', clearEditState);

  // Hovering the selected object slightly emphasises its handles
  canvas.on('mouse:over', e => {
    const a = canvas.getActiveObject();
    if (a && e.target === a) { a.set({ cornerColor: 'rgba(255,255,255,0.85)', borderColor: 'rgba(183,168,185,0.95)' }); canvas.requestRenderAll(); }
  });
  canvas.on('mouse:out', e => {
    const a = canvas.getActiveObject();
    if (a && e.target === a) { a.set({ cornerColor: 'rgba(255,255,255,0.55)', borderColor: 'rgba(183,168,185,0.75)' }); canvas.requestRenderAll(); }
  });

  // History triggers
  canvas.on('object:added', commit);
  canvas.on('object:removed', commit);
  canvas.on('object:modified', commit);

  // Empty-state guide: visible until the canvas holds something
  canvas.on('object:added', updateEmptyState);
  canvas.on('object:removed', updateEmptyState);
  $('canvas-empty-upload').addEventListener('click', () => $('file-input').click());

  // Alignment hints for floating elements (stickers / text / decor)
  canvas.on('object:moving', e => updateAlignGuides(e.target));
  canvas.on('after:render', drawAlignGuides);
  canvas.on('mouse:up', clearAlignGuides);

  // Framed-photo drag: pan within frame, or drag onto another photo to swap
  canvas.on('object:moving', e => {
    const o = e.target;
    if (!o || !o.frameRect) return;
    if (!o.__dragStarted) { o.__dragStarted = true; o.__homeFrame = { ...o.frameRect }; activeFrameDrag = o; }
    const p = canvas.getPointer(e.e);
    const inOwn = pointInFrame(p, o.__homeFrame);
    if (o.__float) return;
    if (inOwn) enforceFrame(o);
    else { o.__float = true; o.__savedClip = o.clipPath; o.clipPath = null; o.set('opacity', 0.7); o.bringToFront(); }
  });
  canvas.on('object:scaling', e => { const o = e.target; if (o && o.frameRect && !o.__float) enforceFrame(o); });
  canvas.on('mouse:up', e => {
    const o = activeFrameDrag; if (!o) return;
    if (o.__float) {
      o.set('opacity', 1);
      const p = canvas.getPointer(e.e);
      const target = frameImageAt(p, o);
      if (target) { const a = { ...o.__homeFrame }, b = { ...target.frameRect }; placeInFrame(target, a); placeInFrame(o, b); }
      else placeInFrame(o, o.__homeFrame);
    } else enforceFrame(o);
    delete o.__dragStarted; delete o.__float; delete o.__homeFrame; delete o.__savedClip;
    activeFrameDrag = null;
    canvas.requestRenderAll(); commit();
  });

  // Keyboard
  document.addEventListener('keydown', e => {
    const tag = document.activeElement.tagName;
    const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    const a = canvas.getActiveObject();
    const editing = a && a.isEditing;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { if (typing || editing) return; e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') { if (typing || editing) return; e.preventDefault(); redo(); return; }
    if (typing || editing) return;
    if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); deleteActive(); }
    if (e.key === 'Escape') { hideCtxMenu(); if (picking) stopEyedropper(); const mp = $('mosaic-pop'); if (mp) mp.classList.remove('show'); }
  });

  // Right-click menu
  canvas.wrapperEl.addEventListener('contextmenu', e => {
    e.preventDefault();
    const target = canvas.findTarget(e);
    if (target) { canvas.setActiveObject(target); canvas.requestRenderAll(); showCtxMenu(e.clientX, e.clientY, target); }
    else { canvas.discardActiveObject(); canvas.requestRenderAll(); hideCtxMenu(); }
  });
  $('ctx-delete').addEventListener('click', () => { deleteActive(); hideCtxMenu(); });
  // intersecting=true: only restack relative to objects that actually overlap
  // the target (covering it / covered by it), not the whole canvas stack
  $('ctx-forward').addEventListener('click', () => { layerOp(o => o.bringForward(true)); hideCtxMenu(); });
  $('ctx-backward').addEventListener('click', () => { layerOp(o => o.sendBackwards(true)); hideCtxMenu(); });
  $('ctx-front').addEventListener('click', () => { layerOp(o => o.bringToFront()); hideCtxMenu(); });
  $('ctx-back').addEventListener('click', () => { layerOp(o => o.sendToBack()); hideCtxMenu(); });
  $('ctx-edit').addEventListener('click', () => {
    const a = canvas.getActiveObject();
    if (a && a.type === 'paddedText') { a.enterEditing(); a.selectAll(); }
    hideCtxMenu();
  });
  $('ctx-download').addEventListener('click', () => { downloadSticker(canvas.getActiveObject()); hideCtxMenu(); });
  document.addEventListener('mousedown', e => { if (e.button === 2) return; if (!e.target.closest('#ctx-menu')) hideCtxMenu(); });

  // Sidebar resize + collapse
  initSidebarResize();

  // Mobile editor drawer
  const app = $('app');
  $('mobile-fab').addEventListener('click', () => { app.classList.add('drawer-open'); });
  $('drawer-handle').addEventListener('click', () => { app.classList.remove('drawer-open'); });
  $('canvas-area').addEventListener('click', () => { if (app.classList.contains('drawer-open')) app.classList.remove('drawer-open'); });

  initColorPop();
}

function onSelect(obj) {
  if (obj && obj.type === 'paddedText') syncPanelFrom(obj);
  else clearEditState();
}

/* ══════════ Custom glass colour picker ══════════
   One shared popover for every colour chip. The native inputs stay in the
   DOM as value holders: the picker writes input.value and dispatches an
   'input' event, so all existing listeners keep working untouched.
   The HEX / RGB / HSL mode is remembered in localStorage. */
const COLOR_INPUT_IDS = ['text-color', 'stroke-color', 'shadow-color', 'glow-color', 'bg-color', 'bg-color2', 'decor-color'];
let cpEl = null, cpBound = null, cpH = 0, cpS = 1, cpV = 1;

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0;
  if (d) {
    if (mx === r) h = ((g - b) / d) % 6;
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  return [h, mx ? d / mx : 0, mx];
}
function hsvToRgb(h, s, v) {
  const c = v * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; } else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}
function rgbToHslArr(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, l = (mx + mn) / 2;
  let h = 0, s = 0;
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (mx === r) h = ((g - b) / d) % 6;
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  return [h, s * 100, l * 100];
}
function hslToRgbArr(h, s, l) {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; } else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

function cpHex() { const [r, g, b] = hsvToRgb(cpH, cpS, cpV); return rgbToHex(r, g, b); }
function cpMode() { let m = 'hex'; try { m = localStorage.getItem('vb-color-mode') || 'hex'; } catch (e) {} return m; }
function cpSetMode(m) { try { localStorage.setItem('vb-color-mode', m); } catch (e) {} }

function initColorPop() {
  cpEl = document.createElement('div');
  cpEl.id = 'color-pop';
  cpEl.innerHTML =
    '<div class="cp-sv" id="cp-sv"><div class="cp-knob" id="cp-sv-knob"></div></div>' +
    '<div class="cp-hue" id="cp-hue"><div class="cp-knob cp-hue-knob" id="cp-hue-knob"></div></div>' +
    '<div class="cp-row"><div class="cp-preview" id="cp-preview"></div>' +
    '<div class="cp-modes" id="cp-modes">' +
      '<button data-mode="hex">HEX</button><button data-mode="rgb">RGB</button><button data-mode="hsl">HSL</button>' +
    '</div></div>' +
    '<div class="cp-fields" id="cp-fields"></div>' +
    '<div class="cp-swatches" id="cp-swatches"></div>';
  document.body.appendChild(cpEl);

  const drag = (zone, fn) => {
    zone.addEventListener('pointerdown', e => {
      e.preventDefault(); zone.setPointerCapture(e.pointerId);
      fn(e);
      const mv = ev => fn(ev);
      const up = () => { zone.removeEventListener('pointermove', mv); zone.removeEventListener('pointerup', up); };
      zone.addEventListener('pointermove', mv);
      zone.addEventListener('pointerup', up);
    });
  };
  drag($('cp-sv'), e => {
    const r = $('cp-sv').getBoundingClientRect();
    cpS = clamp((e.clientX - r.left) / r.width, 0, 1);
    cpV = clamp(1 - (e.clientY - r.top) / r.height, 0, 1);
    cpApply(true);
  });
  drag($('cp-hue'), e => {
    const r = $('cp-hue').getBoundingClientRect();
    cpH = clamp((e.clientX - r.left) / r.width, 0, 1) * 359.9;
    cpApply(true);
  });

  $('cp-modes').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    cpSetMode(b.dataset.mode);
    cpRenderModes(); cpRenderFields();
  });

  // intercept the native picker on every colour chip
  COLOR_INPUT_IDS.forEach(id => {
    const inp = $(id); if (!inp) return;
    inp.addEventListener('click', e => {
      e.preventDefault();
      (cpEl.classList.contains('show') && cpBound === inp) ? cpClose() : cpOpen(inp);
    });
  });

  document.addEventListener('mousedown', e => {
    if (!cpEl.classList.contains('show')) return;
    const t = e.target;
    if (t && t.closest && (t.closest('#color-pop') || t === cpBound)) return;
    cpClose();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') cpClose(); });
  window.addEventListener('resize', cpClose);
}

function cpOpen(input) {
  cpBound = input;
  const [r, g, b] = hexToRgb(input.value || '#888888');
  [cpH, cpS, cpV] = rgbToHsv(r, g, b);
  cpRenderModes(); cpRenderFields(); cpRenderSwatches();
  cpApply(false);
  cpEl.classList.add('show');
  const ir = input.getBoundingClientRect(), pw = 236;
  cpEl.style.left = clamp(ir.left + ir.width / 2 - pw / 2, 8, window.innerWidth - pw - 8) + 'px';
  const ph = cpEl.offsetHeight;
  let top = ir.bottom + 10;
  if (top + ph > window.innerHeight - 8) top = Math.max(8, ir.top - ph - 10);
  cpEl.style.top = top + 'px';
}
function cpClose() {
  if (!cpEl || !cpEl.classList.contains('show')) return;
  cpEl.classList.remove('show');
  if (cpBound) cpBound.dispatchEvent(new Event('change', { bubbles: true }));
  cpBound = null;
}

/* push the current HSV into the UI and (optionally) the bound input */
function cpApply(writeBack) {
  const hex = cpHex();
  $('cp-sv').style.background =
    'linear-gradient(to top, #000, rgba(0,0,0,0)), linear-gradient(to right, #fff, hsl(' + Math.round(cpH) + ',100%,50%))';
  const svr = $('cp-sv'), kn = $('cp-sv-knob');
  kn.style.left = (cpS * 100) + '%';
  kn.style.top = ((1 - cpV) * 100) + '%';
  kn.style.background = hex;
  const hk = $('cp-hue-knob');
  hk.style.left = (cpH / 360 * 100) + '%';
  hk.style.background = 'hsl(' + Math.round(cpH) + ',100%,50%)';
  $('cp-preview').style.background = hex;
  cpRenderFields();
  if (writeBack && cpBound) {
    cpBound.value = hex;
    cpBound.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

function cpRenderModes() {
  const m = cpMode();
  document.querySelectorAll('#cp-modes button').forEach(b => b.classList.toggle('active', b.dataset.mode === m));
}

function cpRenderFields() {
  const box = $('cp-fields'), m = cpMode();
  const [r, g, b] = hsvToRgb(cpH, cpS, cpV).map(Math.round);
  const focused = box.contains(document.activeElement);
  if (focused) return;   // don't fight the user while they type
  if (m === 'hex') {
    box.innerHTML = '<input type="text" class="cp-in cp-in-hex" id="cp-f-hex" maxlength="7" spellcheck="false">';
    $('cp-f-hex').value = cpHex();
    $('cp-f-hex').addEventListener('input', e => {
      const v = e.target.value.trim();
      if (/^#?[0-9a-fA-F]{6}$/.test(v)) {
        const [rr, gg, bb] = hexToRgb(v.startsWith('#') ? v : '#' + v);
        [cpH, cpS, cpV] = rgbToHsv(rr, gg, bb);
        cpApply(true);
      }
    });
  } else if (m === 'rgb') {
    box.innerHTML =
      '<label class="cp-fl">R<input type="number" class="cp-in" id="cp-f-r" min="0" max="255"></label>' +
      '<label class="cp-fl">G<input type="number" class="cp-in" id="cp-f-g" min="0" max="255"></label>' +
      '<label class="cp-fl">B<input type="number" class="cp-in" id="cp-f-b" min="0" max="255"></label>';
    $('cp-f-r').value = r; $('cp-f-g').value = g; $('cp-f-b').value = b;
    ['cp-f-r', 'cp-f-g', 'cp-f-b'].forEach(id => $(id).addEventListener('input', () => {
      const rr = clamp(+val('cp-f-r') || 0, 0, 255), gg = clamp(+val('cp-f-g') || 0, 0, 255), bb = clamp(+val('cp-f-b') || 0, 0, 255);
      [cpH, cpS, cpV] = rgbToHsv(rr, gg, bb);
      cpApply(true);
    }));
  } else {
    const [hh, ss, ll] = rgbToHslArr(r, g, b).map(Math.round);
    box.innerHTML =
      '<label class="cp-fl">H<input type="number" class="cp-in" id="cp-f-h" min="0" max="360"></label>' +
      '<label class="cp-fl">S<input type="number" class="cp-in" id="cp-f-s" min="0" max="100"></label>' +
      '<label class="cp-fl">L<input type="number" class="cp-in" id="cp-f-l" min="0" max="100"></label>';
    $('cp-f-h').value = hh; $('cp-f-s').value = ss; $('cp-f-l').value = ll;
    ['cp-f-h', 'cp-f-s', 'cp-f-l'].forEach(id => $(id).addEventListener('input', () => {
      const [rr, gg, bb] = hslToRgbArr(clamp(+val('cp-f-h') || 0, 0, 360), clamp(+val('cp-f-s') || 0, 0, 100), clamp(+val('cp-f-l') || 0, 0, 100));
      [cpH, cpS, cpV] = rgbToHsv(rr, gg, bb);
      cpApply(true);
    }));
  }
}

function cpRenderSwatches() {
  const box = $('cp-swatches');
  box.innerHTML = '';
  suggestedColors.slice(0, 8).forEach(hex => {
    const sw = document.createElement('div');
    sw.className = 'swatch'; sw.style.background = hex; sw.title = hex;
    sw.addEventListener('click', () => {
      const [rr, gg, bb] = hexToRgb(hex);
      [cpH, cpS, cpV] = rgbToHsv(rr, gg, bb);
      cpApply(true);
    });
    box.appendChild(sw);
  });
}

/* ── Bootstrap ── */
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

