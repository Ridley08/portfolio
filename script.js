// ========================================
//  THEME TOGGLE (dark / light)
//  初期テーマは <head> のブートストラップで適用済み
// ========================================
(function () {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');

  function syncIcon() {
    if (!toggle) return;
    const icon = toggle.querySelector('i');
    if (!icon) return;
    const isDark = root.getAttribute('data-theme') !== 'light';
    icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    toggle.setAttribute('aria-label', isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え');
  }

  syncIcon();

  if (toggle) {
    toggle.addEventListener('click', function () {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncIcon();
    });
  }
})();

// ========================================
//  HEADER: スクロールで背景を濃くする
// ========================================
const header = document.getElementById('header');

if (header) {
  const onScroll = function () {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ========================================
//  SCROLL PROGRESS BAR
// ========================================
(function () {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  let ticking = false;

  function update() {
    const h = document.documentElement;
    const scrollable = h.scrollHeight - h.clientHeight;
    const ratio = scrollable > 0 ? h.scrollTop / scrollable : 0;
    bar.style.transform = 'scaleX(' + ratio + ')';
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  update();
})();

// ========================================
//  Back to top
// ========================================
(function () {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.addEventListener('click', function () {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
})();

// ========================================
//  ナビリンクのスムーススクロール（href="#xxx" 対応）
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    const hash = this.getAttribute('href');
    if (hash === '#' || hash.length < 2) return;
    const target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    const offset = header ? header.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });
});

// ========================================
//  インタラクション共通ガード
// ========================================
const FINE_POINTER = window.matchMedia('(pointer: fine)').matches;
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ========================================
//  カードの3Dチルト＋光沢追従
// ========================================
(function () {
  if (!FINE_POINTER || REDUCED_MOTION) return;
  const cards = document.querySelectorAll('.service-card, .works-category-card, .gallery-card');
  cards.forEach(function (el) {
    el.classList.add('tilt');
    let raf = null;
    el.addEventListener('pointermove', function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--rx', (py * -5).toFixed(2) + 'deg');
        el.style.setProperty('--ry', (px * 7).toFixed(2) + 'deg');
        el.style.setProperty('--mx', ((px + 0.5) * 100).toFixed(1) + '%');
        el.style.setProperty('--my', ((py + 0.5) * 100).toFixed(1) + '%');
        raf = null;
      });
    });
    el.addEventListener('pointerleave', function () {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    });
  });
})();

// ========================================
//  カーソルグロー（カフェの灯り）
// ========================================
(function () {
  if (!FINE_POINTER || REDUCED_MOTION) return;
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  glow.style.opacity = '0';
  document.body.appendChild(glow);

  let tx = 0, ty = 0, cx = 0, cy = 0, active = false;

  window.addEventListener('pointermove', function (e) {
    tx = e.clientX;
    ty = e.clientY;
    if (!active) {
      active = true;
      cx = tx; cy = ty;
      glow.style.opacity = '1';
      loop();
    }
  }, { passive: true });

  function loop() {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    glow.style.transform = 'translate(' + (cx - 270) + 'px,' + (cy - 270) + 'px)';
    requestAnimationFrame(loop);
  }
})();

// ========================================
//  マグネティックボタン
// ========================================
(function () {
  if (!FINE_POINTER || REDUCED_MOTION) return;
  document.querySelectorAll('.btn-primary, .cta-contact-btn').forEach(function (btn) {
    btn.addEventListener('pointermove', function (e) {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.18;
      const y = (e.clientY - r.top - r.height / 2) * 0.3;
      btn.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
    });
    btn.addEventListener('pointerleave', function () {
      btn.style.transform = '';
    });
  });
})();

// ========================================
//  ヒーローのマウスパララックス
// ========================================
(function () {
  if (!FINE_POINTER || REDUCED_MOTION) return;
  const hero = document.querySelector('.hero');
  const layer = document.querySelector('.hero-overlay');
  if (!hero || !layer) return;
  let raf = null;
  hero.addEventListener('pointermove', function (e) {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      const r = hero.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      layer.style.transform =
        'scale(1.04) translate(' + (px * -12).toFixed(1) + 'px,' + (py * -8).toFixed(1) + 'px)';
      raf = null;
    });
  });
  hero.addEventListener('pointerleave', function () {
    layer.style.transform = 'scale(1.04)';
  });
})();

// ========================================
//  スクロールスパイ（現在地のナビを点灯）
// ========================================
(function () {
  const links = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  if (!links.length || !('IntersectionObserver' in window)) return;
  const pairs = links
    .map(function (l) { return { link: l, sec: document.querySelector(l.getAttribute('href')) }; })
    .filter(function (p) { return p.sec; });
  if (!pairs.length) return;

  const spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (l) { l.classList.remove('active'); });
      const hit = pairs.find(function (p) { return p.sec === entry.target; });
      if (hit) hit.link.classList.add('active');
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  pairs.forEach(function (p) { spy.observe(p.sec); });
})();

// ========================================
//  スクロール時の要素フェードイン（.reveal クラス）
// ========================================
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(function (el) { observer.observe(el); });
})();
