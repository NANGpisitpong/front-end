// effects.js - Advanced neon/space effects for Home page (pure JS)
// Each init function returns a cleanup function. Use initAllEffects() to wire everything up at once.

export function initStarfield(canvas) {
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1, raf = 0;
  const reduceMotion = matchMediaSafe('(prefers-reduced-motion: reduce)');
  const stars = [];
  const N = 180;

  function resize() {
    dpr = Math.max(1, window.devicePixelRatio || 1);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!stars.length) {
      for (let i = 0; i < N; i++) {
        stars.push({ x: Math.random() * w, y: Math.random() * h, z: Math.random() * 0.5 + 0.5, s: Math.random() * 1.2 + 0.2 });
      }
    }
  }
  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    for (const st of stars) {
      ctx.globalAlpha = 0.35 * st.z + 0.15;
      ctx.fillStyle = 'rgba(255,255,255,1)';
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.s, 0, Math.PI * 2);
      ctx.fill();
      st.x += 0.05 + st.z * 0.25;
      if (st.x > w + 2) { st.x = -2; st.y = Math.random() * h; }
    }
    ctx.globalAlpha = 1;
    if (!reduceMotion) raf = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  if (reduceMotion) draw(); else raf = requestAnimationFrame(draw);

  return () => {
    window.removeEventListener('resize', resize);
    if (raf) cancelAnimationFrame(raf);
  };
}

export function initCursorTrail(canvas) {
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1, raf = 0;
  const reduceMotion = matchMediaSafe('(prefers-reduced-motion: reduce)');
  const trail = [];
  let ticking = false;

  function resize() {
    dpr = Math.max(1, window.devicePixelRatio || 1);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function onMove(e) {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        trail.push({ x: e.clientX, y: e.clientY, life: 1 });
        ticking = false;
      });
    }
  }
  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = trail.length - 1; i >= 0; i--) {
      const p = trail[i];
      const r = 22 * (p.life);
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      g.addColorStop(0, 'rgba(34,255,128,0.65)');
      g.addColorStop(0.5, 'rgba(0,255,255,0.35)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
      p.life -= 0.025;
      if (p.life <= 0) trail.splice(i, 1);
    }
    ctx.globalCompositeOperation = 'source-over';
    if (!reduceMotion) raf = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', onMove);
  if (!reduceMotion) raf = requestAnimationFrame(draw);

  function onVisibility() {
    if (document.hidden) { if (raf) { cancelAnimationFrame(raf); raf = 0; } }
    else if (!reduceMotion && !raf) { raf = requestAnimationFrame(draw); }
  }
  document.addEventListener('visibilitychange', onVisibility);

  return () => {
    window.removeEventListener('resize', resize);
    window.removeEventListener('mousemove', onMove);
    document.removeEventListener('visibilitychange', onVisibility);
    if (raf) cancelAnimationFrame(raf);
  };
}

export function initParallax(hero) {
  if (!hero) return () => {};
  const orb1 = hero.querySelector('.hero-orb.orb-1');
  const orb2 = hero.querySelector('.hero-orb.orb-2');
  const grid = hero.querySelector('.hero-grid');
  const reduceMotion = matchMediaSafe('(prefers-reduced-motion: reduce)');
  let req = 0; let mx = 0; let my = 0;

  function onMove(e) {
    const rect = hero.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mx = (e.clientX - cx) / rect.width;
    my = (e.clientY - cy) / rect.height;
    if (!req && !reduceMotion) req = requestAnimationFrame(apply);
  }
  function apply() {
    if (orb1) orb1.style.transform = `translate3d(${mx * 22}px, ${my * 18}px, 0)`;
    if (orb2) orb2.style.transform = `translate3d(${mx * -18}px, ${my * -14}px, 0)`;
    if (grid) grid.style.backgroundPosition = `${mx * 20}px ${my * 20}px, ${mx * 20}px ${my * 20}px`;
    req = 0;
  }

  window.addEventListener('mousemove', onMove);
  return () => { window.removeEventListener('mousemove', onMove); if (req) cancelAnimationFrame(req); };
}

export function initNoise(div) {
  if (!div) return () => {};
  const c = document.createElement('canvas'); const s = 128;
  c.width = s; c.height = s;
  const nctx = c.getContext('2d');
  if (nctx) {
    const img = nctx.createImageData(s, s);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v; img.data[i + 3] = 28;
    }
    nctx.putImageData(img, 0, 0);
    const url = c.toDataURL();
    div.style.background = `url(${url}) repeat`;
    div.style.opacity = '0.05';
    div.style.mixBlendMode = 'overlay';
  }
  return () => {};
}

export function initGlitch(titleEl) {
  if (!titleEl) return () => {};
  const reduceMotion = matchMediaSafe('(prefers-reduced-motion: reduce)');
  let t;
  function glitchOnce() {
    const frames = 8; let c = 0;
    const step = () => {
      titleEl.style.textShadow = c % 2 === 0 ? `2px 0 var(--cyan), -2px 0 var(--violet)` : `-2px 0 var(--cyan), 2px 0 var(--violet)`;
      titleEl.style.filter = `brightness(1.06)`;
      c++;
      if (c <= frames) requestAnimationFrame(step);
      else { titleEl.style.textShadow = ''; titleEl.style.filter = ''; }
    };
    step();
  }
  function loop() {
    glitchOnce();
    t = setTimeout(loop, 5000 + Math.random() * 3000);
  }
  if (!reduceMotion) t = setTimeout(loop, 2000);
  return () => { if (t) clearTimeout(t); titleEl.style.textShadow = ''; titleEl.style.filter = ''; };
}

export function initAllEffects({
  starSelector = '#fx-stars',
  cursorSelector = '#fx-cursor',
  heroSelector = '.hero',
  noiseSelector = '#fx-noise',
  titleSelector = '.hero-title',
} = {}) {
  const starCanvas = document.querySelector(starSelector);
  const cursorCanvas = document.querySelector(cursorSelector);
  const hero = document.querySelector(heroSelector);
  const noiseDiv = document.querySelector(noiseSelector);
  const titleEl = document.querySelector(titleSelector);

  const cleanups = [];
  cleanups.push(initStarfield(starCanvas));
  cleanups.push(initCursorTrail(cursorCanvas));
  cleanups.push(initParallax(hero));
  cleanups.push(initNoise(noiseDiv));
  cleanups.push(initGlitch(titleEl));

  return () => { cleanups.forEach(fn => { try { fn && fn(); } catch {} }); };
}

function matchMediaSafe(q) {
  try { return !!(window.matchMedia && window.matchMedia(q).matches); }
  catch { return false; }
}
