document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for scroll animations
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

  // Menu Tab Switching
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuPanes = document.querySelectorAll('.menu-pane');
  
  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs
      menuTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      // Add active to clicked tab
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      
      // Hide all panes
      menuPanes.forEach(pane => {
        pane.style.display = 'none';
        pane.classList.remove('active');
      });
      
      // Show target pane
      const targetId = tab.getAttribute('data-target');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.style.display = 'block';
        targetPane.classList.add('active');
      }
    });
  });

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item, index) => {
    // Open first by default
    if (index === 0) {
      item.classList.add('open');
      const q = item.querySelector('.faq-question');
      if (q) q.setAttribute('aria-expanded', 'true');
    }

    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      
      // If it's already active, we don't need to do anything to keep it open,
      // but the requirement says "Only one FAQ should be expanded at any time" and "Opening a new FAQ should automatically close the previously opened one."
      // If we want it to close on second click, we would toggle. But the requirement states:
      // "Clicking the currently open FAQ should not break the accordion."
      // It also states: "FAQ content should never disappear unexpectedly."
      // Let's allow toggling to close it, OR just keep it open. I will keep it open if it's already active.
      
      if (isOpen) {
        item.classList.remove('open');
        question.setAttribute('aria-expanded', 'false');
      } else {
        // Close all
        faqItems.forEach(i => {
          i.classList.remove('open');
          const q = i.querySelector('.faq-question');
          if (q) q.setAttribute('aria-expanded', 'false');
        });
        
        // Open clicked
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Mobile Menu Logic
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  
  if (mobileMenuBtn && mobileMenuOverlay) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    
    mobileMenuClose.addEventListener('click', () => {
      mobileMenuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
    
    const mobileLinks = mobileMenuOverlay.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Mobile Carousel Dots Logic
  const carousel = document.querySelector('.mobile-carousel');
  const dotsContainer = document.querySelector('.carousel-dots');
  
  if (carousel && dotsContainer) {
    const cards = carousel.querySelectorAll('.card');
    
    // Create dots
    cards.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      if (index === 0) dot.classList.add('active');
      
      dot.addEventListener('click', () => {
        cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    
    // Setup observer
    const observerOptions = {
      root: carousel,
      rootMargin: '0px',
      threshold: 0.5
    };
    
    const carouselObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = Array.from(cards).indexOf(entry.target);
          dots.forEach(d => d.classList.remove('active'));
          if(dots[index]) dots[index].classList.add('active');
        }
      });
    }, observerOptions);
    
    cards.forEach(card => carouselObserver.observe(card));
  }

  // Form Logic
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Handle form submission here
    });
  });

  // Restrict Past Dates
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Full Menu Modal Logic
  const openFullMenuBtn = document.getElementById('open-full-menu');
  const closeFullMenuBtn = document.getElementById('close-full-menu');
  const fullMenuModal = document.getElementById('full-menu-modal');

  if (openFullMenuBtn && fullMenuModal && closeFullMenuBtn) {
    openFullMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      fullMenuModal.style.display = 'block';
      document.body.style.overflow = 'hidden'; // prevent scrolling
    });

    closeFullMenuBtn.addEventListener('click', () => {
      fullMenuModal.style.display = 'none';
      document.body.style.overflow = '';
    });
    
    // Close modal when clicking outside content
    fullMenuModal.addEventListener('click', (e) => {
      if (e.target === fullMenuModal) {
        fullMenuModal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }

});
