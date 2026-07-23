document.addEventListener('DOMContentLoaded', () => {
  // ============================================================
  // Scroll Reveal Animation
  // ============================================================
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });

  // ============================================================
  // Header Scroll Behavior (glass effect on scroll)
  // ============================================================
  const header = document.querySelector('.hero-header');
  if (header) {
    const updateHeader = () => {
      // Header stays transparent on scroll
    };
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  // ============================================================
  // Active Nav Link on Scroll
  // ============================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObserver.observe(s));

  // ============================================================
  // Menu Tab Switching
  // ============================================================
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuPanes = document.querySelectorAll('.menu-pane');
  
  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      menuTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      
      menuPanes.forEach(pane => {
        pane.style.display = 'none';
        pane.classList.remove('active');
      });
      
      const targetId = tab.getAttribute('data-target');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.style.display = 'block';
        targetPane.classList.add('active');
      }
    });
  });

  // ============================================================
  // FAQ Accordion
  // ============================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item, index) => {
    // Open first by default
    if (index === 0) {
      item.classList.add('open');
      const q = item.querySelector('.faq-question');
      if (q) q.setAttribute('aria-expanded', 'true');
    }

    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      
      if (isOpen) {
        item.classList.remove('open');
        question.setAttribute('aria-expanded', 'false');
      } else {
        // Close all others
        faqItems.forEach(i => {
          i.classList.remove('open');
          const q = i.querySelector('.faq-question');
          if (q) q.setAttribute('aria-expanded', 'false');
        });
        
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ============================================================
  // Mobile Menu Logic
  // ============================================================
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  
  const openMobileMenu = () => {
    if (!mobileMenuOverlay) return;
    mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
    // Focus close button for accessibility
    if (mobileMenuClose) setTimeout(() => mobileMenuClose.focus(), 50);
  };

  const closeMobileMenu = () => {
    if (!mobileMenuOverlay) return;
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileMenuBtn.focus();
    }
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      if (mobileMenuOverlay && mobileMenuOverlay.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }

  if (mobileMenuOverlay) {
    // Close on backdrop click
    mobileMenuOverlay.addEventListener('click', (e) => {
      if (e.target === mobileMenuOverlay) closeMobileMenu();
    });

    // Close when navigating
    mobileMenuOverlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuOverlay?.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // ============================================================
  // Mobile Carousel Dots Logic (Reviews)
  // ============================================================
  const carousel = document.querySelector('.mobile-carousel');
  const dotsContainer = document.querySelector('.carousel-dots');
  
  if (carousel && dotsContainer) {
    const cards = carousel.querySelectorAll('.card');
    
    // Create dots
    cards.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('role', 'button');
      dot.setAttribute('tabindex', '0');
      dot.setAttribute('aria-label', `Go to review ${index + 1}`);
      
      const scrollToCard = () => {
        cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      };

      dot.addEventListener('click', scrollToCard);
      dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') scrollToCard();
      });

      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    
    const carouselObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = Array.from(cards).indexOf(entry.target);
          dots.forEach(d => d.classList.remove('active'));
          if (dots[index]) dots[index].classList.add('active');
        }
      });
    }, { root: carousel, rootMargin: '0px', threshold: 0.5 });
    
    cards.forEach(card => carouselObserver.observe(card));
  }

  // ============================================================
  // Form Handling
  // ============================================================
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Show success feedback for reservation form
      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '✓ Submitted!';
        submitBtn.disabled = true;
        submitBtn.style.background = '#22C55E';
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
          form.reset();
        }, 3000);
      }
    });
  });

  // ============================================================
  // Restrict Past Dates in Reservation Form
  // ============================================================
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // ============================================================
  // Full Menu Modal Logic
  // ============================================================
  const openFullMenuBtn = document.getElementById('open-full-menu');
  const closeFullMenuBtn = document.getElementById('close-full-menu');
  const fullMenuModal = document.getElementById('full-menu-modal');

  if (openFullMenuBtn && fullMenuModal && closeFullMenuBtn) {
    openFullMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      fullMenuModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
      closeFullMenuBtn.focus();
    });

    closeFullMenuBtn.addEventListener('click', () => {
      fullMenuModal.style.display = 'none';
      document.body.style.overflow = '';
      openFullMenuBtn.focus();
    });

    fullMenuModal.addEventListener('click', (e) => {
      if (e.target === fullMenuModal) {
        fullMenuModal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && fullMenuModal.style.display === 'block') {
        fullMenuModal.style.display = 'none';
        document.body.style.overflow = '';
        openFullMenuBtn.focus();
      }
    });
  }

});
