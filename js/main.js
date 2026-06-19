/* ============================================================
   PACXORIS — Main JavaScript
   Handles: Navigation, Animations, Counters, Canvas Hero,
            Accordions, Feature Tabs, Scroll Behaviors
   ============================================================ */

'use strict';

// ── DOM Ready ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initStatCounters();
  initAccordions();
  initFeatureTabs();
  initHeroCanvas();
  initSmoothScroll();
  initNavbarActiveLink();
});

// ═══════════════════════════════════════════
//  NAVBAR
// ═══════════════════════════════════════════
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on load
}

// ── Navbar Active Link ──────────────────────────────────────
function initNavbarActiveLink() {
  const links = document.querySelectorAll('.navbar-nav .nav-link');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ═══════════════════════════════════════════
//  MOBILE MENU
// ═══════════════════════════════════════════
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    menu.classList.toggle('open');
    toggle.classList.toggle('active');
    toggle.setAttribute('aria-expanded', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  // Close on mobile link click
  menu.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('open') &&
        !menu.contains(e.target) &&
        !toggle.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  function closeMobileMenu() {
    menu.classList.remove('open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  }
}

// ═══════════════════════════════════════════
//  SCROLL ANIMATIONS (Intersection Observer)
// ═══════════════════════════════════════════
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.fade-up, .fade-in, .slide-left, .slide-right'
  );

  if (!animatedElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  animatedElements.forEach(el => observer.observe(el));
}

// ═══════════════════════════════════════════
//  STAT COUNTERS
// ═══════════════════════════════════════════
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const decimals = parseInt(el.dataset.decimals) || 0;
  const duration = 2000;
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;

    el.textContent = current.toFixed(decimals) + suffix;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      el.textContent = target.toFixed(decimals) + suffix;
    }
  }

  requestAnimationFrame(updateCounter);
}

// ═══════════════════════════════════════════
//  ACCORDIONS
// ═══════════════════════════════════════════
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => toggleAccordion(header));
  });
}

function toggleAccordion(header) {
  const item = header.closest('.accordion-item');
  const isOpen = item.classList.contains('open');

  // Close all in same accordion
  const accordion = item.closest('.accordion');
  if (accordion) {
    accordion.querySelectorAll('.accordion-item.open').forEach(openItem => {
      openItem.classList.remove('open');
    });
  }

  // Toggle current
  if (!isOpen) {
    item.classList.add('open');
  }
}

// ═══════════════════════════════════════════
//  FEATURE TABS (Features Page)
// ═══════════════════════════════════════════
function initFeatureTabs() {
  const tabBtns = document.querySelectorAll('#featureNav .tab-btn');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      const targetEl = document.getElementById(target);

      if (targetEl) {
        const navEl = document.getElementById('featureNav');
        const navBottom = navEl ? navEl.getBoundingClientRect().bottom + window.scrollY : 72;
        const targetTop = targetEl.getBoundingClientRect().top + window.scrollY;
        const offset = 20;

        window.scrollTo({
          top: targetTop - navBottom - offset,
          behavior: 'smooth'
        });
      }

      // Update active tab
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Highlight tab on scroll
  const sections = Array.from(tabBtns).map(btn => document.getElementById(btn.dataset.target)).filter(Boolean);

  const tabScrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.target === id);
          });
        }
      });
    },
    { rootMargin: '-30% 0px -60% 0px' }
  );

  sections.forEach(section => tabScrollObserver.observe(section));
}

