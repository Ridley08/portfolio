// スクロールでヘッダーの背景を濃くする
const header = document.getElementById('header');

window.addEventListener('scroll', function () {
  if (window.scrollY > 60) {
    header.style.background = 'rgba(20, 20, 20, 0.92)';
  } else {
    header.style.background = 'rgba(30, 30, 30, 0.65)';
  }
});

// ナビリンクのスムーススクロール（href="#xxx" 対応）
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });
});

// スクロール時の要素フェードイン（.reveal クラス）
const revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(function (el) {
  revealObserver.observe(el);
});
