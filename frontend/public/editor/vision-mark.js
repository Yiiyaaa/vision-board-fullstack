/* ════════════════════════════════════════════════════════════════════
   Vision Mark — small luminous glass-eye brand glyph (Canvas 2D)
   Layers per frame: aura → lid-mask → sclera → iris (gradient + spokes)
   → pupil → highlights → lid outline → star dust.
   Motion: breathing alpha, 5–9 s blinks (fast close / slow open),
   pupil follows the pointer (±4 / ±2 px), brightens near the CTA.
   The whole component is pointer-events:none; listeners sit on #welcome
   and the loop stops for good once the landing is dismissed.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    var host = document.getElementById('vision-mark');
    var welcome = document.getElementById('welcome');
    if (!host || !welcome) return;
    var cv = host.querySelector('canvas');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var fine = window.matchMedia('(pointer: fine)').matches;

    /* ── palette (spec) ── */
    var C = {
      lid:    'rgba(110,78,88,',    // eyelid line   (alpha appended)
      shade:  'rgba(120,90,110,',   // soft shadow
      irisC:  'rgba(255,235,190,',  // iris center  (champagne)
      irisM:  'rgba(205,175,245,',  // iris middle  (lavender)
      irisO:  'rgba(170,125,185,',  // iris outer   (dusty plum)
      pupil:  'rgba(82,58,90,',     // warm purple-grey
      hi:     'rgba(255,250,226,',  // highlight
      halo:   'rgba(255,226,236,',  // aura
      star:   'rgba(255,236,180,'   // star dust
    };

    /* ── canvas sizing (DPR-aware) ── */
    var W = 0, H = 0;
    function resize() {
      var r = host.getBoundingClientRect();
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.max(10, r.width); H = Math.max(10, r.height);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    /* ── state ── */
    var st = {
      px: 0, py: 0, tx: 0, ty: 0,       // pupil offset: eased / target
      bright: 0, brightT: 0,            // CTA-proximity glow 0..1
      open: 1,                          // lid openness 0..1
      blinkPhase: 'idle',               // idle | closing | opening
      blinkAt: performance.now() + 2800 + Math.random() * 3200,
      blinkT0: 0
    };
    host.__vm = st;                     // tiny debug/verification hook
    host.__vmDraw = function () { draw(performance.now()); };

    var cta = document.getElementById('btn-start-hero');
    var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

    if (fine && !reduced) {
      welcome.addEventListener('mousemove', function (e) {
        var r = host.getBoundingClientRect();
        var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        st.tx = clamp((e.clientX - cx) / (window.innerWidth / 2), -1, 1) * 4;
        st.ty = clamp((e.clientY - cy) / (window.innerHeight / 2), -1, 1) * 2;
        if (cta) {
          var b = cta.getBoundingClientRect();
          st.brightT = (e.clientX > b.left - 90 && e.clientX < b.right + 90 &&
                        e.clientY > b.top - 90 && e.clientY < b.bottom + 90) ? 1 : 0;
        }
      });
      welcome.addEventListener('mouseleave', function () {
        st.tx = 0; st.ty = 0; st.brightT = 0;
      });
    }

    /* ── star dust: 3 grains, irregular spots & rhythms ── */
    var stars = [
      { x: 0.13, y: 0.16, s: 2.6, p: 2300, ph: Math.random() * 6 },
      { x: 0.89, y: 0.27, s: 1.9, p: 3100, ph: Math.random() * 6 },
      { x: 0.71, y: 0.02, s: 1.3, p: 2700, ph: Math.random() * 6 }
    ];

    var easeOutCubic = function (t) { return 1 - Math.pow(1 - t, 3); };
    var easeInQuad = function (t) { return t * t; };

    /* almond lid path; o = openness 0..1 */
    function lidPath(o) {
      var cx = W * 0.5, cy = H * 0.55;
      var ewh = W * 0.435;
      var up = (H * 0.40) * o + 0.4;
      var lo = (H * 0.295) * o + 0.4;
      var L = cx - ewh, R = cx + ewh;
      var yL = cy + H * 0.02, yR = cy - H * 0.065;   // lifted right tail
      ctx.beginPath();
      ctx.moveTo(L, yL);
      ctx.bezierCurveTo(cx - ewh * 0.44, cy - up, cx + ewh * 0.32, cy - up * 1.06, R, yR);
      ctx.bezierCurveTo(cx + ewh * 0.36, cy + lo * 0.92, cx - ewh * 0.40, cy + lo, L, yL);
      ctx.closePath();
      return { cx: cx, cy: cy, ewh: ewh, L: L, R: R, yL: yL, yR: yR, up: up, lo: lo };
    }

    function draw(now) {
      ctx.clearRect(0, 0, W, H);

      /* breathing: whole mark 0.80 → 0.95, ~9 s */
      var breathe = reduced ? 0.92 : 0.80 + 0.15 * (0.5 + 0.5 * Math.sin(now * Math.PI * 2 / 9000));
      ctx.globalAlpha = breathe;

      /* 1 · aura — pale mist behind the eye, pulse 0.55..0.85 */
      var pulse = reduced ? 0.7 : 0.55 + 0.30 * (0.5 + 0.5 * Math.sin(now / 5200));
      var ag = ctx.createRadialGradient(W * 0.5, H * 0.55, 1, W * 0.5, H * 0.55, W * 0.46);
      ag.addColorStop(0, C.halo + (0.22 * pulse) + ')');
      ag.addColorStop(1, C.halo + '0)');
      ctx.fillStyle = ag;
      ctx.fillRect(0, 0, W, H);

      /* 2 · lid mask */
      ctx.save();
      var g = lidPath(st.open);
      ctx.clip();

      /* 3 · sclera — milky, near-transparent volume */
      var sg = ctx.createRadialGradient(g.cx, g.cy, 1, g.cx, g.cy, g.ewh * 0.95);
      sg.addColorStop(0, 'rgba(255,251,248,0.40)');
      sg.addColorStop(0.7, 'rgba(255,246,243,0.16)');
      sg.addColorStop(1, 'rgba(255,244,242,0.04)');
      ctx.fillStyle = sg;
      ctx.fillRect(0, 0, W, H);
      /* soft shadow cast by the upper lid */
      var shg = ctx.createLinearGradient(0, g.cy - g.up, 0, g.cy - g.up * 0.25);
      shg.addColorStop(0, C.shade + '0.12)');
      shg.addColorStop(1, C.shade + '0)');
      ctx.fillStyle = shg;
      ctx.fillRect(0, 0, W, H);

      /* 4 · iris — layered glass petal */
      var icx = g.cx + st.px, icy = g.cy + st.py * 0.7;
      var ri = H * 0.37;
      var B = st.bright;
      var ig = ctx.createRadialGradient(icx - ri * 0.12, icy - ri * 0.14, ri * 0.06, icx, icy, ri);
      ig.addColorStop(0, C.irisC + (0.75 + 0.10 * B) + ')');
      ig.addColorStop(0.45, C.irisM + (0.42 + 0.08 * B) + ')');
      ig.addColorStop(0.85, C.irisO + (0.24 + 0.05 * B) + ')');
      ig.addColorStop(1, C.irisO + '0)');
      ctx.fillStyle = ig;
      ctx.beginPath(); ctx.arc(icx, icy, ri, 0, 6.2832); ctx.fill();

      /* iris spokes — slow drifting glass texture */
      var rot = reduced ? 0 : now * 0.000016;
      ctx.lineWidth = 0.6;
      for (var i = 0; i < 24; i++) {
        var a = rot + i * (6.2832 / 24);
        var r0 = ri * 0.30, r1 = ri * (0.88 + 0.06 * Math.sin(i * 2.3));
        ctx.strokeStyle = (i % 2)
          ? 'rgba(255,255,255,' + (0.05 + 0.04 * B) + ')'
          : C.irisO + '0.10)';
        ctx.beginPath();
        ctx.moveTo(icx + Math.cos(a) * r0, icy + Math.sin(a) * r0);
        ctx.lineTo(icx + Math.cos(a) * r1, icy + Math.sin(a) * r1);
        ctx.stroke();
      }
      /* soft outer ring */
      ctx.strokeStyle = C.irisO + (0.20 + 0.05 * B) + ')';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(icx, icy, ri * 0.97, 0, 6.2832); ctx.stroke();

      /* 5 · pupil — small, soft, warm purple-grey (never black) */
      var pg = ctx.createRadialGradient(icx, icy, 0.5, icx, icy, ri * 0.34);
      pg.addColorStop(0, C.pupil + '0.38)');
      pg.addColorStop(0.62, C.pupil + '0.30)');
      pg.addColorStop(1, C.pupil + '0)');
      ctx.fillStyle = pg;
      ctx.beginPath();
      ctx.ellipse(icx + st.px * 0.22, icy, ri * 0.30, ri * 0.34, 0, 0, 6.2832);
      ctx.fill();

      /* 6 · cornea highlights (drift slightly with the pointer) */
      var hx = icx - ri * 0.34 + st.px * 0.35 + B * 1.2;
      var hy = icy - ri * 0.38 + st.py * 0.3;
      var hg = ctx.createRadialGradient(hx, hy, 0.3, hx, hy, ri * 0.22);
      hg.addColorStop(0, C.hi + '0.9)');
      hg.addColorStop(1, C.hi + '0)');
      ctx.fillStyle = hg;
      ctx.beginPath(); ctx.arc(hx, hy, ri * 0.22, 0, 6.2832); ctx.fill();
      /* small lower arc highlight */
      ctx.strokeStyle = C.hi + '0.40)';
      ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.arc(icx + ri * 0.06, icy + ri * 0.05, ri * 0.55, 0.55, 1.45); ctx.stroke();
      /* tiny cross sparkle on the glass */
      var cxx = icx + ri * 0.52 + st.px * 0.2, cyy = icy - ri * 0.42;
      ctx.strokeStyle = C.hi + '0.75)';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(cxx - 3.2, cyy); ctx.lineTo(cxx + 3.2, cyy);
      ctx.moveTo(cxx, cyy - 3.2); ctx.lineTo(cxx, cyy + 3.2);
      ctx.stroke();

      ctx.restore(); /* end lid clip */

      /* 7 · lid outline — thin, warm, semi-transparent; upper line a touch firmer */
      lidPath(st.open);
      ctx.strokeStyle = C.lid + '0.26)';
      ctx.lineWidth = 1.05;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(g.L, g.yL);
      ctx.bezierCurveTo(g.cx - g.ewh * 0.44, g.cy - g.up, g.cx + g.ewh * 0.32, g.cy - g.up * 1.06, g.R, g.yR);
      ctx.strokeStyle = C.lid + (0.30 + 0.06 * B) + ')';
      ctx.lineWidth = 1.3;
      ctx.stroke();

      /* 8 · star dust — 3 faint grains, async shimmer */
      for (var s = 0; s < stars.length; s++) {
        var sp = stars[s];
        var tw = reduced ? 0.6 : 0.40 + 0.55 * (0.5 + 0.5 * Math.sin(now / sp.p + sp.ph));
        var sx = sp.x * W, sy = sp.y * H;
        ctx.strokeStyle = C.star + (0.55 * tw) + ')';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(sx - sp.s, sy); ctx.lineTo(sx + sp.s, sy);
        ctx.moveTo(sx, sy - sp.s); ctx.lineTo(sx, sy + sp.s);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    }

    /* ── blink + easing loop ── */
    function tick(now) {
      if (welcome.style.display === 'none') return;       // landing dismissed → stop
      if (!document.hidden) {
        /* pupil drifts after the pointer, settles home softly */
        st.px += (st.tx - st.px) * 0.05;
        st.py += (st.ty - st.py) * 0.05;
        st.bright += (st.brightT - st.bright) * 0.06;

        /* blink state machine: quick close (~110 ms), slow open (~480 ms) */
        if (st.blinkPhase === 'idle' && now >= st.blinkAt) {
          st.blinkPhase = 'closing'; st.blinkT0 = now;
        }
        if (st.blinkPhase === 'closing') {
          var tc = (now - st.blinkT0) / 110;
          if (tc >= 1) { st.open = 0.08; st.blinkPhase = 'opening'; st.blinkT0 = now; }
          else st.open = 1 - 0.92 * easeInQuad(tc);
        } else if (st.blinkPhase === 'opening') {
          var to = (now - st.blinkT0) / 480;
          if (to >= 1) {
            st.open = 1; st.blinkPhase = 'idle';
            st.blinkAt = now + 5000 + Math.random() * 4000;
          } else st.open = 0.08 + 0.92 * easeOutCubic(to);
        }

        draw(now);
      }
      requestAnimationFrame(tick);
    }

    if (reduced) { st.open = 1; draw(0); }                // static, calm
    else requestAnimationFrame(tick);
  });
})();
