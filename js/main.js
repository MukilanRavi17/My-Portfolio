/**
 * MUKILAN R - PORTFOLIO INTERACTIVE SCRIPTS
 * UI/UX Designer & Frontend Developer
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbarScroll();
  initMobileMenu();
  initStatsCounter();
  initProjectFiltering();
  initCaseStudyModals();
  initContactForm();
  initClipboardButtons();
  initBackToTop();
  initScrollReveal();
});

/* --------------------------------------------------------------------------
   1. THEME TOGGLE (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('portfolio-theme') || (prefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(`Switched to ${newTheme} mode!`, 'info');
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('themeIcon');
  if (icon) {
    if (theme === 'light') {
      icon.className = 'fas fa-moon';
    } else {
      icon.className = 'fas fa-sun';
    }
  }
}

/* --------------------------------------------------------------------------
   2. NAVBAR SCROLL & ACTIVE LINK HIGHLIGHT
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Add glass background on scroll
    if (scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Highlight active link
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. MOBILE NAVIGATION MENU
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }
}

/* --------------------------------------------------------------------------
   4. ANIMATED STATS COUNTER
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(stat => {
          const target = parseFloat(stat.getAttribute('data-target') || '0');
          const suffix = stat.getAttribute('data-suffix') || '';
          const isDecimal = target % 1 !== 0;
          let count = 0;
          const duration = 1500;
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              stat.textContent = (isDecimal ? target.toFixed(1) : Math.floor(target)) + suffix;
              clearInterval(timer);
            } else {
              stat.textContent = (isDecimal ? count.toFixed(1) : Math.floor(count)) + suffix;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsStrip = document.querySelector('.stats-strip');
  if (statsStrip) observer.observe(statsStrip);
}

/* --------------------------------------------------------------------------
   5. PROJECT FILTERING
   -------------------------------------------------------------------------- */
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. CASE STUDY & DETAIL MODALS
   -------------------------------------------------------------------------- */
