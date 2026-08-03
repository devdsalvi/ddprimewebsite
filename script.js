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

/* ============================================================
   BUILD / COMPLY — Component Behavior
   Vanilla JS. No dependencies. Scoped to #bc-section only.
   ============================================================ */

(function () {
  "use strict";

  var DATA = {
    build: [
      {
        icon: "🌐",
        title: "Website Development",
        desc: "Modern responsive business websites.",
      },
      {
        icon: "🛒",
        title: "Shopify Development",
        desc: "Conversion-focused Shopify stores.",
      },
      {
        icon: "📈",
        title: "Digital Marketing",
        desc: "SEO, Google Ads, Meta Ads.",
      },
      {
        icon: "🎯",
        title: "Branding",
        desc: "Professional identity & growth.",
      },
    ],
    comply: [
      {
        icon: "📄",
        title: "GST Registration",
        desc: "Register your business for GST.",
      },
      {
        icon: "📑",
        title: "GST Return Filing",
        desc: "Stay compliant, every filing cycle.",
      },
      {
        icon: "🏢",
        title: "MSME Registration",
        desc: "Unlock benefits for small businesses.",
      },
      {
        icon: "🛡",
        title: "Trademark Registration",
        desc: "Protect your brand identity.",
      },
      {
        icon: "💼",
        title: "Company Registration",
        desc: "Set up your company, done right.",
      },
      {
        icon: "📦",
        title: "IEC Registration",
        desc: "Start importing and exporting legally.",
      },
    ],
  };

  var section = document.getElementById("bc-section");
  if (!section) return;

  var panel = section.querySelector(".bc-panel");
  var cardsEl = section.querySelector("#bc-panel-cards");
  var tabBuild = section.querySelector("#bc-tab-build");
  var tabComply = section.querySelector("#bc-tab-comply");
  var tabs = [tabBuild, tabComply];

  function cardMarkup(item, index) {
    var delay = index * 60;
    return (
      '<div class="bc-card" tabindex="0" role="button" style="--bc-delay:' +
      delay +
      'ms">' +
      '<span class="bc-card-icon" aria-hidden="true">' +
      item.icon +
      "</span>" +
      '<span class="bc-card-body">' +
      '<span class="bc-card-title">' +
      item.title +
      "</span>" +
      '<p class="bc-card-desc">' +
      item.desc +
      "</p>" +
      "</span>" +
      '<span class="bc-card-arrow">' +
      '<svg viewBox="0 0 24 24" fill="none">' +
      '<path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg>" +
      "</span>" +
      "</div>"
    );
  }

  function renderCards(mode) {
    var items = DATA[mode];
    cardsEl.innerHTML = items.map(cardMarkup).join("");
  }

  function setActiveTab(mode) {
    var isBuild = mode === "build";

    panel.setAttribute("data-active", mode);

    tabBuild.classList.toggle("is-active", isBuild);
    tabBuild.setAttribute("aria-selected", String(isBuild));
    tabBuild.tabIndex = isBuild ? 0 : -1;

    tabComply.classList.toggle("is-active", !isBuild);
    tabComply.setAttribute("aria-selected", String(!isBuild));
    tabComply.tabIndex = !isBuild ? 0 : -1;

    cardsEl.setAttribute(
      "aria-labelledby",
      isBuild ? "bc-tab-build" : "bc-tab-comply"
    );

    renderCards(mode);
  }

  function activate(tabButton) {
    var mode = tabButton === tabBuild ? "build" : "comply";
    if (panel.getAttribute("data-active") === mode) return;
    setActiveTab(mode);
  }

  tabBuild.addEventListener("click", function () {
    activate(tabBuild);
  });
  tabComply.addEventListener("click", function () {
    activate(tabComply);
  });

  // Keyboard support: left/right/home/end move between tabs (WAI-ARIA tabs pattern)
  section.querySelector(".bc-tabs").addEventListener("keydown", function (e) {
    var currentIndex = tabs.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    var nextIndex = null;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (currentIndex + 1) % tabs.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    var nextTab = tabs[nextIndex];
    nextTab.focus();
    activate(nextTab);
  });

  // Allow Enter/Space to trigger a card (in case cards later become real links)
  cardsEl.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var card = e.target.closest(".bc-card");
    if (!card) return;
    e.preventDefault();
    card.click();
  });

  // Initial render
  renderCards("build");
})();

  /* ---------- FAQ accordion ---------- */
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      faqQuestions.forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.style.maxHeight = null;
        }
      });

      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.style.maxHeight = isOpen ? null : `${answer.scrollHeight}px`;
    });
  });

  /* ---------- Ripple effect on buttons ---------- */
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      circle.classList.add('ripple-circle');
      circle.style.width = circle.style.height = `${size}px`;
      circle.style.left = `${e.clientX - rect.left - size / 2}px`;
      circle.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 650);
    });
  });

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
