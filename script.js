/* =========================================================
   DD PRIME — script.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky navbar shadow ---------- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    const scrolled = window.scrollY > 12;
    navbar.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('visible', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-50% 0px -45% 0px' });

  sections.forEach(sec => sectionObserver.observe(sec));

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated stat counters ---------- */
  const statNums = document.querySelectorAll('.stat-num');
  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  statNums.forEach(el => statObserver.observe(el));


  /* ---------- Contact form ---------- */
   
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    try {
      const formData = new FormData(contactForm);

      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        formStatus.textContent = "✅ Thank you! Your enquiry has been sent successfully.";
        formStatus.className = "form-status success";
        contactForm.reset();
      } else {
        throw new Error("Submission failed");
      }

    } catch (error) {
      formStatus.textContent = "❌ Failed to send enquiry. Please try again.";
      formStatus.className = "form-status error";
      console.error(error);
    }
  });
}

});
/* ============================================================
   DD PRIME SOLUTION — "Our Services" Section Behaviour
   ------------------------------------------------------------
   File: services.js
   Scope: IIFE — no globals leaked, no external dependencies.
   Responsibilities:
     1. Fade-up / slide-up scroll reveal (IntersectionObserver)
     2. Ripple click effect on cards + CTA button
   ============================================================ */

(function () {
  "use strict";

  var section = document.getElementById("services");
  if (!section) return;

  /* ----------------------------------------------------------
     1. Scroll reveal
     ---------------------------------------------------------- */
  var revealEls = section.querySelectorAll(".svc-reveal");

  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry, i) {
            if (entry.isIntersecting) {
              var el = entry.target;
              var delay = Math.min(i * 60, 240);
              window.setTimeout(function () {
                el.classList.add("svc-in-view");
              }, delay);
              revealObserver.unobserve(el);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );

      revealEls.forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      // No IntersectionObserver support: show content immediately
      revealEls.forEach(function (el) {
        el.classList.add("svc-in-view");
      });
    }
  }

  /* ----------------------------------------------------------
     2. Ripple click effect (delegated, single listener)
     ---------------------------------------------------------- */
  function spawnRipple(targetEl, rippleEl, evt) {
    var rect = targetEl.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height) * 1.6;
    var x = (evt.clientX || rect.left + rect.width / 2) - rect.left - size / 2;
    var y = (evt.clientY || rect.top + rect.height / 2) - rect.top - size / 2;

    rippleEl.style.width = size + "px";
    rippleEl.style.height = size + "px";
    rippleEl.style.left = x + "px";
    rippleEl.style.top = y + "px";

    // Restart animation
    rippleEl.classList.remove("svc-ripple-active");
    // Force reflow so the animation can be re-triggered
    void rippleEl.offsetWidth;
    rippleEl.classList.add("svc-ripple-active");
  }

  section.addEventListener("click", function (evt) {
    var card = evt.target.closest(".svc-card");
    if (card && section.contains(card)) {
      var ripple = document.createElement("span");
      ripple.className = "svc-card__ripple";
      card.appendChild(ripple);

      spawnRipple(card, ripple, evt);

      ripple.addEventListener(
        "animationend",
        function () {
          ripple.remove();
        },
        { once: true }
      );
      return;
    }

    var cta = evt.target.closest(".svc__cta");
    if (cta && section.contains(cta)) {
      var ctaRipple = cta.querySelector(".svc__cta-ripple");
      if (ctaRipple) {
        spawnRipple(cta, ctaRipple, evt);
      }
    }
  });

  /* Keyboard activation (Enter/Space) also triggers a centered ripple
     for cards/CTA reached via Tab, preserving the micro-interaction
     for keyboard-only users. */
  section.addEventListener("keydown", function (evt) {
    if (evt.key !== "Enter" && evt.key !== " ") return;
    var el = evt.target.closest(".svc-card, .svc__cta");
    if (!el) return;

    var fakeEvt = { clientX: null, clientY: null };
    if (el.classList.contains("svc-card")) {
      var ripple = document.createElement("span");
      ripple.className = "svc-card__ripple";
      el.appendChild(ripple);
      spawnRipple(el, ripple, fakeEvt);
      ripple.addEventListener("animationend", function () { ripple.remove(); }, { once: true });
    } else {
      var ctaRipple = el.querySelector(".svc__cta-ripple");
      if (ctaRipple) spawnRipple(el, ctaRipple, fakeEvt);
    }
  });
})();
