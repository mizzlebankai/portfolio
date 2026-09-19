

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initScrollReveal();
  initNav();
  initTimezoneClock();
  initCardFlip();
  initClipboard();
  initCardSpotlight();
  initContactModal();
  initContactForm();
  initContactExport();
});

function initContactExport() {
  const exportButton = document.getElementById('exportContactBtn');
  if (!exportButton) return;

  exportButton.addEventListener('click', () => {
    const vCard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:AMAKYE-DANSO GODSON',
      'N:GODSON;AMAKYE-DANSO;;;',
      'TITLE:Full Stack Engineer & Creative Developer',
      'EMAIL;TYPE=INTERNET:mizzlebankai@gmail.com',
      'EMAIL;TYPE=INTERNET:godsonamakyedanso@gmail.com',
      'TEL;TYPE=CELL:+233257933174',
      'ADR;TYPE=HOME:;;Sunyani;;;Ghana',
      'URL:https://godport.netlify.app/',
      'END:VCARD'
    ].join('\r\n');

    const file = new Blob([vCard], { type: 'text/vcard;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'amakye-danso-godson.vcf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);

    const toast = document.getElementById('toastNotice');
    if (toast) {
      toast.textContent = 'Contact card downloaded';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    }
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const success = document.getElementById('formSuccessMessage');
    const error = document.getElementById('formErrorMessage');
    const submitButton = form.querySelector('button[type="submit"]');

    if (success) success.style.display = 'none';
    if (error) error.style.display = 'none';
    if (submitButton) submitButton.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) throw new Error('Form submission failed');

      form.reset();
      if (success) success.style.display = 'block';
    } catch (submissionError) {
      if (error) error.style.display = 'block';
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}


function initNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navDrawer = document.getElementById('mobileNavDrawer');
  const desktopMenuBtn = document.getElementById('desktopMenuBtn');
  const desktopNavDropdown = document.getElementById('desktopNavDropdown');

  if (desktopMenuBtn && desktopNavDropdown) {
    desktopMenuBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = desktopNavDropdown.classList.toggle('open');
      desktopMenuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    desktopNavDropdown.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        desktopNavDropdown.classList.remove('open');
        desktopMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (event) => {
      if (!desktopMenuBtn.contains(event.target) && !desktopNavDropdown.contains(event.target)) {
        desktopNavDropdown.classList.remove('open');
        desktopMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (menuBtn && navDrawer) {
    menuBtn.addEventListener('click', () => {
      const isOpen = navDrawer.classList.contains('open');
      if (isOpen) {
        navDrawer.classList.remove('open');
        menuBtn.innerHTML = '<i class="bi bi-list"></i>';
      } else {
        navDrawer.classList.add('open');
        menuBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
      }
    });

    
    navDrawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navDrawer.classList.remove('open');
        menuBtn.innerHTML = '<i class="bi bi-list"></i>';
      });
    });
  }
}


function initTimezoneClock() {
  const clockElement = document.getElementById('localClock');
  if (!clockElement) return;

  function updateTime() {
    const now = new Date();
    
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    };
    clockElement.textContent = `${now.toLocaleTimeString('en-US', options)} GMT`;
  }

  updateTime();
  setInterval(updateTime, 1000);
}


function initCardFlip() {
  const flipper = document.getElementById('businessCardFlipper');
  const flipTrigger = document.getElementById('flipCardTrigger');
  const flipStage = document.getElementById('cardFlipStage');

  if (!flipper) return;

  function toggleFlip(e) {
    
    if (e.target.closest('.qr-redirect-btn')) {
      return;
    }
    flipper.classList.toggle('flipped');
  }

  if (flipStage) {
    flipStage.addEventListener('click', toggleFlip);
  }

  if (flipTrigger) {
    flipTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      flipper.classList.toggle('flipped');
    });
  }
}


function initClipboard() {
  const copyBtns = document.querySelectorAll('.copy-email-btn');
  const toast = document.getElementById('toastNotice');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'mizzlebankai@gmail.com';

      navigator.clipboard.writeText(email).then(() => {
        showToast(`Copied to clipboard: ${email}`);
      }).catch(() => {
        showToast(`Email: ${email}`);
      });
    });
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}


function initCardSpotlight() {
  const cards = document.querySelectorAll('.project-card-outer, .window-outer-shell');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}


function initContactModal() {
  const contactModal = document.getElementById('contactModal');
  const openBtns = document.querySelectorAll('.open-contact-modal');
  const closeBtn = document.getElementById('closeContactModal');

  if (!contactModal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      contactModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      contactModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) {
      contactModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}


function initThemeToggle() {
  const storedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (prefersDark ? 'dark' : 'dark'); 

  applyTheme(initialTheme);

  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');

  toggleBtns.forEach(btn => {
    if (theme === 'light') {
      btn.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
      btn.setAttribute('title', 'Switch to Dark Obsidian Theme');
      btn.setAttribute('aria-label', 'Switch to Dark Obsidian Theme');
    } else {
      btn.innerHTML = '<i class="bi bi-sun-fill"></i>';
      btn.setAttribute('title', 'Switch to Crisp White Theme');
      btn.setAttribute('aria-label', 'Switch to Crisp White Theme');
    }
  });
}


function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

