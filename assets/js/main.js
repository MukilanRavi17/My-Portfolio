/**
 * Mukilan R Portfolio - Main JavaScript
 */

const SHOW_PLACEHOLDERS = true;

document.addEventListener('DOMContentLoaded', () => {
  initPlaceholders();
  initThemeToggle();
  initMobileMenu();
  initCopyEmail();
  initScrollspy();
  initScrollReveal();
  initActiveNav();
});

/**
 * 1. Image Placeholders Visibility Flag
 */
function initPlaceholders() {
  if (!SHOW_PLACEHOLDERS) {
    const placeholders = document.querySelectorAll('.is-placeholder');
    placeholders.forEach(el => {
      el.style.display = 'none';
    });
  }
}

/**
 * 2. Theme Toggle with LocalStorage & System Preference
 */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  toggleBtn.setAttribute('aria-pressed', currentTheme === 'light' ? 'true' : 'false');

  toggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    toggleBtn.setAttribute('aria-pressed', newTheme === 'light' ? 'true' : 'false');

    try {
      localStorage.setItem('theme-preference', newTheme);
    } catch (e) {
      // Ignore localStorage security/quota errors
    }
  });
}

/**
 * 3. Accessible Mobile Navigation
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const panel = document.getElementById('mobile-menu-panel');
  if (!toggleBtn || !panel) return;

  function openMenu() {
    toggleBtn.setAttribute('aria-expanded', 'true');
    panel.classList.add('is-open');
    panel.removeAttribute('hidden');
    const firstLink = panel.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    toggleBtn.setAttribute('aria-expanded', 'false');
    panel.classList.remove('is-open');
    panel.setAttribute('hidden', '');
    toggleBtn.focus();
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (panel.classList.contains('is-open') && !panel.contains(e.target) && e.target !== toggleBtn) {
      closeMenu();
    }
  });

  // Close when clicking any nav link inside mobile panel
  const links = panel.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

/**
 * 4. Copy Email to Clipboard with Aria Announcement
 */
function initCopyEmail() {
  const copyBtns = document.querySelectorAll('.copy-email-btn');
  const liveRegion = document.getElementById('copy-status-live');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const email = btn.getAttribute('data-email') || 'mukilanravikumar17@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        const originalText = btn.textContent;
        btn.textContent = 'Copied';
        btn.classList.add('is-copied');

        if (liveRegion) {
          liveRegion.textContent = 'Email address copied to clipboard';
        }

        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('is-copied');
          if (liveRegion) {
            liveRegion.textContent = '';
          }
        }, 2000);
      } catch (err) {
        // Fallback if clipboard API fails
        window.location.href = `mailto:${email}`;
      }
    });
  });
}

/**
 * 5. In-Page Table of Contents Scrollspy
 */
function initScrollspy() {
  const tocLinks = document.querySelectorAll('.toc-link');
  if (!tocLinks.length) return;

  const sections = [];
  tocLinks.forEach(link => {
    const targetId = link.getAttribute('href')?.replace('#', '');
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) sections.push({ id: targetId, element: el, link: link });
    }
  });

  if (!sections.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        tocLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${activeId}`) {
            link.classList.add('is-active');
            link.setAttribute('aria-current', 'true');
          } else {
            link.classList.remove('is-active');
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(s => observer.observe(s.element));
}

/**
 * 6. Subtle Scroll Reveal
 */
function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/**
 * 7. Active Nav Link Helper
 */
function initActiveNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#')) return;

    // Check matching page
    if (
      (currentPath.endsWith('/') && href === './index.html') ||
      (currentPath.endsWith('index.html') && href.includes('index.html')) ||
      (currentPath.includes('about.html') && href.includes('about.html')) ||
      (currentPath.includes('resume.html') && href.includes('resume.html')) ||
      (currentPath.includes('/work/') && href.includes('/work/'))
    ) {
      link.setAttribute('aria-current', 'page');
    }
  });
}
