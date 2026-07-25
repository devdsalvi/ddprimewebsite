document.addEventListener('DOMContentLoaded', () => {

  /* ===== Footer year ===== */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== Sticky navbar shadow on scroll ===== */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 10);
    toggleBackToTop();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ===== Mobile hamburger menu ===== */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ===== FAQ accordion ===== */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item.active').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('active');
          openItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('active', !isActive);
      question.setAttribute('aria-expanded', String(!isActive));
    });
  });

  /* ===== Scroll reveal animation ===== */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ===== Back to top button ===== */
  const backToTop = document.getElementById('backToTop');
  function toggleBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===== Contact forms -> WhatsApp ===== */
  const WHATSAPP_NUMBER = '917597616454';

  function wireContactForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const business = (data.get('business') || '').toString().trim();
      const service = (data.get('service') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();

      let text = `Hello DD PRIME, I'm ${name}.`;
      if (business) text += ` My business: ${business}.`;
      text += ` I'm interested in: ${service}.`;
      text += ` Details: ${message}`;

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener');
      form.reset();
    });
  }

  wireContactForm('contactForm');
  wireContactForm('contactFormPage');

});
