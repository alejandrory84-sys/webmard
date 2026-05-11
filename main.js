document.addEventListener('DOMContentLoaded', () => {

  // --- PRELOADER ---
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => { preloader.style.display = 'none'; }, 700);
      }, 1400);
    });
    // Fallback: remove after 4s in case 'load' doesn't fire
    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => { preloader.style.display = 'none'; }, 700);
    }, 4000);
  }

  // --- SCROLL PROGRESS BAR ---
  const scrollBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    if (!scrollBar) return;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    scrollBar.style.width = ((window.scrollY / total) * 100) + '%';
  });

  // --- NAVBAR SCROLL ---
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // --- PARTICLES CANVAS ---
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const particleCount = window.innerWidth < 768 ? 35 : 75;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', () => { resize(); });

    class Particle {
      constructor() { this.reset(true); }
      reset(init = false) {
        this.x = Math.random() * canvas.width;
        this.y = init ? Math.random() * canvas.height : Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.8 + 0.5;
        this.alpha = Math.random() * 0.6 + 0.1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196, 30, 58, ${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(196, 30, 58, ${0.12 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      connectParticles();
      requestAnimationFrame(animateParticles);
    };
    animateParticles();
  }

  // --- TYPEWRITER ---
  const twTarget = document.getElementById('typewriter-text');
  if (twTarget) {
    const phrases = [
      'ERP que tu equipo realmente usa.',
      'IA que automatiza tu operación.',
      'Consultoría sin ataduras a proveedores.',
      'Adopción garantizada con DigMental™.'
    ];
    let pIdx = 0, cIdx = 0, deleting = false;

    const typeLoop = () => {
      const phrase = phrases[pIdx];
      twTarget.textContent = phrase.substring(0, cIdx);

      let delay = 80;
      if (!deleting) {
        cIdx++;
        if (cIdx > phrase.length) { deleting = true; delay = 2200; }
      } else {
        cIdx--;
        delay = 40;
        if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; delay = 350; }
      }
      setTimeout(typeLoop, delay);
    };
    setTimeout(typeLoop, 1800);
  }

  // --- SCROLL REVEAL (directional) ---
  const allReveal = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const onScroll = () => {
    allReveal.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight - 80) {
        el.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  // --- COUNTERS WITH EASE-OUT ---
  const statNums = document.querySelectorAll('.stat-num');
  let countersStarted = false;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const runCounters = () => {
    statNums.forEach(el => {
      const target = +el.getAttribute('data-target');
      const start = performance.now();
      const dur = 2200;
      const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(easeOut(p) * target);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
    });
  };

  const heroEl = document.getElementById('hero');
  if (heroEl) {
    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !countersStarted) {
        countersStarted = true;
        runCounters();
      }
    }, { threshold: 0.3 }).observe(heroEl);
  }

  // --- 3D TILT ON SERVICE CARDS ---
  if (window.innerWidth > 900) {
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        const rx = ((y - r.height / 2) / r.height) * -10;
        const ry = ((x - r.width / 2) / r.width) * 10;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
        card.style.transition = 'transform 0.1s ease-out';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease';
      });
    });
  }

  // --- PARALLAX HERO BG ---
  const heroBgImg = document.querySelector('.hero-parallax-img');
  if (heroBgImg) {
    window.addEventListener('scroll', () => {
      heroBgImg.style.transform = `translateY(${window.scrollY * 0.28}px)`;
    });
  }

  // --- SMOOTH SCROLL ---
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    });
  });

  // --- CONTACT FORM → send.php → aramirez@mardsystems.net ---
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = document.getElementById('form-submit');
      btn.textContent = 'Enviando...';
      btn.disabled = true;

      const showMsg = (text, ok) => {
        const msg = document.createElement('div');
        msg.className = 'form-success-msg';
        if (!ok) {
          msg.style.background = 'rgba(239,68,68,0.1)';
          msg.style.borderColor = 'rgba(239,68,68,0.3)';
          msg.style.color = '#f87171';
        }
        msg.innerHTML = text;
        form.parentNode.insertBefore(msg, form);
        setTimeout(() => msg.remove(), 8000);
      };

      try {
        const res = await fetch('send.php', {
          method: 'POST',
          body: new FormData(form)
        });
        const json = await res.json();
        if (json.success) {
          showMsg('&#10003; ¡Solicitud enviada! Te contactaremos en menos de 24 horas.', true);
          form.reset();
        } else {
          throw new Error(json.message || 'Error');
        }
      } catch {
        showMsg('&#9888; Error al enviar. Escríbenos directamente a <a href="mailto:aramirez@mardsystems.net" style="color:inherit;text-decoration:underline">aramirez@mardsystems.net</a>', false);
      }

      btn.textContent = 'Enviar mi solicitud →';
      btn.disabled = false;
    });
  }

  // --- MOBILE MENU ---
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
  }

  // --- HIGHLIGHT NAV LINK ON SCROLL ---
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('nav-active', a.getAttribute('href') === '#' + current);
    });
  });

});
