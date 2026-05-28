// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// Mobile menu
function toggleMenu() {
  const h = document.getElementById('hamburger');
  const m = document.getElementById('mobileMenu');
  h.classList.toggle('open');
  m.classList.toggle('open');
  document.body.style.overflow = m.classList.contains('open') ? 'hidden' : '';
}
function closeMenu() {
  document.getElementById('hamburger').classList.remove('open');
  const m = document.getElementById('mobileMenu');
  m.classList.remove('open');
  document.body.style.overflow = '';
}

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(r => observer.observe(r));

/* DEPOIMENTOS - JS (coloque antes do </body>) */
(function () {
  const wrapper = document.querySelector('.dep-carousel-wrapper');
  const carousel = document.getElementById('depCarousel');
  const prevBtn = document.getElementById('depPrev');
  const nextBtn = document.getElementById('depNext');
  const dotsContainer = document.getElementById('depDots');
  if (!wrapper || !carousel) return;

  const cards = carousel.querySelectorAll('.dep-card');
  const total = cards.length;
  let currentIndex = 0;
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  /* Dots */
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dep-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function getOffset(index) {
    const card = cards[index];
    const gap = 24;
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += cards[i].offsetWidth + gap;
    }
    const maxScroll = carousel.scrollWidth - wrapper.offsetWidth;
    return Math.min(offset, maxScroll);
  }

  function updateDots() {
    dotsContainer.querySelectorAll('.dep-dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentIndex);
    });
  }

  function updateArrows() {
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === total - 1;
  }

  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, total - 1));
    const offset = getOffset(currentIndex);
    wrapper._scrollOffset = offset;
    carousel.style.transition = 'transform 0.4s ease';
    carousel.style.transform = `translateX(-${offset}px)`;
    updateDots();
    updateArrows();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  updateArrows();

  /* Drag */
  function getClientX(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
  }

  wrapper.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = getClientX(e);
    scrollLeft = wrapper._scrollOffset || 0;
    wrapper.classList.add('dragging');
    carousel.style.transition = 'none';
  });

  wrapper.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = getClientX(e);
    scrollLeft = wrapper._scrollOffset || 0;
    carousel.style.transition = 'none';
  }, { passive: true });

  function onMove(e) {
    if (!isDragging) return;
    const x = getClientX(e);
    const diff = x - startX;
    const maxScroll = carousel.scrollWidth - wrapper.offsetWidth;
    let newOffset = Math.max(0, Math.min(scrollLeft - diff, maxScroll));
    wrapper._scrollOffset = newOffset;
    carousel.style.transform = `translateX(-${newOffset}px)`;
  }

  wrapper.addEventListener('mousemove', onMove);
  wrapper.addEventListener('touchmove', onMove, { passive: true });

  function onEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    wrapper.classList.remove('dragging');
    const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diff = startX - x;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
    } else {
      goTo(currentIndex);
    }
  }

  wrapper.addEventListener('mouseup', onEnd);
  wrapper.addEventListener('mouseleave', onEnd);
  wrapper.addEventListener('touchend', onEnd);
})();


const music = document.getElementById('bgMusic');
const btn = document.getElementById('musicBtn');

music.volume = 0.3;

function startMusic() {
  if (!music.paused) return;
  music.play().catch(() => { });
}

// captura qualquer tipo de interação
['touchend', 'touchmove', 'touchstart', 'mousedown', 'scroll', 'click'].forEach(evt => {
  document.addEventListener(evt, startMusic, { once: true, passive: true });
});

function toggleMusic() {
  if (music.paused) {
    music.play();
    btn.textContent = '♪';
  } else {
    music.pause();
    btn.textContent = '🔇';
  }
}