/* ============================================================
   DD PRIME — Main Script
   ------------------------------------------------------------
   Handles: nav toggle, sticky navbar shadow, scroll-reveal
   animations, ripple button effect, FAQ accordion, back-to-top,
   contact form submit status, and footer year.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* -----------------------------------------------------------
     1. Footer year
     ----------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* -----------------------------------------------------------
     2. Sticky navbar shadow on scroll
     ----------------------------------------------------------- */
  var navbar = document.getElementById('navbar');
  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 12) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  /* -----------------------------------------------------------
     3. Mobile nav toggle
     ----------------------------------------------------------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* -----------------------------------------------------------
     4. Scroll reveal (IntersectionObserver)
     ----------------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal, .svc-reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: reveal everything immediately
    revealEls.forEach(function (el) {
      el.classList.add('in-view');
    });
  }

  /* -----------------------------------------------------------
     5. Ripple effect for .ripple buttons
     ----------------------------------------------------------- */
  document.querySelectorAll('.ripple').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var ripple = document.createElement('span');
      var size = Math.max(rect.width, rect.height);
      var x = (e.clientX || rect.left + rect.width / 2) - rect.left - size / 2;
      var y = (e.clientY || rect.top + rect.height / 2) - rect.top - size / 2;

      ripple.className = 'ripple-effect';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';

      btn.appendChild(ripple);
      window.setTimeout(function () {
        ripple.remove();
      }, 650);
    });
  });

  /* -----------------------------------------------------------
     6. FAQ accordion
     ----------------------------------------------------------- */
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', function () {
      var isOpen = question.getAttribute('aria-expanded') === 'true';

      // Close all other FAQ items (single-open accordion)
      faqItems.forEach(function (otherItem) {
        var otherQuestion = otherItem.querySelector('.faq-question');
        var otherAnswer = otherItem.querySelector('.faq-answer');
        if (otherQuestion && otherAnswer && otherItem !== item) {
          otherQuestion.setAttribute('aria-expanded', 'false');
          otherAnswer.style.maxHeight = null;
        }
      });

      // Toggle current item
      question.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      answer.style.maxHeight = isOpen ? null : answer.scrollHeight + 'px';
    });
  });

  /* -----------------------------------------------------------
     7. Back to top button
     ----------------------------------------------------------- */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 480) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* -----------------------------------------------------------
     8. Contact form — async submit with status message
     ----------------------------------------------------------- */
  var contactForm = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var originalBtnText = submitBtn ? submitBtn.textContent : '';

      formStatus.textContent = 'Sending your message...';
      formStatus.className = 'form-status';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      var formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      })
        .then(function (response) { return response.json(); })
        .then(function (data) {
          if (data.success) {
            formStatus.textContent = 'Thank you! Your message has been sent. We\u2019ll get back to you within one business day.';
            formStatus.className = 'form-status success';
            contactForm.reset();
          } else {
            formStatus.textContent = 'Something went wrong. Please try again or WhatsApp us directly.';
            formStatus.className = 'form-status error';
          }
        })
        .catch(function () {
          formStatus.textContent = 'Something went wrong. Please try again or WhatsApp us directly.';
          formStatus.className = 'form-status error';
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
        });
    });
  }

});
