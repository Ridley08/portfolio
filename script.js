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