const caseStudiesData = {
  instagram: {
    title: "Instagram App Redesign — UI/UX Case Study",
    category: "Mobile UI/UX • Figma • User Research & Prototyping",
    timeline: "08/2026 – 08/2026",
    role: "Lead UI/UX Designer (Self-Initiated Project)",
    overview: "A comprehensive redesign of the Instagram mobile application aimed at decluttering user navigation, elevating visual hierarchy in media feeds, and streamlining social sharing flows.",
    problem: "Through user feedback and heuristic evaluation, users reported cognitive overload from cluttered navigation tabs, inconsistent placement of Reels/Shop/Direct Messages, and reduced discoverability for curated content.",
    solution: "Simplified the bottom navigation to 4 primary essential actions, introduced contextual gestures for rapid messaging, created unified card typography, and modernized micro-interactions for liking, bookmarking, and audio discovery.",
    deliverables: [
      "Low-fidelity & High-fidelity Wireframes in Figma",
      "Interactive Motion & Micro-interaction Prototypes",
      "Component Design System (Design tokens, atomic cards, dark/light variants)",
      "User Journey Maps & Usability Evaluation Matrix"
    ],
    highlights: [
      "25% reduction in average taps required to send media to close friends",
      "Clean visual contrast score (WCAG AAA compliant color pairings)",
      "Enhanced user satisfaction feedback across 12 usability test sessions"
    ],
    figmaUrl: "https://www.figma.com/design/QrtfBuWVhPEFG4kiJtTDox/instagram--Redesign-?node-id=0-1&t=z6F2PrIrV3DdHt99-1"
  },
  aicareer: {
    title: "Vanguard Learn — AI-Based Career Guidance & Skill Tracking System",
    category: "Internship Project • Mobile UI/UX (iOS) • AI EdTech • Product Strategy",
    timeline: "09/2026 – 09/2026",
    role: "UI/UX Design Intern at Duhzine IT Solutions Pvt Ltd (Navalur, Chennai)",
    overview: "Vanguard Learn is an AI-powered academic advising, degree planning, and competency benchmarking mobile platform. It replaces fragmented spreadsheets and generic chatbots with a unified Socratic AI tutor, a real-time degree roadmap, habit mechanics, and a 5-domain skill-mastery diagnostic engine.",
    problem: "Higher education advisors manage 300–375 students each, making personalized 1-on-1 career guidance impossible at scale. While 90% of students use AI, it remains ungoverned and disconnected from degree requirements, syllabus milestones, and verified skill benchmarks.",
    solution: "Engineered a closed-loop mobile ecosystem connecting academic performance, skill growth, and role readiness: role-based campus SSO onboarding, an academic progress dashboard (GPA 3.88, Dean's List), a Socratic AI Tutor with visual concept scaffolds (Constraint Geometry), 14-day streak habit mechanics, and a 5-axis competency radar (82% Verified Readiness).",
    deliverables: [
      "User Research & Personas (Undecided Undergrads, Job-Ready Aspirants, Working Upskillers, Faculty Mentors)",
      "Role-Based Onboarding & Campus SSO Authentication UI (45,000+ Active Scholars)",
      "Academic Progress Dashboard (GPA 3.88, Dean's List, 78/120 Credits, +18% Momentum)",
      "AI Socratic Tutor with 3 Modes (Socratic Tutor, Quiz Drills, Code & Essay) & Visual Scaffolds",
      "Curriculum & Habit Tracker (14-Day Streak, 18/20h Weekly Target, Study Cadence Grid)",
      "Mastery Diagnostic Engine (82% Verified Score & 5-Domain Competency Radar)",
      "Complete Feasibility Study, Technical Architecture (REST/GraphQL/FERPA) & 4-Moat Business Strategy"
    ],
    highlights: [
      "82% Verified Diagnostic score converting skill gaps into concrete next actions before midterms",
      "Socratic pedagogy prioritizing guided reasoning and retention over simple answer-giving",
      "Dual-Axis Competency Radar benchmarking students against real program & industry standards",
      "Defensible 4-tier moat architecture: Institutional Data, Trust, Curriculum, and Behavioral Switching-Costs"
    ],
    figmaUrl: "https://www.figma.com/design/dCB4lZVm5tDboS9xVyLwNJ/VBST-Tour----Travels?node-id=3-2&t=4JtsO2zSD7d5rnAD-1"
  },
  duhzine: {
    title: "VBST Tour & Travels Website — Internship Project",
    category: "Internship Project • UI/UX & Responsive Web Development",
    timeline: "08/2026 – 09/2026",
    role: "UI/UX Design Intern at Duhzine IT Solutions Pvt Ltd (Navalur, Chennai)",
    overview: "Designed and developed the official VBST Tour & Travels responsive website during internship training at Duhzine IT Solutions. Crafted comprehensive user flows, wireframes, and interactive prototypes in Figma, and coded the production-ready responsive frontend using HTML, CSS, and JavaScript.",
    problem: "Travelers and tourists struggled with cluttered tour packages, non-responsive mobile viewports, and lack of visual clarity when browsing destinations and vehicle rental services.",
    solution: "Performed stakeholder user research, created an intuitive visual hierarchy in Figma with accessible components, and engineered a fast, responsive multi-section web application with interactive tour cards, image showcases, and an accessible booking inquiry workflow.",
    deliverables: [
      "End-to-end Figma UI/UX Design System & Interactive Prototypes",
      "Production-ready Responsive Web Build (HTML5, CSS3, JavaScript)",
      "Tour Packages Showcase, Itinerary Breakdown & Booking Contact Flow",
      "Usability testing, cross-browser compatibility, and mobile performance optimizations"
    ],
    highlights: [
      "Completed full redesign and live deployment on GitHub Pages",
      "100% Mobile-first responsive layout with fast load times",
      "Directly translated high-fidelity Figma components into clean semantic code"
    ],
    liveUrl: "https://mukilanravi17.github.io/VBST-Tours-Travel/index.html",
    figmaUrl: "https://www.figma.com/proto/dCB4lZVm5tDboS9xVyLwNJ/VBST-Tour----Travels?node-id=192-5&t=pTkU6W5gL5r11Rhb-1"
  },
  annai: {
    title: "Annai Foundation Website — Internship Project",
    category: "Internship Project • UI/UX Design & Front-End Web Development",
    timeline: "08/2026 – 09/2026",
    role: "UI/UX Design Intern at Duhzine IT Solutions Pvt Ltd (Navalur, Chennai)",
    overview: "Designed in Figma and developed a responsive NGO & community service web platform for Annai Foundation during internship training at Duhzine IT Solutions. The platform highlights charity initiatives, community programs, volunteer engagement, and transparent donation channels.",
    problem: "Non-profit organizations often suffer from uninspiring legacy websites, unclear mission messaging, and high friction in donation and volunteer signup processes across mobile devices.",
    solution: "Structured an empathetic, trust-building user experience in Figma with warm color palettes and clear call-to-actions. Developed a lightweight, fast-loading, mobile-first responsive web frontend with semantic HTML5, CSS3, and JavaScript.",
    deliverables: [
      "Figma UI/UX Wireframes, High-Fidelity Mockups & Interactive Component System",
      "Production-ready Responsive Web Build (HTML5, CSS3, JavaScript)",
      "Programs Showcase, Volunteer Onboarding & Contact Inquiry Modules",
      "Cross-browser testing, accessibility audit, and live deployment on GitHub Pages"
    ],
    highlights: [
      "Fully responsive and deployed live on GitHub Pages",
      "Clean visual hierarchy with WCAG-compliant color contrast",
      "Intuitive navigation connecting community causes directly to volunteer actions"
    ],
    liveUrl: "https://mukilanravi17.github.io/Annai-Foundation/",
    figmaUrl: "https://www.figma.com/design/dCB4lZVm5tDboS9xVyLwNJ/VBST-Tour----Travels?node-id=534-2&t=FbxvIJQ2KVulB54H-1"
  },
  threadloom: {
    title: "Threadloom Apparel & Fashion Website — Internship Project",
    category: "Internship Project • UI/UX & Responsive Web Development",
    timeline: "08/2026 – 09/2026",
    role: "UI/UX Design Intern at Duhzine IT Solutions Pvt Ltd (Navalur, Chennai)",
    overview: "Designed and developed the official Threadloom fashion and apparel brand website during internship training at Duhzine IT Solutions. Focused on visual elegance, fluid product lookbooks, fabric detail showcases, and a responsive mobile-first commerce navigation flow.",
    problem: "Apparel and textile brands often struggle with slow image rendering, cluttered category navigation, and high drop-offs on mobile devices due to unoptimized responsive layouts.",
    solution: "Crafted a modern editorial visual hierarchy in Figma with high-contrast typography and minimalist layout design. Implemented the responsive web experience using HTML5, modern CSS3 animations, and vanilla JavaScript for interactive product discovery and filtering.",
    deliverables: [
      "Figma UI/UX Component System & High-Fidelity Mobile/Desktop Wireframes",
      "Production-ready Responsive Web Build (HTML5, CSS3, JavaScript)",
      "Curated Fashion Lookbook, Fabric Quality Breakdown & Contact Inquiry Flow",
      "Cross-browser testing, mobile performance optimizations, and live deployment on GitHub Pages"
    ],
    highlights: [
      "Deployed live on GitHub Pages with sub-second asset rendering",
      "100% Mobile-first responsive layout tailored for modern e-commerce browsing",
      "Clean UI aesthetic bridging luxury fashion presentation with modern web performance"
    ],
    liveUrl: "https://mukilanravi17.github.io/Threadloom/"
  },
  certlivewire: {
    title: "Certificate of Completion — Course on UI/UX Designing",
    category: "Official Certification • LIVEWIRE (CADD Centre Training Services Pvt Ltd)",
    timeline: "05-May-2026 – 18-Aug-2026 (Issued: 02-Sep-2026)",
    role: "Student ID: CO260425Z530702 • Livewire Salem",
    overview: "Official Certificate of Completion awarded to MUKILAN R for completing the intensive Course on UI/UX Designing at Livewire (Salem, New Bus Stand). Training covered end-to-end user research, wireframing, high-fidelity interactive prototyping, and frontend web implementation.",
    problem: null,
    solution: null,
    deliverables: [
      "User Research Methodologies, Empathy Mapping, and Personas",
      "Information Architecture, User Flows, and Low/High Fidelity Wireframing",
      "Interactive Prototyping, Component Design Systems & Usability Testing in Figma",
      "Front-End Web Development with Semantic HTML5, CSS3 Flexbox/Grid & JavaScript"
    ],
    highlights: [
      "Student ID: CO260425Z530702 (Registered under Livewire India)",
      "Issued at Livewire Salem, New Bus Stand on 02-Sep-2026",
      "Authorized Signatures: R. Parthasarathy (Chairman) & M K Kannan (Centre Head)",
      "Hands-on practical experience bridging Figma design directly into coded web pages"
    ],
    pdfUrl: "certificate.pdf"
  }
};

