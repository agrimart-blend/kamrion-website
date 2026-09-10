(() => {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  document.querySelectorAll('[data-nav] a[data-route], .sm-panel-item[data-route]').forEach(a => {
    const route = a.getAttribute('data-route');
    if (route && (path === route || path.startsWith(route + '/'))) a.classList.add('active');
  });

  /* ---------------- Staggered off-canvas menu ---------------- */
  function initStaggeredMenu() {
    const wrapper = document.querySelector('.staggered-menu-wrapper');
    const toggle = document.querySelector('[data-menu-toggle]');
    if (!wrapper || !toggle) return;
    const panel = wrapper.querySelector('.staggered-menu-panel');
    const layers = [...wrapper.querySelectorAll('.sm-prelayer')];
    const labels = [...panel.querySelectorAll('.sm-panel-itemLabel')];
    const numbered = [...panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')];
    const socialTitle = panel.querySelector('.sm-socials-title');
    const socialLinks = [...panel.querySelectorAll('.sm-socials-link')];
    const ease = 'cubic-bezier(.23,1,.32,1)';
    let open = false, animating = false;

    function resetClosedStyles() {
      layers.forEach(l => { l.style.opacity = '0'; });
      panel.style.opacity = '0';
      labels.forEach(l => { l.style.transform = 'translateY(140%) rotate(10deg)'; });
      numbered.forEach(el => el.style.setProperty('--sm-num-opacity', '0'));
      if (socialTitle) socialTitle.style.opacity = '0';
      socialLinks.forEach(a => { a.style.opacity = '0'; a.style.transform = 'translateY(25px)'; });
    }
    resetClosedStyles();

    function openMenu() {
      if (animating || open) return;
      animating = true; open = true;
      wrapper.setAttribute('data-open', '');
      document.body.classList.add('menu-open', 'no-scroll');
      layers.forEach((l, i) => {
        l.style.opacity = '1';
        l.animate([{ transform: 'translateX(100%)' }, { transform: 'translateX(0%)' }],
          { duration: 420, delay: i * 70, easing: ease, fill: 'forwards' });
      });
      const panelDelay = layers.length ? layers.length * 70 + 50 : 0;
      panel.style.opacity = '1';
      panel.animate([{ transform: 'translateX(100%)' }, { transform: 'translateX(0%)' }],
        { duration: 520, delay: panelDelay, easing: ease, fill: 'forwards' });
      const itemsStart = panelDelay + 520 * 0.18;
      labels.forEach((label, i) => {
        label.animate([{ transform: 'translateY(140%) rotate(10deg)' }, { transform: 'translateY(0%) rotate(0deg)' }],
          { duration: 500, delay: itemsStart + i * 85, easing: ease, fill: 'forwards' });
        setTimeout(() => { label.style.transform = 'translateY(0%) rotate(0deg)'; }, itemsStart + i * 85 + 500);
      });
      numbered.forEach((el, i) => {
        setTimeout(() => {
          el.style.transition = '--sm-num-opacity .35s ease';
          el.style.setProperty('--sm-num-opacity', '1');
        }, itemsStart + 70 + i * 85);
      });
      const socialsStart = panelDelay + 520 * 0.42;
      if (socialTitle) setTimeout(() => { socialTitle.style.transition = 'opacity .4s'; socialTitle.style.opacity = '1'; }, socialsStart);
      socialLinks.forEach((a, i) => {
        setTimeout(() => {
          a.style.opacity = '1'; a.style.transform = 'translateY(0)';
          a.animate([{ transform: 'translateY(25px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }],
            { duration: 420, easing: 'ease-out', fill: 'forwards' });
        }, socialsStart + 40 + i * 80);
      });
      setTimeout(() => { animating = false; }, panelDelay + 560);
    }

    function closeMenu() {
      if (animating || !open) return;
      animating = true; open = false;
      const closeEase = 'cubic-bezier(.7,0,.84,0)';
      [...layers, panel].forEach(el => {
        el.animate([{ transform: 'translateX(0%)' }, { transform: 'translateX(100%)' }],
          { duration: 300, easing: closeEase, fill: 'forwards' });
      });
      setTimeout(() => {
        wrapper.removeAttribute('data-open');
        document.body.classList.remove('menu-open', 'no-scroll');
        resetClosedStyles();
        animating = false;
      }, 310);
    }

    toggle.addEventListener('click', () => (open ? closeMenu() : openMenu()));
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) closeMenu(); });
    document.addEventListener('click', e => {
      if (!open || animating) return;
      if (panel.contains(e.target) || toggle.contains(e.target)) return;
      closeMenu();
    });
  }

  /* ---------------- Split-flap text ---------------- */
  class SplitFlap {
    constructor(el) {
      this.el = el;
      this.words = JSON.parse(el.dataset.words || '[]').filter(Boolean);
      this.flipDuration = parseFloat(el.dataset.flipDuration || '0.11');
      this.stagger = parseFloat(el.dataset.stagger || '0.045');
      this.cycleDelay = parseFloat(el.dataset.cycleDelay || '2600');
      this.padTo = parseInt(el.dataset.padTo || '18', 10);
      this.charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .';
      this.width = Math.max(this.padTo, ...this.words.map(w => w.length), 1);
      this.index = 0;
      this.current = this.norm(this.words[0] || '');
      this.tiles = [];
      this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.build();
      if (this.words.length > 1 && !this.reduced) {
        this.timer = setTimeout(() => this.next(), this.cycleDelay);
      }
    }
    norm(s) { return (s || '').padEnd(this.width, ' ').slice(0, this.width); }
    build() {
      this.el.innerHTML = '';
      this.el.style.setProperty('--split-flap-flip-duration', this.flipDuration + 's');
      for (let i = 0; i < this.width; i++) {
        const tile = document.createElement('span');
        tile.className = 'split-flap-tile';
        const ch = this.current[i] === ' ' ? ' ' : this.current[i];
        tile.dataset.current = this.current[i];
        tile.innerHTML = `<span class="split-flap-half split-flap-half--top"><span class="split-flap-char">${ch}</span></span><span class="split-flap-half split-flap-half--bottom"><span class="split-flap-char">${ch}</span></span>`;
        this.el.appendChild(tile);
        this.tiles.push(tile);
      }
    }
    sample() { return this.charset[Math.floor(Math.random() * this.charset.length)]; }
    flipTile(tile, target, delay) {
      setTimeout(() => {
        const steps = [this.sample(), this.sample(), this.sample(), target];
        let s = 0;
        const run = () => {
          const from = s === 0 ? (tile.dataset.current || ' ') : steps[s - 1];
          const to = steps[s];
          const front = document.createElement('span');
          front.className = 'split-flap-flap split-flap-flap--front';
          front.innerHTML = `<span class="split-flap-char">${from === ' ' ? ' ' : from}</span>`;
          const back = document.createElement('span');
          back.className = 'split-flap-flap split-flap-flap--back';
          back.innerHTML = `<span class="split-flap-char">${to === ' ' ? ' ' : to}</span>`;
          tile.appendChild(front);
          tile.appendChild(back);
          setTimeout(() => {
            front.remove(); back.remove();
            tile.querySelectorAll('.split-flap-char').forEach(c => { c.textContent = to === ' ' ? ' ' : to; });
            tile.dataset.current = to;
            s++;
            if (s < steps.length) run();
          }, this.flipDuration * 1000);
        };
        run();
      }, delay);
    }
    next() {
      this.index = (this.index + 1) % this.words.length;
      const target = this.norm(this.words[this.index]);
      for (let i = 0; i < this.width; i++) {
        if (target[i] !== this.current[i]) this.flipTile(this.tiles[i], target[i], i * this.stagger * 1000);
      }
      this.current = target;
      this.timer = setTimeout(() => this.next(), this.cycleDelay);
    }
  }

  /* ---------------- Scroll-expand ---------------- */
  class ScrollExpand {
    constructor(el) {
      this.root = el;
      this.track = el.querySelector('.scroll-expand__track');
      this.stage = el.querySelector('.scroll-expand__stage');
      this.frame = el.querySelector('.scroll-expand__frame');
      this.media = el.querySelector('.scroll-expand__media');
      this.scrim = el.querySelector('.scroll-expand__scrim');
      this.overlay = el.querySelector('.scroll-expand__overlay');
      this.title = el.querySelector('.scroll-expand__title');
      this.hint = el.querySelector('.scroll-expand__hint');
      this.startWidth = 44; this.startHeight = 56; this.startRadius = 24; this.endRadius = 0;
      this.mediaZoom = 1.28; this.scrollDistance = 1.1; this.overlayScrim = .55;
      this.ticking = false;
      window.addEventListener('scroll', () => this.requestTick(), { passive: true });
      window.addEventListener('resize', () => { this.measure(); this.apply(this.readProgress()); });
      this.measure();
      this.apply(this.readProgress());
    }
    measure() {
      const stageH = window.innerHeight;
      this.stage.style.height = stageH + 'px';
      this.track.style.height = (stageH * (1 + this.scrollDistance)) + 'px';
    }
    smoothstep(e0, e1, x) { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0 || 1e-6))); return t * t * (3 - 2 * t); }
    readProgress() {
      const stageH = window.innerHeight;
      const span = stageH * this.scrollDistance;
      const top = this.track.getBoundingClientRect().top;
      return Math.min(1, Math.max(0, -top / span));
    }
    apply(p) {
      const e = this.smoothstep(0, 1, p);
      const w = this.startWidth + (100 - this.startWidth) * e;
      const h = this.startHeight + (100 - this.startHeight) * e;
      const ix = Math.max(0, (100 - w) / 2), iy = Math.max(0, (100 - h) / 2);
      const r = this.startRadius + (this.endRadius - this.startRadius) * e;
      this.frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${r}px)`;
      this.media.style.transform = `scale(${this.mediaZoom + (1 - this.mediaZoom) * e})`;
      if (this.scrim) this.scrim.style.opacity = this.overlayScrim * e;
      if (this.title) { const out = this.smoothstep(.4, .88, p); this.title.style.opacity = 1 - out; this.title.style.transform = `translate3d(0,${-28 * out}px,0)`; }
      if (this.hint) { const gone = this.smoothstep(0, .12, p); this.hint.style.opacity = 1 - gone; }
      if (this.overlay) { const inn = this.smoothstep(.66, 1, p); this.overlay.style.opacity = inn; this.overlay.style.transform = `translate3d(0,${18 * (1 - inn)}px,0)`; }
    }
    requestTick() {
      if (this.ticking) return;
      this.ticking = true;
      requestAnimationFrame(() => { this.apply(this.readProgress()); this.ticking = false; });
    }
  }

  /* ---------------- Intro loader ---------------- */
  function initIntroLoader() {
    const root = document.querySelector('[data-intro]');
    if (!root) return;
    const finishNow = () => { root.remove(); document.body.classList.remove('intro-active'); };
    if (sessionStorage.getItem('doe-intro-seen')) { finishNow(); return; }

    const img = root.querySelector('.intro-loader__frame');
    const bar = root.querySelector('.intro-loader__bar span');
    const skip = root.querySelector('.intro-loader__skip');
    const audio = root.querySelector('audio');
    const total = 132;
    const pad = n => String(n).padStart(3, '0');
    const frame = i => `./assets/intro/frames/f${pad(i)}.jpg`;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function finish() {
      sessionStorage.setItem('doe-intro-seen', '1');
      root.classList.add('is-hidden');
      document.body.classList.remove('intro-active');
      if (audio) { audio.pause(); }
      setTimeout(() => root.remove(), 650);
    }
    if (reduced) { sessionStorage.setItem('doe-intro-seen', '1'); finishNow(); return; }

    document.body.classList.add('intro-active');
    let i = 0;
    const fps = 26;
    img.src = frame(0);
    if (audio) { audio.volume = 0.55; audio.play().catch(() => {}); }
    const timer = setInterval(() => {
      i++;
      if (i >= total) { clearInterval(timer); setTimeout(finish, 250); return; }
      img.src = frame(i);
      if (bar) bar.style.width = Math.round((i / (total - 1)) * 100) + '%';
    }, 1000 / fps);
    if (skip) skip.addEventListener('click', () => { clearInterval(timer); finish(); });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initIntroLoader();
    initStaggeredMenu();
    document.querySelectorAll('[data-split-flap]').forEach(el => new SplitFlap(el));
    document.querySelectorAll('.scroll-expand').forEach(el => new ScrollExpand(el));
  });
})();