// ═══════════════════════════════════════════
//  HERO CANVAS — Particle Animation
// ═══════════════════════════════════════════
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.6
        ? `rgba(0, 165, 165, `
        : `rgba(140, 80, 220, `
    };
  }

  function initParticles() {
    particles = [];
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 12000));
    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }
  }

  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(140, 80, 220, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawConnections();

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${p.opacity})`;
      ctx.fill();
    });

    animFrame = requestAnimationFrame(animate);
  }

  // Visibility API — pause when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animFrame);
    } else {
      animate();
    }
  });

  // Init
  resize();
  initParticles();
  animate();

  // Resize handler (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      initParticles();
    }, 200);
  }, { passive: true });
}

// ═══════════════════════════════════════════
//  SMOOTH SCROLL
// ═══════════════════════════════════════════
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navbar = document.getElementById('navbar');
        const navHeight = navbar ? navbar.offsetHeight : 72;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });
}

// ═══════════════════════════════════════════
//  UTILITY: Debounce
// ═══════════════════════════════════════════
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ═══════════════════════════════════════════
//  HERO MOCKUP — AI Highlight pulse
// ═══════════════════════════════════════════
(function initMockupInteractivity() {
  const aiHighlight = document.getElementById('aiHighlight');
  if (!aiHighlight) return;

  // Random subtle position shift for AI box
  function randomShift() {
    const x = Math.random() * 8 - 4;
    const y = Math.random() * 6 - 3;
    aiHighlight.style.transform = `translate(${x}px, ${y}px)`;
    setTimeout(randomShift, 3000 + Math.random() * 2000);
  }

  setTimeout(randomShift, 2000);
})();

// ═══════════════════════════════════════════
//  PERFORMANCE BAR ANIMATION
// ═══════════════════════════════════════════
(function initPerfBars() {
  const bars = document.querySelectorAll('.perf-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
          bar.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
          bar.style.width = targetWidth;
        }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();

// ═══════════════════════════════════════════
//  TECH NODES — Hover Tooltip
// ═══════════════════════════════════════════
(function initTechNodeTooltips() {
  const descriptions = {
    'Web Viewer (HTML5)': 'Zero-footprint clinical diagnostic viewer',
    'iOS App': 'Native iOS app with full PACS capabilities',
    'Android App': 'Native Android app with full PACS capabilities',
    'RIS Portal': 'Radiology information system web portal',
    'Analytics Dashboard': 'Real-time operational analytics',
    'Admin Console': 'Platform administration and configuration',
    'VNA Core': 'Vendor-neutral archive storage engine',
    'PACS Engine': 'Image rendering and distribution service',
    'RIS Service': 'Workflow and order management service',
    'AI Gateway': 'Algorithm integration and inference service',
    'HL7/FHIR Broker': 'Clinical messaging translation service',
    'Notification': 'Real-time alert and notification service',
    'Audit Service': 'Tamper-proof event logging (ATNA)',
  };

  document.querySelectorAll('.tech-node').forEach(node => {
    const label = node.textContent.trim();
    if (descriptions[label]) {
      node.setAttribute('title', descriptions[label]);
      node.setAttribute('aria-label', descriptions[label]);
    }
  });
})();

// ═══════════════════════════════════════════
//  LOGO WALL — Staggered entrance
// ═══════════════════════════════════════════
(function initLogoWall() {
  const items = document.querySelectorAll('.logo-wall-item');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        items.forEach((item, i) => {
          setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '0.4';
            item.style.transform = 'translateY(0)';
          }, i * 80);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  // Set initial state
  items.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
  });

  const wall = document.querySelector('.logo-wall-grid');
  if (wall) observer.observe(wall);
})();

// ═══════════════════════════════════════════
//  CARD HOVER — Tilt effect (subtle)
// ═══════════════════════════════════════════
(function initCardTilt() {
  document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ═══════════════════════════════════════════
//  NAVBAR — Scroll Progress Indicator
// ═══════════════════════════════════════════
(function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #581CA0, #00a5a5);
    z-index: 9999;
    width: 0%;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }, { passive: true });
})();

// ═══════════════════════════════════════════
//  WORKLIST — Simulate live updates
// ═══════════════════════════════════════════
(function initWorklistAnimation() {
  const rows = document.querySelectorAll('.wl-row');
  if (!rows.length) return;

  const statuses = ['pending', 'reading', 'complete', 'scheduled'];
  const statusLabels = {
    pending: 'Pending',
    reading: 'Reading',
    complete: 'Complete',
    scheduled: 'Scheduled'
  };

  // Subtle pulse for active reading row
  const readingStatus = document.querySelector('.wl-status.reading');
  if (readingStatus) {
    setInterval(() => {
      readingStatus.style.opacity = readingStatus.style.opacity === '0.6' ? '1' : '0.6';
    }, 1200);
  }
})();

// ═══════════════════════════════════════════
//  AI HIGHLIGHT — Scanning animation
// ═══════════════════════════════════════════
(function initAIScanner() {
  const ctVisual = document.querySelector('.ct-visual');
  if (!ctVisual) return;

  // Create scan line
  const scanLine = document.createElement('div');
  scanLine.style.cssText = `
    position: absolute;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,212,212,0.6), transparent);
    z-index: 10;
    animation: scanMove 3s ease-in-out infinite;
  `;
  ctVisual.appendChild(scanLine);

  // Add keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes scanMove {
      0% { top: 10%; opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { top: 90%; opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();

// ═══════════════════════════════════════════
//  COOKIE CONSENT (Simple)
// ═══════════════════════════════════════════
(function initCookieBanner() {
  if (localStorage.getItem('pacxoris_cookies_accepted')) return;

  const banner = document.createElement('div');
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie consent');
  banner.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 24px;
    right: 24px;
    max-width: 520px;
    background: #1a1550;
    border: 1px solid rgba(88,28,160,0.3);
    border-radius: 16px;
    padding: 20px 24px;
    z-index: 9998;
    box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    display: flex;
    gap: 16px;
    align-items: center;
    flex-wrap: wrap;
    animation: slideUp 0.4s ease;
  `;

  banner.innerHTML = `
    <div style="flex:1;min-width:200px;">
      <p style="color:rgba(255,255,255,0.8);font-size:0.85rem;line-height:1.6;margin:0;">
        We use cookies to improve your experience and analyze usage. 
        <a href="#" style="color:#a78bfa;text-decoration:underline;">Privacy Policy</a>
      </p>
    </div>
    <div style="display:flex;gap:10px;flex-shrink:0;">
      <button onclick="document.getElementById('cookieBanner').remove();localStorage.setItem('pacxoris_cookies_accepted','1')" 
              style="padding:8px 20px;background:#581CA0;color:white;border:none;border-radius:20px;font-size:0.85rem;font-weight:600;cursor:pointer;transition:background 0.2s;"
              onmouseover="this.style.background='#6b22c0'" onmouseout="this.style.background='#581CA0'">
        Accept
      </button>
      <button onclick="document.getElementById('cookieBanner').remove();localStorage.setItem('pacxoris_cookies_accepted','0')"
              style="padding:8px 16px;background:transparent;color:rgba(255,255,255,0.5);border:1px solid rgba(255,255,255,0.15);border-radius:20px;font-size:0.85rem;cursor:pointer;">
        Decline
      </button>
    </div>
  `;
  banner.id = 'cookieBanner';
  document.body.appendChild(banner);

  const style = document.createElement('style');
  style.textContent = `@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`;
  document.head.appendChild(style);

  // Auto-dismiss after 30 seconds
  setTimeout(() => {
    const b = document.getElementById('cookieBanner');
    if (b) b.style.animation = 'slideDown 0.4s ease forwards';
    setTimeout(() => {
      const b2 = document.getElementById('cookieBanner');
      if (b2) b2.remove();
    }, 400);
  }, 30000);
})();

// ═══════════════════════════════════════════
//  BACK TO TOP BUTTON
// ═══════════════════════════════════════════
(function initBackToTop() {
  const btn = document.createElement('button');
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '<i class="fa fa-chevron-up"></i>';
  btn.style.cssText = `
    position: fixed;
    bottom: 32px;
    right: 32px;
    width: 44px;
    height: 44px;
    background: #581CA0;
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 1rem;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(88,28,160,0.4);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s, visibility 0.3s, transform 0.2s;
    z-index: 997;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'translateY(-2px)';
    btn.style.background = '#6b22c0';
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.background = '#581CA0';
  });

  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.style.opacity = '1';
      btn.style.visibility = 'visible';
    } else {
      btn.style.opacity = '0';
      btn.style.visibility = 'hidden';
    }
  }, { passive: true });
})();

// ═══════════════════════════════════════════
//  GLOBAL: Expose toggleAccordion for inline handlers
// ═══════════════════════════════════════════
window.toggleAccordion = toggleAccordion;