function initCaseStudyModals() {
  const modalOverlay = document.getElementById('caseStudyModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalBody = document.getElementById('modalDynamicContent');

  const openButtons = document.querySelectorAll('[data-open-modal]');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalKey = btn.getAttribute('data-open-modal');
      const data = caseStudiesData[modalKey];

      if (data && modalOverlay) {
        modalTitle.textContent = data.title;
        modalCategory.textContent = data.category;

        let html = `
          <div class="case-study-hero">
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 12px;">
              <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--secondary-light);"><i class="far fa-calendar-alt"></i> ${data.timeline}</span>
              <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--primary-light);"><i class="fas fa-user-tag"></i> ${data.role}</span>
            </div>
            <p style="font-size: 1.05rem; color: var(--text-main); line-height: 1.6;">${data.overview}</p>
          </div>
        `;

        if (data.problem && data.solution) {
          html += `
            <div class="case-grid">
              <div class="case-box">
                <h4><i class="fas fa-exclamation-triangle" style="color: #f59e0b; margin-right: 6px;"></i> Problem & Research</h4>
                <p style="font-size: 0.92rem; color: var(--text-muted);">${data.problem}</p>
              </div>
              <div class="case-box">
                <h4><i class="fas fa-lightbulb" style="color: #10b981; margin-right: 6px;"></i> Design Solution</h4>
                <p style="font-size: 0.92rem; color: var(--text-muted);">${data.solution}</p>
              </div>
            </div>
          `;
        }

        html += `
          <div class="case-box" style="margin-bottom: 20px;">
            <h4><i class="fas fa-layer-group" style="margin-right: 6px;"></i> Key Deliverables & Methodologies</h4>
            <ul>
              ${data.deliverables.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        `;

        if (data.highlights && data.highlights.length > 0) {
          html += `
            <div class="case-box">
              <h4><i class="fas fa-star" style="color: #f59e0b; margin-right: 6px;"></i> Key Achievements & Results</h4>
              <ul>
                ${data.highlights.map(item => `<li>${item}</li>`).join('')}
              </ul>
            </div>
          `;
        }

        let actionButtonsHtml = '';
        if (data.liveUrl) {
          actionButtonsHtml += `
            <a href="${data.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 8px;">
              <i class="fas fa-globe"></i> View Live Website
            </a>
          `;
        }
        if (data.figmaUrl) {
          actionButtonsHtml += `
            <a href="${data.figmaUrl}" target="_blank" rel="noopener noreferrer" class="btn ${data.liveUrl ? 'btn-secondary' : 'btn-primary'}" style="display: inline-flex; align-items: center; gap: 8px;">
              <i class="fab fa-figma"></i> Open Figma Prototype
            </a>
          `;
        }
        if (data.pdfUrl) {
          actionButtonsHtml += `
            <a href="${data.pdfUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 8px;">
              <i class="fas fa-file-pdf"></i> View Official Certificate PDF
            </a>
          `;
        }

        if (actionButtonsHtml) {
          html += `
            <div style="margin-top: 24px; display: flex; justify-content: center; flex-wrap: wrap; gap: 12px;">
              ${actionButtonsHtml}
            </div>
          `;
        }

        modalBody.innerHTML = html;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
}

/* --------------------------------------------------------------------------
   7. CONTACT FORM HANDLER
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('senderName');
      const emailInput = document.getElementById('senderEmail');
      const subjectInput = document.getElementById('msgSubject');
      const messageInput = document.getElementById('senderMsg');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      const name = nameInput?.value.trim() || '';
      const email = emailInput?.value.trim() || '';
      const subject = subjectInput?.value.trim() || 'Portfolio Inquiry';
      const message = messageInput?.value.trim() || '';

      if (!name || !email || !message) {
        showToast('Please fill in all required fields!', 'warning');
        return;
      }

      // UI Loading state
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Send Message';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending message...';
      }

      let success = false;

      // 1. Try local Express backend if running on server, or FormSubmit API
      try {
        const payload = {
          name,
          email,
          subject,
          message,
          _subject: `[Portfolio Inquiry] ${subject} from ${name}`,
          _template: 'table',
          _captcha: 'false'
        };

        // Determine endpoint: if served from node server (http/https), try /api/contact, else fallback to FormSubmit
        const isLocalServer = window.location.protocol.startsWith('http') && window.location.port !== '';
        const endpoint = isLocalServer ? '/api/contact' : 'https://formsubmit.co/ajax/mukilanravikumar17@gmail.com';

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          success = true;
          showToast(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
          contactForm.reset();
        } else if (isLocalServer) {
          // If local server failed, try public FormSubmit
          const fallbackRes = await fetch('https://formsubmit.co/ajax/mukilanravikumar17@gmail.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (fallbackRes.ok) {
            success = true;
            showToast(`Thank you, ${name}! Your message has been delivered.`, 'success');
            contactForm.reset();
          }
        }
      } catch (err) {
        console.warn('API submission error:', err);
      }

      // Fallback if fetch is blocked
      if (!success) {
        const mailtoUrl = `mailto:mukilanravikumar17@gmail.com?subject=${encodeURIComponent(`[Portfolio] ${subject}`)}&body=${encodeURIComponent(`Hi Mukilan,\n\nMy name is ${name} (${email}).\n\n${message}`)}`;
        showToast(`Opening your email client to send message...`, 'info');
        setTimeout(() => {
          window.location.href = mailtoUrl;
        }, 800);
      }

      // Reset button state
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    });
  }
}

/* --------------------------------------------------------------------------
   8. CLIPBOARD COPY UTILITY
   -------------------------------------------------------------------------- */
function initClipboardButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy') || '';
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: "${textToCopy}"`, 'success');
          const originalText = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(() => {
            btn.textContent = originalText;
          }, 2000);
        }).catch(() => {
          showToast('Could not copy automatically.', 'warning');
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   9. BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/* --------------------------------------------------------------------------
   10. SCROLL REVEAL ANIMATION (LIGHTWEIGHT INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const elements = document.querySelectorAll('.skill-category-card, .project-card, .timeline-card, .process-card, .highlight-box');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

/* --------------------------------------------------------------------------
   TOAST NOTIFICATION ENGINE
   -------------------------------------------------------------------------- */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';

  let iconClass = 'fa-info-circle';
  let color = 'var(--primary)';

  if (type === 'success') {
    iconClass = 'fa-check-circle';
    color = 'var(--accent-emerald)';
  } else if (type === 'warning') {
    iconClass = 'fa-exclamation-triangle';
    color = 'var(--accent-amber)';
  }

  toast.style.borderLeftColor = color;
  toast.innerHTML = `
    <i class="fas ${iconClass}" style="color: ${color}; font-size: 1.1rem;"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
