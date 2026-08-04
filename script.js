document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- 2. FAQ accordion ---------- */
  var faqButtons = document.querySelectorAll('.faq-question');
  faqButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var answer = document.getElementById(btn.getAttribute('aria-controls'));
      var item = btn.closest('.faq-item');

      // Close any other open item (single-open accordion)
      faqButtons.forEach(function (otherBtn) {
        if (otherBtn !== btn && otherBtn.getAttribute('aria-expanded') === 'true') {
          otherBtn.setAttribute('aria-expanded', 'false');
          var otherAnswer = document.getElementById(otherBtn.getAttribute('aria-controls'));
          if (otherAnswer) otherAnswer.hidden = true;
          var otherItem = otherBtn.closest('.faq-item');
          if (otherItem) otherItem.classList.remove('is-open');
        }
      });

      btn.setAttribute('aria-expanded', String(!expanded));
      if (answer) answer.hidden = expanded;
      if (item) item.classList.toggle('is-open', !expanded);
    });
  });

  /* ---------- 3. Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal, .svc-reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- 4. Button ripple effect ---------- */
  document.querySelectorAll('.ripple').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var circle = document.createElement('span');
      var diameter = Math.max(rect.width, rect.height);

      circle.className = 'ripple-effect';
      circle.style.width = circle.style.height = diameter + 'px';
      circle.style.left = (e.clientX - rect.left - diameter / 2) + 'px';
      circle.style.top = (e.clientY - rect.top - diameter / 2) + 'px';

      btn.appendChild(circle);
      circle.addEventListener('animationend', function () { circle.remove(); });
    });
  });

  /* ---------- 5. Contact form (progressive enhancement over the native POST) ---------- */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');

  if (form && status) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.textContent = 'Sending your message…';
      status.classList.remove('form-status--error', 'form-status--success');

      var formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      })
        .then(function (response) { return response.json(); })
        .then(function (data) {
          if (data.success) {
            status.textContent = 'Thanks — your message has been sent. We will reply within one business day.';
            status.classList.add('form-status--success');
            form.reset();
          } else {
            status.textContent = 'Something went wrong. Please try again or WhatsApp us directly.';
            status.classList.add('form-status--error');
          }
        })
        .catch(function () {
          status.textContent = 'Something went wrong. Please try again or WhatsApp us directly.';
          status.classList.add('form-status--error');
        });
    });
  }

});
