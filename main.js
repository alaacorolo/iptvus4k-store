/* ==========================================================================
   IPTV USA 4K - Interactivity & UI Polish (main.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  setupHeaderScroll();
  setupMobileMenu();
  setupPricingToggle();
});

/**
 * Adds a scrolled class to the header for glassmorphism styling
 */
function setupHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Call once on load in case page is already scrolled
}

/**
 * Handles mobile hamburger toggle and menu display
 */
function setupMobileMenu() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!toggleBtn || !navLinks) return;

  // Simple and accessible toggle
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('active');
    
    // Animate hamburger to X (can be done via CSS using classes)
    toggleBtn.classList.toggle('open');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !toggleBtn.contains(e.target)) {
      toggleBtn.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('active');
      toggleBtn.classList.remove('open');
    }
  });

  // Close menu when a link is clicked
  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('active');
      toggleBtn.classList.remove('open');
    });
  });
}

/**
 * Handles the toggling of pricing periods (Monthly vs Annual savings)
 */
function setupPricingToggle() {
  const toggleButtons = document.querySelectorAll('.pricing-toggle-btn');
  const pricingCards = document.querySelectorAll('.pricing-card');

  if (toggleButtons.length === 0 || pricingCards.length === 0) return;

  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Deactivate all toggle buttons, activate clicked one
      toggleButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const targetPeriod = button.getAttribute('data-period'); // 'monthly', 'quarterly', 'yearly'

      // Update pricing content dynamically with smooth fade-in
      pricingCards.forEach(card => {
        const prices = card.querySelectorAll('.price-value');
        const periods = card.querySelectorAll('.pricing-period');
        const buyLinks = card.querySelectorAll('.pricing-buy-link');

        prices.forEach(price => {
          if (price.getAttribute('data-period') === targetPeriod) {
            price.style.display = 'inline';
            // Trigger a quick micro-animation
            price.classList.add('fade-in');
            setTimeout(() => price.classList.remove('fade-in'), 300);
          } else {
            price.style.display = 'none';
          }
        });

        periods.forEach(period => {
          if (period.getAttribute('data-period') === targetPeriod) {
            period.style.display = 'inline';
          } else {
            period.style.display = 'none';
          }
        });

        buyLinks.forEach(link => {
          if (link.getAttribute('data-period') === targetPeriod) {
            link.style.display = 'inline-flex';
          } else {
            link.style.display = 'none';
          }
        });
      });
    });
  });
}

// Add simple CSS animation utility for JS
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-in {
    animation: fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
  
  /* Mobile menu active state overrides */
  @media (max-width: 768px) {
    .nav-links.active {
      display: flex !important;
      flex-direction: column;
      position: absolute;
      top: 100%;
      left: 1rem;
      right: 1rem;
      background: rgba(18, 20, 29, 0.98);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: var(--border-radius-md);
      padding: 2rem;
      gap: 1.5rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
      animation: fadeIn 0.3s ease-out forwards;
    }
  }
`;
document.head.appendChild(style);
