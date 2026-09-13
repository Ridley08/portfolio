const header = document.getElementById('header');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Theme preference is shared by all pages.
(function () {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;
  function syncIcon() {
    const isDark = root.getAttribute('data-theme') !== 'light';
    const icon = toggle.querySelector('i');
    if (icon) icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    const label = isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え';
    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('title', label);
  }
  syncIcon();
  toggle.addEventListener('click', function () {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    syncIcon();
  });
})();

// Progressive enhancement keeps the existing links available without JavaScript.
(function () {
  if (!header) return;
  const inner = header.querySelector('.header-inner');
  const nav = header.querySelector('.nav');
  if (!inner || !nav) return;
  const mobile = window.matchMedia('(max-width: 700px)');
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'menu-toggle';
  toggle.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
  nav.id = nav.id || 'primaryNav';
  if (!nav.hasAttribute('aria-label')) nav.setAttribute('aria-label', 'メインナビゲーション');
  toggle.setAttribute('aria-controls', nav.id);
  inner.insertBefore(toggle, nav);
  header.classList.add('js-nav');

  function setOpen(open, returnFocus) {
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    const label = open ? 'メニューを閉じる' : 'メニューを開く';
    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('title', label);
    toggle.querySelector('i').className = open ? 'fas fa-times' : 'fas fa-bars';
    if (returnFocus) toggle.focus();
  }
  setOpen(false);
  toggle.addEventListener('click', function () {
    setOpen(!header.classList.contains('menu-open'));
  });
  nav.addEventListener('click', function (event) {
    if (event.target.closest('a') && mobile.matches) setOpen(false);
  });
  document.addEventListener('click', function (event) {
    if (!header.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && header.classList.contains('menu-open')) setOpen(false, true);
  });
  header.addEventListener('focusout', function () {
    requestAnimationFrame(function () {
      if (!header.contains(document.activeElement)) setOpen(false);
    });
  });
  mobile.addEventListener('change', function () {
    if (!mobile.matches) setOpen(false);
  });
})();

(function () {
  const bar = document.getElementById('scrollProgress');
  let ticking = false;
  function update() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 30);
    if (bar) {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      bar.style.transform = 'scaleX(' + (scrollable > 0 ? doc.scrollTop / scrollable : 0) + ')';
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  update();
})();

(function () {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.title = 'ページ上部へ戻る';
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  });
})();

document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (event) {
    const hash = anchor.getAttribute('href');
    if (hash.length < 2) return;
    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return;
    event.preventDefault();
    if (header) header.classList.remove('menu-open');
    const offset = header ? header.offsetHeight + 20 : 20;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
});

(function () {
  const links = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  if (!links.length || !('IntersectionObserver' in window)) return;
  const pairs = links.map(function (link) {
    return { link: link, section: document.getElementById(link.getAttribute('href').slice(1)) };
  }).filter(function (pair) { return pair.section; });
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      pairs.forEach(function (pair) {
        const active = pair.section === entry.target;
        pair.link.classList.toggle('active', active);
        if (active) pair.link.setAttribute('aria-current', 'location');
        else pair.link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-20% 0px -45% 0px' });
  pairs.forEach(function (pair) { observer.observe(pair.section); });
})();

(function () {
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  elements.forEach(function (el) {
    if (el.getBoundingClientRect().top > window.innerHeight) {
      el.classList.add('reveal-ready');
      observer.observe(el);
    }
  });
})();
