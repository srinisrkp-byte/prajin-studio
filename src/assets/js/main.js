// Shared interactive logic and progressive enhancement for Prajin Dezaa Portfolio
(function() {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  // Set Current Year
  const yrEl = $('#yr');
  if (yrEl) yrEl.textContent = new Date().getFullYear();

  // Theme Management: Always default to DARK on first visit across all devices.
  // If the user explicitly clicked the toggle, remember their choice.
  const th = $('#theme');
  let mode = 'dark';
  try {
    const saved = localStorage.getItem('theme_preference');
    if (saved === 'light' || saved === 'dark') {
      mode = saved;
    } else {
      mode = 'dark';
    }
  } catch (e) {
    mode = 'dark';
  }
  root.dataset.theme = mode;

  function updateThemeButton(m) {
    if (!th) return;
    th.textContent = m === 'dark' ? '◐' : '☼';
    th.setAttribute('aria-label', m === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    th.setAttribute('title', m === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
  updateThemeButton(mode);

  if (th) {
    th.onclick = () => {
      mode = mode === 'dark' ? 'light' : 'dark';
      root.dataset.theme = mode;
      updateThemeButton(mode);
      try {
        localStorage.setItem('theme_preference', mode);
      } catch (e) {}
    };
  }

  // Mobile Menu Toggle
  const bg = $('#bg');
  const lks = $('#links');
  function menu(open) {
    if (!lks || !bg) return;
    lks.classList.toggle('o', open);
    bg.setAttribute('aria-expanded', open);
    bg.textContent = open ? '✕' : '☰';
    bg.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  if (bg && lks) {
    bg.onclick = () => menu(!lks.classList.contains('o'));
    $$('#links a').forEach(a => a.addEventListener('click', () => menu(false)));
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && lks.classList.contains('o')) {
        menu(false);
        bg.focus();
      }
    });
    document.addEventListener('click', e => {
      if (lks.classList.contains('o') && !e.target.closest('header nav')) menu(false);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 992) menu(false);
    });
  }

  // Language Switcher Dropdown
  const langBtn = $('#langBtn');
  const langMenu = $('#langMenu');
  if (langBtn && langMenu) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langMenu.classList.toggle('show');
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.lang-wrap')) {
        langMenu.classList.remove('show');
      }
    });
  }

  // Spotlight card mouse tracking
  document.addEventListener('pointermove', e => {
    const c = e.target.closest && e.target.closest('.card');
    if (c) {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }
  });

  // 3D Card Tilt & Magnetic Buttons (desktop fine pointer)
  if (!RM && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('.case, .tilt').forEach(c => {
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        c.style.transform = `perspective(900px) rotateY(${(x - 0.5) * 8}deg) rotateX(${(0.5 - y) * 8}deg)`;
      });
      c.addEventListener('pointerleave', () => {
        c.style.transition = 'transform 0.5s ease';
        c.style.transform = '';
        setTimeout(() => c.style.transition = '', 500);
      });
    });

    const cu = $('.cur');
    const dt = $('.dot');
    if (cu && dt) {
      let mx = 0, my = 0, cx = 0, cy = 0;
      window.addEventListener('pointermove', e => {
        mx = e.clientX;
        my = e.clientY;
        dt.style.transform = `translate(${mx}px, ${my}px)`;
      });
      (function followCursor() {
        cx += (mx - cx) * 0.18;
        cy += (my - cy) * 0.18;
        cu.style.transform = `translate(${cx}px, ${cy}px)`;
        requestAnimationFrame(followCursor);
      })();
      $$('a, button, summary, input, textarea').forEach(a => {
        a.addEventListener('pointerenter', () => cu.classList.add('h'));
        a.addEventListener('pointerleave', () => cu.classList.remove('h'));
      });
      $$('.mag').forEach(m => {
        m.addEventListener('pointermove', e => {
          const r = m.getBoundingClientRect();
          m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
        });
        m.addEventListener('pointerleave', () => m.style.transform = '');
      });
    }
  } else {
    document.body.classList.remove('nc');
  }

  // Scroll Progress Bar
  const bar = $('#bar');
  function onScroll() {
    const navEl = $('header nav');
    if (navEl) navEl.classList.toggle('sc', window.scrollY > 20);
    if (bar) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const progress = h > 0 ? window.scrollY / h : 0;
      bar.style.transform = `scaleX(${progress})`;
    }
    const gl = $('#gl');
    if (gl) {
      gl.style.opacity = Math.max(0.25, 1 - window.scrollY / (window.innerHeight * 1.2));
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active Navigation Highlighting
  const sections = $$('main section[id]');
  const navLinks = $$('#links a');
  if (window.IntersectionObserver && sections.length > 0) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle('on', link.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -50%' });
    sections.forEach(s => obs.observe(s));
  }

  // Contact Form Handling (encode to WhatsApp URL)
  const form = $('#form');
  if (form) {
    form.onsubmit = e => {
      e.preventDefault();
      const fn = $('#fn') ? $('#fn').value : 'Client';
      const fm = $('#fm') ? $('#fm').value : '';
      const text = encodeURIComponent(`Hi Prajin, I'm ${fn}. ${fm}`);
      const waNumber = form.dataset.wa || '919360970236';
      window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank', 'noopener');
    };
  }

  // Animated Metric Counters
  function initCounters() {
    $$('[data-n]').forEach(el => {
      const target = +el.dataset.n;
      const suffix = el.dataset.s || '';
      if (!window.gsap || RM) {
        el.textContent = target + suffix;
        return;
      }
      const obj = { v: 0 };
      window.gsap.to(obj, {
        v: target,
        duration: 2,
        ease: 'power2.out',
        delay: 0.5,
        onUpdate: () => el.textContent = Math.round(obj.v) + suffix
      });
    });
  }

  // Smooth Scroll with Lenis and GSAP ScrollTrigger
  function initAnimations() {
    initCounters();
    if (!window.gsap || RM) return;

    root.classList.add('anim');
    if (window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      window.gsap.from('.ln > span', {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.12,
        ease: 'power4.out'
      });
      window.gsap.from('.hero .badge, .hero .lead, .cta, .stats, .hero .me', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        delay: 0.4,
        ease: 'power3.out'
      });
      window.ScrollTrigger.batch('.rv', {
        start: 'top 90%',
        once: true,
        onEnter: batch => window.gsap.to(batch, {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.85,
          ease: 'power3.out'
        })
      });
      const tl = $('#tl');
      if (tl) {
        window.gsap.to(tl, {
          '--p': 1,
          scrollTrigger: {
            trigger: tl,
            start: 'top 70%',
            end: 'bottom 70%',
            scrub: true
          }
        });
        window.gsap.set(tl, { '--p': 0 });
      }
    }
  }

  // Intro Splash Dismissal
  const intro = $('#intro');
  if (intro) {
    if (window.gsap && !RM) {
      window.gsap.to(intro, {
        opacity: 0,
        delay: 0.8,
        duration: 0.45,
        onComplete: () => {
          intro.remove();
          initAnimations();
        }
      });
    } else {
      intro.remove();
      initAnimations();
    }
  } else {
    initAnimations();
  }

  // Lenis Smooth Scroll
  if (window.Lenis && !RM) {
    const lenis = new window.Lenis({ lerp: 0.09 });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href && href.length > 1) {
          const target = $(href);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: -70 });
          }
        }
      });
    });
  }

  // Lazy Initialization of Three.js 3D Hero Scene
  function initThreeHero() {
    if (!window.THREE || RM) return;
    const canvas = $('#gl');
    if (!canvas) return;

    const isMob = window.innerWidth < 768;
    const T = window.THREE;
    const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: !isMob, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMob ? 1.5 : 2));

    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 7;

    const group = new T.Group();
    scene.add(group);

    const col = new T.Color('#38bdf8');
    const wire = new T.Mesh(
      new T.IcosahedronGeometry(1.7, 1),
      new T.MeshBasicMaterial({ color: col, wireframe: true, transparent: true, opacity: 0.65 })
    );
    const core = new T.Mesh(
      new T.IcosahedronGeometry(1.15, 0),
      new T.MeshStandardMaterial({
        color: 0x151a5e,
        emissive: col,
        emissiveIntensity: 0.55,
        roughness: 0.25,
        metalness: 0.8,
        flatShading: true
      })
    );
    const knot = new T.Mesh(
      new T.TorusKnotGeometry(2.4, 0.025, 220, 8, 2, 3),
      new T.MeshBasicMaterial({ color: 0xa855f7 })
    );
    group.add(wire, core, knot);

    scene.add(new T.AmbientLight(0x6666ff, 0.6));
    const pointLight = new T.PointLight(0x38bdf8, 2, 20);
    pointLight.position.set(3, 3, 4);
    scene.add(pointLight);

    function createTexture(fn) {
      const c = document.createElement('canvas');
      c.width = c.height = 128;
      const ctx = c.getContext('2d');
      fn(ctx);
      return new T.CanvasTexture(c);
    }

    const glow = new T.Sprite(new T.SpriteMaterial({
      map: createTexture(ctx => {
        const q = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        q.addColorStop(0, 'rgba(99,102,241,0.8)');
        q.addColorStop(1, 'rgba(99,102,241,0)');
        ctx.fillStyle = q;
        ctx.fillRect(0, 0, 128, 128);
      }),
      blending: T.AdditiveBlending,
      depthWrite: false
    }));
    glow.scale.set(8, 8, 1);
    group.add(glow);

    // Particle Cloud (Throttle on mobile/low-end devices)
    const particleCount = isMob ? 200 : 650;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const a = Math.random() * 6.28;
      const d = 2.6 + Math.random() * 4;
      const y = (Math.random() - 0.5) * 5;
      positions.set([Math.cos(a) * d, y, Math.sin(a) * d], i * 3);
    }
    const particleGeo = new T.BufferGeometry();
    particleGeo.setAttribute('position', new T.BufferAttribute(positions, 3));
    const particles = new T.Points(
      particleGeo,
      new T.PointsMaterial({ size: 0.04, color: 0x9ad8ff, transparent: true, opacity: 0.8, blending: T.AdditiveBlending, depthWrite: false })
    );
    group.add(particles);

    // Floating Code Badges
    const labels = [];
    ['</>', '{ }', 'APP', 'www', '⚡'].forEach((sym, idx) => {
      const sprite = new T.Sprite(new T.SpriteMaterial({
        map: createTexture(ctx => {
          ctx.font = '700 52px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 14;
          ctx.fillStyle = '#fff';
          ctx.fillText(sym, 64, 64);
        }),
        transparent: true,
        depthWrite: false
      }));
      sprite.scale.set(1.1, 1.1, 1);
      sprite.userData = { a: idx * 1.256, r: 3.2 + (idx % 2) * 0.6, y: (idx - 2) * 0.6 };
      group.add(sprite);
      labels.push(sprite);
    });

    const palette = ['#38bdf8', '#6366f1', '#a855f7', '#38bdf8'].map(c => new T.Color(c));
    const currColor = new T.Color();

    let tx = 0, ty = 0, rx = 0, ry = 0;
    let isVisible = true;

    window.addEventListener('pointermove', e => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    });

    function onResize() {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }
    onResize();
    window.addEventListener('resize', onResize);

    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
    });

    const clock = new T.Clock();

    function renderLoop() {
      requestAnimationFrame(renderLoop);
      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();
      const scrollY = window.scrollY;
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      const p = scrollMax > 0 ? scrollY / scrollMax : 0;

      rx += (ty * 0.6 - rx) * 0.05;
      ry += (tx * 0.8 - ry) * 0.05;

      const isWide = window.innerWidth > 992;
      const baseX = isWide ? 2.6 : 0;
      const baseY = isWide ? 0 : 2.1;
      const scaleBase = isWide ? 1 : 0.7;

      group.position.x += ((baseX + Math.sin(p * Math.PI * 3) * (isWide ? 1.4 : 0.6)) - group.position.x) * 0.06;
      group.position.y += ((baseY - p * 2) - group.position.y) * 0.06;
      group.scale.setScalar(scaleBase * (1 + Math.sin(p * Math.PI * 2) * 0.25));

      group.rotation.set(rx + p * 4, ry + elapsed * 0.15 + p * 6, 0);
      core.rotation.y = elapsed * 0.4;
      wire.rotation.x = -elapsed * 0.12;
      knot.rotation.z = elapsed * 0.2;

      const k = p * 3;
      const i = Math.min(2, Math.floor(k));
      currColor.copy(palette[i]).lerp(palette[i + 1], k - i);
      wire.material.color.copy(currColor);
      core.material.emissive.copy(currColor);
      pointLight.color.copy(currColor);

      particles.rotation.y = elapsed * 0.05;
      labels.forEach(lbl => {
        const angle = lbl.userData.a + elapsed * 0.35;
        lbl.position.set(
          Math.cos(angle) * lbl.userData.r,
          lbl.userData.y + Math.sin(elapsed + angle) * 0.2,
          Math.sin(angle) * lbl.userData.r
        );
      });

      renderer.render(scene, camera);
    }

    renderLoop();
  }

  // Defer Three.js canvas setup to idle callback to keep First Contentful Paint < 1.0s
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => initThreeHero(), { timeout: 1500 });
  } else {
    setTimeout(initThreeHero, 300);
  }
})();
