// Helper: persist theme
(function(){
  const root = document.documentElement;
  const key = 'theme';
  const saved = localStorage.getItem(key);
  if(saved === 'light') root.classList.add('light');

  const toggle = document.getElementById('themeToggle');
  if(toggle){
    toggle.setAttribute('aria-pressed', String(root.classList.contains('light')));
    toggle.addEventListener('click', () => {
      const isLight = root.classList.toggle('light');
      localStorage.setItem(key, isLight ? 'light' : 'dark');
      toggle.setAttribute('aria-pressed', String(isLight));
      // small bounce effect on knob
      const knob = toggle.querySelector('.knob');
      if(knob){
        knob.animate([
          { transform: 'translate(0, -50%) scale(1)' },
          { transform: 'translate(0, -50%) scale(1.06)' },
          { transform: 'translate(0, -50%) scale(1)' }
        ], { duration: 180, easing: 'ease-out' });
      }
    });
  }
})();

// Mobile nav
(function(){
  const btn = document.querySelector('.nav-toggle');
  const list = document.getElementById('nav-list');
  if(!btn || !list) return;

  const setState = (open)=>{
    list.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open))
  }

  btn.addEventListener('click', ()=>{
    const open = !list.classList.contains('open');
    setState(open);
  });

  list.addEventListener('click', (e)=>{
    if(e.target.matches('a')) setState(false);
  })
})();

// Smooth scroll with offset for sticky header
(function(){
  const header = document.querySelector('.site-header');
  const offset = () => (header?.getBoundingClientRect().height || 0) + 8;

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if(!id || id === '#' || id.startsWith('#!')) return;
      const target = document.querySelector(id);
      if(!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - offset();
      window.scrollTo({top, behavior: 'smooth'});
      history.pushState(null, '', id);
    });
  });
})();

// Section reveal on scroll
(function(){
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
      if(entry.isIntersecting){
        entry.target.classList.add('reveal');
        obs.unobserve(entry.target);
      }
    })
  }, {threshold: .08});

  document.querySelectorAll('.section').forEach(s => obs.observe(s));
})();

// Filters
(function(){
  const chips = document.querySelectorAll('.filters .chip');
  const cards = document.querySelectorAll('.projects-grid .card');
  chips.forEach(chip => {
    chip.addEventListener('click', ()=>{
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const f = chip.dataset.filter;
      cards.forEach(card => {
        const show = f === 'all' || card.dataset.tags?.includes(f);
        card.style.display = show ? '' : 'none';
      })
    })
  })
})();

// Project modals
(function(){
  function openModal(id){
    const m = document.getElementById(id);
    if(!m) return;
    m.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(m){
    m.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', (e)=>{
    const openBtn = e.target.closest('[data-modal]');
    if(openBtn){
      openModal(openBtn.getAttribute('data-modal'));
      return;
    }
    const closeBtn = e.target.closest('[data-close]');
    if(closeBtn){
      const modal = closeBtn.closest('.modal');
      if(modal) closeModal(modal);
    }
  })

  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
      document.querySelectorAll('.modal[aria-hidden="false"]').forEach(m => m.setAttribute('aria-hidden', 'true'));
      document.body.style.overflow = '';
    }
  })
})();

// Contact form (client-side demo)
(function(){
  const form = document.getElementById('contactForm');
  const status = document.querySelector('.form-status');
  if(!form) return;

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    status.textContent = '';

    if(!form.reportValidity()){
      status.textContent = 'Please fill in all required fields correctly.';
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    // Simulate async send
    status.textContent = 'Sending…';
    await new Promise(r => setTimeout(r, 700));
    console.log('Form submitted', data);
    status.textContent = 'Thanks! I will get back to you soon.';
    form.reset();
  })
})();

// Footer year
(function(){
  const y = document.getElementById('year');
  if(y) y.textContent = String(new Date().getFullYear());
})();
