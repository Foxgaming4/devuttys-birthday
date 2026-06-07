/* ============================================================
   Devika — main.js
   Story-game flow: a centered instruction animates in, then the
   section reveals. Synth sound, fireworks, LED lights, floating
   stickers, birthday fortune, and a story-game scene flow.
   ============================================================ */
(function () {
  "use strict";
  const CFG = window.BIRTHDAY_CONFIG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const rand = (a, b) => a + Math.random() * (b - a);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = typeof gsap !== "undefined";
  if (hasGSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  const PNG = "assets/Pngs/";
  const MELODY = PNG + "My Melody Pixel Sticker - Find & Share on GIPHY.gif";
  const DECOR = [
    PNG + "pink_butterfly.png", PNG + "pink_hearts.png", PNG + "pink_2hearts.png",
    PNG + "pink_spark.png", PNG + "pink_flowers.png", PNG + "green_luckyleaf.png", PNG + "pink_stobray.png"
  ];

  /* ========================================================
     SOUND — tiny Web Audio synth (no files needed)
     ======================================================== */
  const Sound = (() => {
    let ctx, muted = false;
    const ac = () => (ctx || (ctx = new (window.AudioContext || window.webkitAudioContext)()));
    function tone({ f = 600, to = null, dur = 0.12, type = "sine", g = 0.05, t0 = 0 }) {
      if (muted) return;
      const c = ac(), t = c.currentTime + t0;
      const o = c.createOscillator(), gain = c.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t);
      if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(g, t + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(gain); gain.connect(c.destination);
      o.start(t); o.stop(t + dur + 0.03);
    }
    return {
      resume() { try { ac().resume(); } catch (e) {} },
      setMuted(m) { muted = m; },
      pop()    { tone({ f: 520, to: 880, dur: 0.13, g: 0.045 }); },
      tap()    { tone({ f: 320, to: 220, dur: 0.06, type: "triangle", g: 0.04 }); },
      light()  { tone({ f: 700, to: 1100, dur: 0.1, g: 0.04 }); },
      sparkle(){ [1200, 1600, 2100].forEach((f, i) => tone({ f, dur: 0.16, g: 0.025, t0: i * 0.05 })); },
      chime()  { [659, 988, 1319].forEach((f, i) => tone({ f, dur: 0.5, type: "sine", g: 0.04, t0: i * 0.07 })); },
      success(){ [523, 659, 784, 1047].forEach((f, i) => tone({ f, dur: 0.45, type: "triangle", g: 0.045, t0: i * 0.1 })); },
      pew()    { tone({ f: 180, to: 90, dur: 0.18, type: "sawtooth", g: 0.03 }); },
      boom()   { tone({ f: 130, to: 60, dur: 0.45, type: "sine", g: 0.05 }); },
      whoosh() { tone({ f: 900, to: 200, dur: 0.4, type: "sine", g: 0.04 }); }
    };
  })();

  /* ========================================================
     SMALL TOAST POPUPS (feedback + random notes)
     ======================================================== */
  const Toast = (() => {
    const stack = $("#popup-stack"); const q = []; let active = 0;
    function show(msg, opts = {}) { q.push({ msg, opts }); drain(); }
    function drain() {
      if (active >= 2 || !q.length) return;
      const { msg, opts } = q.shift(); active++;
      const el = document.createElement("div");
      el.className = "popup";
      el.innerHTML = `<span class="pi">${opts.icon || "✦"}</span><span>${msg}</span>`;
      stack.appendChild(el);
      (opts.sound || Sound.pop)();
      const dur = opts.duration || 3200;
      if (hasGSAP) {
        gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.6)" });
        gsap.to(el, { opacity: 0, y: -14, scale: .96, duration: .45, delay: dur / 1000,
          onComplete: () => { el.remove(); active--; drain(); } });
      } else { el.style.opacity = 1; el.style.transform = "none"; setTimeout(() => { el.remove(); active--; drain(); }, dur); }
    }
    return { show };
  })();

  /* ========================================================
     BACKGROUND dots + floating PNG stickers + LED lights
     ======================================================== */
  function buildAmbience() {
    // subtle dots
    const cv = $("#bg-particles"), ctx = cv.getContext("2d");
    let w, h, dots;
    function resize() {
      w = cv.width = innerWidth; h = cv.height = innerHeight;
      const n = Math.min(24, Math.floor(w / 64));
      dots = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: rand(.6, 2),
        vy: rand(-.16, -.04), vx: rand(-.07, .07), a: rand(.12, .42) }));
    }
    function tick() {
      ctx.clearRect(0, 0, w, h);
      const col = getComputedStyle(document.body).getPropertyValue("--accent").trim() || "#e0608a";
      for (const d of dots) { d.y += d.vy; d.x += d.vx; if (d.y < -5) { d.y = h + 5; d.x = Math.random() * w; }
        ctx.globalAlpha = d.a; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.28); ctx.fill(); }
      ctx.globalAlpha = 1; requestAnimationFrame(tick);
    }
    resize(); addEventListener("resize", resize); if (!reduced) requestAnimationFrame(tick);

    // floating stickers
    const layer = $("#decor");
    const n = reduced ? 4 : 8;
    for (let i = 0; i < n; i++) {
      const img = document.createElement("img");
      img.className = "float-png"; img.src = DECOR[i % DECOR.length]; img.alt = "";
      const size = rand(26, 56);
      img.style.width = size + "px";
      img.style.left = rand(2, 94) + "%";
      img.style.setProperty("--o", rand(.4, .75));
      img.style.setProperty("--rot", rand(-40, 40) + "deg");
      img.style.animationDuration = rand(20, 38) + "s";
      img.style.animationDelay = "-" + rand(0, 30) + "s";
      if (DECOR[i % DECOR.length].includes("stobray")) img.style.imageRendering = "pixelated";
      layer.appendChild(img);
    }

    // LED party lights
    const led = $("#led-top");
    const cols = ["#ff5fa2", "#5fd0ff", "#ffd84e", "#8aff9e", "#c79bff", "#ff905f"];
    const count = Math.max(10, Math.floor(innerWidth / 46));
    for (let i = 0; i < count; i++) {
      const b = document.createElement("span");
      b.className = "bulb";
      b.style.color = cols[i % cols.length];
      b.style.animationDelay = (i * 0.18 % 2.4) + "s";
      led.appendChild(b);
    }
  }

  /* ========================================================
     FIREWORKS (canvas) — used in hero + ending
     ======================================================== */
  function fireworks(canvas) {
    const ctx = canvas.getContext("2d");
    let w, h, sparks = [];
    function size() { w = canvas.width = canvas.clientWidth; h = canvas.height = canvas.clientHeight; }
    size(); addEventListener("resize", size);
    const hues = [330, 300, 280, 350, 200, 45];
    function burst(x, y) {
      x = x ?? rand(w * .15, w * .85); y = y ?? rand(h * .12, h * .5);
      const hue = hues[(Math.random() * hues.length) | 0], n = 30;
      for (let i = 0; i < n; i++) {
        const a = (6.283 * i) / n, sp = rand(1.2, 4.2);
        sparks.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, hue: hue + rand(-15, 15) });
      }
      Sound.boom();
    }
    function loop() {
      ctx.fillStyle = "rgba(0,0,0,0)"; ctx.clearRect(0, 0, w, h);
      for (const s of sparks) { s.x += s.vx; s.y += s.vy; s.vy += .03; s.life -= .012;
        ctx.globalAlpha = Math.max(0, s.life); ctx.fillStyle = `hsl(${s.hue},85%,62%)`;
        ctx.beginPath(); ctx.arc(s.x, s.y, 2.2, 0, 6.28); ctx.fill(); }
      ctx.globalAlpha = 1; sparks = sparks.filter(s => s.life > 0);
      requestAnimationFrame(loop);
    }
    if (!reduced) loop();
    return burst;
  }

  /* ========================================================
     TEXT SPLIT helpers
     ======================================================== */
  function freshSplit(el) {
    const text = el.textContent; el.textContent = "";
    text.split(/(\s+)/).forEach(p => {
      if (p === "") return;
      if (/^\s+$/.test(p)) { el.appendChild(document.createTextNode(" ")); return; }
      const w = document.createElement("span"); w.className = "word";
      const i = document.createElement("span"); i.className = "wi"; i.textContent = p;
      w.appendChild(i); el.appendChild(w);
    });
    return $$(".wi", el);
  }
  function splitStructured(el) { // preserves <br> and inner spans (hero title)
    const walk = (node, out) => node.childNodes.forEach(n => {
      if (n.nodeType === 3) n.textContent.split(/(\s+)/).forEach(part => {
        if (part === "") return;
        if (/^\s+$/.test(part)) { out.appendChild(document.createTextNode(" ")); return; }
        const w = document.createElement("span"); w.className = "word";
        const i = document.createElement("span"); i.className = "wi"; i.textContent = part;
        w.appendChild(i); out.appendChild(w);
      });
      else if (n.nodeName === "BR") out.appendChild(document.createElement("br"));
      else { const c = n.cloneNode(false); walk(n, c); out.appendChild(c); }
    });
    const frag = document.createElement("span"); walk(el, frag);
    el.innerHTML = ""; el.appendChild(frag);
    return $$(".wi", el);
  }

  /* ========================================================
     INTRO  (started by the lock gate once unlocked)
     ======================================================== */
  let introStarted = false;
  function initIntro() {
    if (introStarted) return; introStarted = true;
    const box = $("#intro-text"), beginBtn = $("#begin-btn"), introAudio = $("#intro-audio");
    let audioStarted = false, started = false;
    function startSound() {
      Sound.resume();
      if (!audioStarted) { audioStarted = true; $("#sound-hint").classList.add("hidden");
        introAudio.volume = 0; introAudio.play().then(() => {
          let v = 0; const f = setInterval(() => { v = Math.min(.5, v + .03); introAudio.volume = v; if (v >= .5) clearInterval(f); }, 120);
        }).catch(() => {}); }
    }
    document.body.addEventListener("pointerdown", startSound);
    const lines = CFG.intro; let i = 0;
    function next() {
      if (i >= lines.length) { reveal(); return; }
      const final = i === lines.length - 1;
      box.className = "intro-text" + (final ? " final" : "");
      box.innerHTML = `<span class="il">${lines[i]}</span>`;
      const il = box.firstChild;
      if (hasGSAP) {
        gsap.fromTo(il, { opacity: 0, y: 16, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, ease: "power2.out" });
        gsap.to(il, { opacity: final ? 1 : 0, y: final ? 0 : -14, filter: final ? "blur(0px)" : "blur(4px)", duration: .8, delay: final ? 2.4 : 1.7, onComplete: () => { i++; next(); } });
      } else { il.style.opacity = 1; setTimeout(() => { i++; next(); }, 1800); }
      Sound.sparkle();
    }
    function reveal() { beginBtn.classList.remove("hidden");
      if (hasGSAP) gsap.fromTo(beginBtn, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .8, ease: "power2.out" }); }
    setTimeout(next, 700);
    beginBtn.addEventListener("click", () => {
      if (started) return; started = true; startSound(); Sound.whoosh();
      if (hasGSAP) gsap.to("#intro", { opacity: 0, duration: 1, ease: "power2.inOut", onComplete: enter }); else enter();
    });
    function enter() { $("#intro").classList.add("hidden"); $("#site").classList.remove("hidden"); initSite(); }
  }

  /* ========================================================
     UNLOCK TIMER — the site stays locked until the birthday.
     Hidden dev override: Ctrl+Shift+U  (or just type "foxy")
     ======================================================== */
  function setText(sel, txt) { const el = $(sel); if (el && txt != null) el.textContent = txt; }
  (function lockGate() {
    const lockEl = $("#lock");
    const target = (() => { const t = new Date(CFG.unlockDate).getTime(); return isNaN(t) ? null : t; })();
    let unlocked = false, iv = null;

    function unlock(forced) {
      if (unlocked) return; unlocked = true;
      if (iv) clearInterval(iv);
      if (forced) Sound.resume();
      if (lockEl) {
        if (hasGSAP) gsap.to(lockEl, { opacity: 0, duration: .8, ease: "power2.inOut", onComplete: () => lockEl.classList.add("hidden") });
        else lockEl.classList.add("hidden");
      }
      initIntro();
    }

    // hidden developer force-unlock
    let typed = "";
    addEventListener("keydown", e => {
      if (e.ctrlKey && e.shiftKey && (e.key === "U" || e.key === "u")) { e.preventDefault(); unlock(true); return; }
      typed = (typed + (e.key.length === 1 ? e.key.toLowerCase() : "")).slice(-4);
      if (typed === "foxy") unlock(true);
    });

    // already past the unlock time → open straight away
    if (!target || Date.now() >= target) { if (lockEl) lockEl.classList.add("hidden"); initIntro(); return; }

    // locked: show countdown
    if (lockEl) lockEl.classList.remove("hidden");
    const L = CFG.lock || {};
    setText("#lock-kicker", L.kicker);
    setText("#lock-title", L.title || ("Something for " + (CFG.nickname || CFG.name || "you")));
    setText("#lock-foot", L.foot);
    setText("#lock-date", new Date(target).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }));
    const cd = { d: $("#cd-d"), h: $("#cd-h"), m: $("#cd-m"), s: $("#cd-s") };
    const pad = n => String(n).padStart(2, "0");
    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) { unlock(false); return; }
      cd.d && (cd.d.textContent = pad(Math.floor(diff / 864e5)));
      cd.h && (cd.h.textContent = pad(Math.floor(diff / 36e5) % 24));
      cd.m && (cd.m.textContent = pad(Math.floor(diff / 6e4) % 60));
      cd.s && (cd.s.textContent = pad(Math.floor(diff / 1e3) % 60));
    }
    tick(); iv = setInterval(tick, 1000);
  })();

  /* ========================================================
     SITE INIT
     ======================================================== */
  let started = false;
  function initSite() {
    if (started) return; started = true;
    buildAmbience();
    buildHero(); buildGallery(); buildCake(); buildLetter(); buildGame();
    buildMusic(); buildFortune(); buildEnding();
    setupControls(); setupEasterEggs(); startRandomMessages();
    initScenes();
    confettiSoft({ particleCount: 60, spread: 70 });
  }

  /* ========================================================
     HERO
     ======================================================== */
  function buildHero() {
    $(".hero-kicker").textContent = CFG.heroKicker;
    $("#hero-melody").src = MELODY;
    const bd = new Date(CFG.birthDate), ageNum = $("#age-num");
    let n = 0; const grow = setInterval(() => { n++; ageNum.textContent = n; if (n >= CFG.age) clearInterval(grow); }, 60);
    const precise = $("#age-precise");
    (function tickAge() { precise.textContent = ((Date.now() - bd) / (365.25 * 864e5)).toFixed(7);
      requestAnimationFrame(() => setTimeout(tickAge, 60)); })();
    const tw = $("#typewriter"), text = CFG.heroTypewriter; let c = 0;
    setTimeout(function type() { if (c <= text.length) { tw.textContent = text.slice(0, c); c++; setTimeout(type, 48); } }, 1400);
    // hero fireworks (occasional)
    const fw = fireworks($("#hero-fw"));
    setInterval(() => { if (Math.random() < .5) fw(); }, 2600);
    setTimeout(() => fw(), 900);
  }

  function setupHeroAnim() {
    const title = $(".hero-title");
    if (!hasGSAP) { $$("#hero [data-reveal]").forEach(e => { e.style.opacity = 1; e.style.transform = "none"; });
      if (title) splitStructured(title).forEach(w => w.style.transform = "none"); return; }
    if (title) { const words = splitStructured(title);
      gsap.to(words, { y: 0, duration: 1, ease: "power3.out", stagger: .08, delay: .2 }); }
    gsap.utils.toArray("#hero [data-reveal]").forEach((el, i) =>
      gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: .5 + i * .12 }));
  }

  /* ========================================================
     STORY GATES — instruction first, then the section reveals
     ======================================================== */
  /* ---- SCENE CONTROLLER — one section at a time, auto-advancing ---- */
  let scenes = [], current = -1, advancing = false, contBtn;
  function initScenes() {
    const inst = CFG.instructions || {};
    $$(".gated").forEach(sec => { $(".gate-text", sec).textContent = inst[sec.id] || ""; });
    scenes = $$("#site > .section");
    $("#site").classList.add("scene-mode");
    document.body.classList.add("scene-active");
    contBtn = $("#scene-continue");
    contBtn.addEventListener("click", () => { Sound.tap(); nextScene(); });
    addEventListener("keydown", e => {
      if (e.key === "Enter" && contBtn.classList.contains("show")) { e.preventDefault(); nextScene(); }
    });
    goScene(0);
  }
  function goScene(i) {
    if (i < 0 || i >= scenes.length || i === current) return;
    current = i;
    scenes.forEach((s, idx) => s.classList.toggle("active", idx === i));
    $("#scroll-progress").style.width = ((i + 1) / scenes.length * 100) + "%";
    hideContinue();
    const sec = scenes[i]; sec.scrollTop = 0;
    activateScene(sec);
  }
  function nextScene() {
    if (advancing || current >= scenes.length - 1) return;
    advancing = true; Sound.whoosh(); goScene(current + 1);
    setTimeout(() => advancing = false, 850);
  }
  function autoAdvanceFrom(at, delay) { setTimeout(() => { if (current === at) nextScene(); }, delay); }
  function showContinue() {
    contBtn.querySelector("span").textContent = current === scenes.length - 2 ? "one last thing" : "continue";
    contBtn.classList.add("show");
  }
  function hideContinue() { contBtn.classList.remove("show"); }
  function activateScene(sec) {
    if (sec.dataset.activated) { if (sec.id !== "ending") showContinue(); return; }
    sec.dataset.activated = "1";
    if (sec.id === "hero") { setupHeroAnim(); setTimeout(showContinue, 1800); return; }
    if (sec.id === "ending") { runEnding(); return; }
    if (sec.classList.contains("gated")) { runGate(sec); return; }
    showContinue();
  }
  function runGate(sec) {
    const gate = $(".gate", sec), gtext = $(".gate-text", sec), cue = $(".gate-cue", sec), body = $(".sbody", sec);
    if (!hasGSAP) { gate.style.display = "none"; body.style.opacity = 1; revealBodyStatic(body); showContinue(); return; }
    const words = freshSplit(gtext); Sound.chime();
    gsap.fromTo(words, { y: "115%" }, { y: 0, duration: .8, stagger: .045, ease: "power3.out" });
    gsap.to(cue, { opacity: 1, duration: .5, delay: words.length * .045 + .7 });
    let opened = false;
    const open = () => {
      if (opened) return; opened = true;
      gsap.to(gate, { opacity: 0, duration: .6, ease: "power2.inOut", onComplete: () => gate.style.display = "none" });
      revealBody(body); setTimeout(showContinue, 750);
    };
    const t = setTimeout(open, 1600 + words.length * 120);
    const skip = e => { if (e) e.stopPropagation(); clearTimeout(t); open(); };
    cue.addEventListener("click", skip, { once: true });
    gate.addEventListener("click", () => skip(), { once: true });
  }
  function revealBody(body) {
    gsap.set(body, { opacity: 1 });
    const title = body.querySelector("[data-split]");
    if (title) { const w = freshSplit(title); gsap.fromTo(w, { y: "115%" }, { y: 0, duration: .9, stagger: .05, ease: "power3.out", delay: .1 }); }
    gsap.fromTo(body.querySelectorAll("[data-reveal]"), { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .9, stagger: .1, ease: "power3.out", delay: .15 });
  }
  function revealBodyStatic(body) {
    const title = body.querySelector("[data-split]"); if (title) freshSplit(title).forEach(w => w.style.transform = "none");
    body.querySelectorAll("[data-reveal]").forEach(e => { e.style.opacity = 1; e.style.transform = "none"; });
  }

  /* ========================================================
     GALLERY + LIGHTBOX
     ======================================================== */
  const isVideo = src => /\.(mp4|webm|mov|ogg|m4v)(\?|$)/i.test(src || "");

  function buildGallery() {
    const grid = $("#gallery-grid"); const emo = ["🌙", "✶", "❀", "♡", "✦", "❁"];
    CFG.gallery.forEach((p, idx) => {
      const card = document.createElement("div"); card.className = "photo";
      const ph = document.createElement("div"); ph.className = "ph";
      if (isVideo(p.src)) {
        card.classList.add("is-video");
        const v = document.createElement("video");
        v.muted = true; v.loop = true; v.playsInline = true; v.preload = "metadata"; v.className = "ph-vid";
        v.src = p.src;
        v.onerror = () => { ph.innerHTML = `<span class="ph-emoji">🎬</span>`; };
        ph.appendChild(v);
        ph.insertAdjacentHTML("beforeend", `<span class="vid-badge">▶</span>`);
        // preview on hover (desktop), gentle autoplay loop on touch
        card.addEventListener("pointerenter", () => { v.play().catch(() => {}); });
        card.addEventListener("pointerleave", () => { v.pause(); v.currentTime = 0; });
      } else {
        const img = new Image(); img.alt = p.caption;
        img.onerror = () => { ph.innerHTML = `<span class="ph-emoji">${emo[idx % emo.length]}</span>`; };
        img.src = p.src; ph.appendChild(img);
      }
      const cap = document.createElement("div"); cap.className = "cap"; cap.textContent = p.caption;
      card.append(ph, cap);
      card.addEventListener("click", e => { Sound.sparkle(); burstHearts(e.clientX, e.clientY); openLightbox(p); });
      grid.appendChild(card);
    });
    $("#lb-close").addEventListener("click", closeLightbox);
    $("#lightbox").addEventListener("click", e => { if (e.target.id === "lightbox") closeLightbox(); });
    addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });
  }
  function openLightbox(p) {
    const lb = $("#lightbox"), img = $("#lb-img"), vid = $("#lb-video");
    if (isVideo(p.src)) {
      img.classList.add("hidden"); img.removeAttribute("src");
      vid.classList.remove("hidden"); vid.src = p.src; vid.currentTime = 0;
      vid.muted = false; vid.play().catch(() => {});
    } else {
      vid.pause(); vid.classList.add("hidden"); vid.removeAttribute("src");
      img.classList.remove("hidden");
      img.onerror = () => { img.style.display = "none"; };
      img.onload = () => { img.style.display = "block"; };
      img.src = p.src; img.style.display = "block";
    }
    $("#lb-caption").textContent = p.caption; lb.classList.remove("hidden");
  }
  function closeLightbox() {
    const vid = $("#lb-video"); if (vid) { vid.pause(); }
    $("#lightbox").classList.add("hidden");
  }
  function burstHearts(x, y) {
    for (let i = 0; i < 6; i++) { const h = document.createElement("div"); h.className = "fly-heart"; h.textContent = "♥";
      h.style.left = x + "px"; h.style.top = y + "px"; h.style.fontSize = rand(.8, 1.5) + "rem";
      h.style.transform = `translateX(${rand(-30, 30)}px)`; document.body.appendChild(h); setTimeout(() => h.remove(), 1300); }
  }

  /* ========================================================
     CAKE
     ======================================================== */
  function buildCake() {
    const box = $("#candles"), N = 5; let lit = 0;
    for (let i = 0; i < N; i++) { const c = document.createElement("div"); c.className = "candle"; c.innerHTML = '<div class="flame"></div>';
      c.addEventListener("click", e => { e.stopPropagation();
        if (!c.classList.contains("lit")) { c.classList.add("lit"); lit++; Sound.light();
          if (lit === N) Toast.show("all lit — now make a wish 🌬️", { sound: Sound.sparkle }); } });
      box.appendChild(c); }
    const allLit = () => $$(".candle.lit").length === N;
    function blow() {
      if (!allLit()) { Toast.show("light all the candles first 😊", { sound: Sound.pop }); return; }
      $$(".candle").forEach((c, i) => setTimeout(() => c.classList.remove("lit"), i * 110));
      $("#cake-wrap").classList.add("blown"); setTimeout(() => $("#cake-wrap").classList.remove("blown"), 600);
      Sound.success(); confettiSoft({ particleCount: 170, spread: 130, origin: { y: .45 } });
      Toast.show("Happy Birthday, Devika 🎂", { sound: Sound.chime, duration: 4200 });
      autoAdvanceFrom(current, 3200);
    }
    $("#blow-btn").addEventListener("click", blow);
    $("#cake-wrap").addEventListener("click", () => { $$(".candle").forEach(c => c.classList.add("lit")); lit = N; Sound.light(); });
    $("#mic-btn").addEventListener("click", async () => {
      if (!allLit()) { Toast.show("light all the candles first 😊", { sound: Sound.pop }); return; }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const a = new (window.AudioContext || window.webkitAudioContext)(); const an = a.createAnalyser(); an.fftSize = 512;
        a.createMediaStreamSource(stream).connect(an); const data = new Uint8Array(an.frequencyBinCount); let done = false;
        Toast.show("listening… blow! 🌬️", { sound: Sound.pop });
        (function listen() { an.getByteFrequencyData(data); const avg = data.reduce((s, v) => s + v, 0) / data.length;
          if (avg > 55 && !done) { done = true; blow(); stream.getTracks().forEach(t => t.stop()); a.close(); return; }
          if (!done) requestAnimationFrame(listen); })();
        setTimeout(() => { if (!done) { done = true; stream.getTracks().forEach(t => t.stop());
          Toast.show("couldn't hear it — tap “blow the candles” 😊", { sound: Sound.pop }); } }, 8000);
      } catch (e) { Toast.show("mic unavailable — tap “blow the candles” 😊", { sound: Sound.pop }); }
    });
  }

  /* ========================================================
     LETTER
     ======================================================== */
  function buildLetter() {
    $("#letter-title").textContent = CFG.letterTitle || "A Letter For You";
    const env = $("#envelope"), paper = $("#paper"), textEl = $("#paper-text"); let opened = false;
    env.addEventListener("click", () => { if (opened) return; opened = true; Sound.whoosh(); env.classList.add("open");
      setTimeout(() => {
        paper.classList.add("show");
        writeInk(textEl, CFG.letter);
        // once the open animation is done, drop the height clamp so long letters show fully
        setTimeout(() => { paper.style.maxHeight = "none"; paper.style.overflow = "visible"; }, 1100);
      }, 480); });
  }
  function writeInk(el, text) {
    el.textContent = ""; let i = 0; const speed = reduced ? 0 : 14;
    (function step() { if (i <= text.length) { el.textContent = text.slice(0, i); i += reduced ? text.length : 1; if (i <= text.length) setTimeout(step, speed); } })();
  }

  /* ========================================================
     MINI GAME — Diamond Hunt
     ======================================================== */
  function buildGame() {
    const board = $("#game-board"), player = $("#game-player");
    const scoreEl = $("#game-score"), livesEl = $("#game-lives");
    let score = 0, lives = 3, playing = false, items = [], px = 0, py = 0, raf, spawnTimer; const keys = {};
    function reset() { score = 0; lives = 3; scoreEl.textContent = 0; livesEl.textContent = 3;
      items.forEach(it => it.el.remove()); items = [];
      const r = board.getBoundingClientRect(); px = r.width / 2 - 18; py = r.height / 2 - 18; player.style.transform = `translate(${px}px,${py}px)`; }
    function spawn() { const r = board.getBoundingClientRect(), creeper = Math.random() < .34;
      const el = document.createElement("div"); el.className = "game-item"; el.textContent = creeper ? "💥" : "💎";
      const x = rand(6, r.width - 38), y = rand(6, r.height - 38); el.style.transform = `translate(${x}px,${y}px)`;
      board.appendChild(el); items.push({ el, x, y, creeper, born: Date.now() }); }
    function end(win) { playing = false; cancelAnimationFrame(raf); clearInterval(spawnTimer);
      items.forEach(it => it.el.remove()); items = []; $("#game-start").textContent = "play again";
      if (win) { Sound.success(); confettiSoft({ particleCount: 180, spread: 150 }); reward(); autoAdvanceFrom(current, 4000); }
      else { Sound.pop(); Toast.show("the creepers got you — try again 💚", { sound: Sound.pop }); } }
    function loop() { if (!playing) return; const r = board.getBoundingClientRect(), sp = 4.4;
      if (keys.l) px -= sp; if (keys.r) px += sp; if (keys.u) py -= sp; if (keys.d) py += sp;
      px = Math.max(0, Math.min(r.width - 36, px)); py = Math.max(0, Math.min(r.height - 36, py));
      player.style.transform = `translate(${px}px,${py}px)`;
      for (const it of items.slice()) {
        if (Math.abs(it.x - px) < 32 && Math.abs(it.y - py) < 32) {
          if (it.creeper) { lives--; livesEl.textContent = lives; Sound.pew(); it.el.remove(); items.splice(items.indexOf(it), 1); if (lives <= 0) { end(false); return; } }
          else { score++; scoreEl.textContent = score; Sound.light(); it.el.remove(); items.splice(items.indexOf(it), 1); if (score >= 10) { end(true); return; } }
        }
        if (Date.now() - it.born > 4200) { it.el.remove(); items.splice(items.indexOf(it), 1); }
      }
      raf = requestAnimationFrame(loop); }
    $("#game-start").addEventListener("click", () => { reset(); playing = true; $("#game-start").textContent = "playing…"; spawnTimer = setInterval(spawn, 820); loop(); });
    const map = { ArrowLeft: "l", a: "l", ArrowRight: "r", d: "r", ArrowUp: "u", w: "u", ArrowDown: "d", s: "d" };
    addEventListener("keydown", e => { const k = map[e.key] || map[e.key.toLowerCase()]; if (k) { keys[k] = true; if (playing) e.preventDefault(); } });
    addEventListener("keyup", e => { const k = map[e.key] || map[e.key.toLowerCase()]; if (k) keys[k] = false; });
    let drag = false;
    board.addEventListener("pointerdown", e => { drag = true; move(e); });
    board.addEventListener("pointermove", e => { if (drag) move(e); });
    addEventListener("pointerup", () => drag = false);
    function move(e) { if (!playing) return; const r = board.getBoundingClientRect();
      px = Math.max(0, Math.min(r.width - 36, e.clientX - r.left - 18)); py = Math.max(0, Math.min(r.height - 36, e.clientY - r.top - 18));
      player.style.transform = `translate(${px}px,${py}px)`; }
    function reward() { const wrap = $(".game-wrap"); const old = wrap.querySelector(".game-note"); if (old) old.remove();
      const note = document.createElement("div"); note.className = "game-note";
      note.innerHTML = `<div class="gn-title">You unlocked a secret message ♥</div><div class="gn-msg">${CFG.gameSecret}</div>`;
      wrap.appendChild(note); if (hasGSAP) gsap.from(note, { opacity: 0, y: 24, duration: .8, ease: "power3.out" }); }
  }

  /* ========================================================
     MUSIC
     ======================================================== */
  function buildMusic() {
    const tracks = (CFG.playlist || []).filter(t => t && t.title);
    const artistOf = t => t.artist || CFG.musicArtist || "";
    const list = $("#playlist"), title = $("#np-title"), artist = $("#np-artist");
    const btn = $("#music-toggle"), vinyl = $("#vinyl");
    let idx = 0;
    const audio = new Audio(); audio.preload = "auto";

    // render playlist rows (click a row to play that song)
    const rows = tracks.map((t, i) => {
      const c = document.createElement("div"); c.className = "song";
      c.innerHTML = `<span class="s-ix">${i + 1}</span><span class="s-meta"><span class="st">${esc(t.title)}</span>` +
        (t.note ? `<span class="sn">${esc(t.note)}</span>` : "") + `</span><span class="s-eq">♪</span>`;
      c.addEventListener("click", () => { load(i, true); });
      list.appendChild(c); return c;
    });

    function paint() {
      const t = tracks[idx] || { title: "—" };
      title.textContent = t.title; artist.textContent = artistOf(t);
      rows.forEach((r, i) => r.classList.toggle("playing", i === idx));
    }
    function load(i, autoplay) {
      if (!tracks.length) return;
      idx = (i + tracks.length) % tracks.length;
      audio.src = tracks[idx].src || ""; paint();
      if (autoplay) play();
    }
    function play() { audio.play().then(() => setPlaying(true)).catch(() => setPlaying(true)); }
    function pause() { audio.pause(); setPlaying(false); }
    function setPlaying(on) { vinyl.classList.toggle("playing", on); btn.textContent = on ? "❚❚" : "▶"; }

    btn.addEventListener("click", () => { Sound.tap(); audio.paused ? play() : pause(); });
    $("#music-next").addEventListener("click", () => { Sound.tap(); load(idx + 1, !audio.paused || true); });
    $("#music-prev").addEventListener("click", () => { Sound.tap(); load(idx - 1, !audio.paused || true); });
    audio.addEventListener("ended", () => load(idx + 1, true));   // auto-advance to next song

    if (tracks.length) load(0, false);

    // floating music notes while playing
    const notes = $("#music-notes");
    setInterval(() => { if (!vinyl.classList.contains("playing")) return;
      const n = document.createElement("div"); n.className = "note"; n.textContent = ["♪", "♫", "♬"][(Math.random() * 3) | 0];
      n.style.left = rand(42, 66) + "%"; n.style.top = "32%"; notes.appendChild(n); setTimeout(() => n.remove(), 3000); }, 620);
  }

  /* ========================================================
     BIRTHDAY FORTUNE (tap the cookie → a sweet message)
     ======================================================== */
  function buildFortune() {
    if ($("#fortune-title")) $("#fortune-title").textContent = CFG.fortuneTitle || "Your Birthday Fortune";
    const cookie = $("#fortune-cookie"), slip = $("#fortune-slip"), again = $("#fortune-again"), hint = $("#fortune-teaser");
    const list = (CFG.fortunes || []).slice(); let last = -1;
    function pick() { if (!list.length) return ""; let i; do { i = (Math.random() * list.length) | 0; } while (list.length > 1 && i === last); last = i; return list[i]; }
    function showSlip(first) {
      slip.textContent = pick(); slip.classList.remove("hidden");
      if (hasGSAP) gsap.fromTo(slip, { opacity: 0, y: first ? 18 : 10, scale: first ? .96 : 1 }, { opacity: 1, y: 0, scale: 1, duration: first ? .7 : .5, ease: first ? "back.out(1.5)" : "power3.out" });
    }
    function crack() {
      cookie.classList.add("cracked"); if (hint) hint.textContent = "✶";
      Sound.chime();
      const b = cookie.getBoundingClientRect(); burstHearts(b.left + b.width / 2, b.top + b.height / 2);
      confettiSoft({ particleCount: 80, spread: 90 });
      showSlip(true); again.classList.remove("hidden");
    }
    cookie.addEventListener("click", () => { cookie.classList.contains("cracked") ? (Sound.sparkle(), showSlip(false)) : crack(); });
    again.addEventListener("click", () => { Sound.sparkle(); showSlip(false); });
  }
  function esc(s) { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

  /* ========================================================
     ENDING
     ======================================================== */
  function buildEnding() { /* ending text is rendered one-by-one in runEnding() */ }
  let endFw;
  function runEnding() {
    $(".ending-glow").classList.add("show"); switchEndingMusic();
    endFw = endFw || fireworks($("#end-fw"));
    const lines = (CFG.ending || []).slice();
    const finalLine = lines.pop() || "Happy 16th Birthday, Devutty.";
    const now = $("#ending-now"), finalBox = $("#ending-final"), big = $("#ending-big"), sign = $("#ending-sign");
    const SHOW = 2400; // ms each transient line is on screen

    function transient(text) {
      now.textContent = text; Sound.sparkle();
      if (!hasGSAP) { now.style.opacity = 1; return; }
      gsap.killTweensOf(now);
      gsap.fromTo(now, { opacity: 0, y: 18, scale: .96, filter: "blur(6px)" },
        { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: .9, ease: "power3.out" });
      gsap.to(now, { opacity: 0, y: -16, filter: "blur(4px)", duration: .6, delay: SHOW / 1000 - .2, ease: "power2.in" });
    }
    function finale() {
      now.textContent = "";
      finalBox.classList.add("show");
      big.textContent = finalLine;
      sign.textContent = CFG.signature || "";
      Sound.chime();
      if (hasGSAP) {
        gsap.fromTo(big, { opacity: 0, y: 24, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "back.out(1.4)" });
        gsap.fromTo(sign, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1, delay: 1, ease: "power2.out" });
      } else { big.style.opacity = 1; sign.style.opacity = 1; }
      // fireworks + confetti finale
      let k = 0; const t = setInterval(() => {
        endFw && endFw();
        confettiSoft({ origin: { x: Math.random(), y: rand(.2, .5) }, particleCount: 50 });
        if (++k > 10) clearInterval(t);
      }, 800);
    }

    let delay = 400;
    lines.forEach(line => { setTimeout(() => transient(line), delay); delay += SHOW; });
    setTimeout(finale, delay + 200);
  }
  function switchEndingMusic() {
    // Try the optional ending track. If it isn't there, keep the background song playing.
    const intro = $("#intro-audio"), end = $("#ending-audio");
    end.volume = 0;
    const p = end.play();
    if (p && p.then) p.then(() => {
      if (intro && !intro.paused) { let v = intro.volume; const f = setInterval(() => { v -= .05; intro.volume = Math.max(0, v); if (v <= 0) { intro.pause(); clearInterval(f); } }, 80); }
      let v = 0; const f2 = setInterval(() => { v = Math.min(.5, v + .03); end.volume = v; if (v >= .5) clearInterval(f2); }, 100);
    }).catch(() => {/* no ending file → background song keeps playing */});
  }

  /* ========================================================
     CONTROLS
     ======================================================== */
  function setupControls() {
    const mute = $("#mute-btn"); let muted = false;
    mute.addEventListener("click", () => { muted = !muted; Sound.setMuted(muted); $$("audio").forEach(a => a.muted = muted);
      mute.textContent = muted ? "𝄽" : "♪"; mute.style.opacity = muted ? .5 : 1; });
    const theme = $("#theme-btn");
    theme.addEventListener("click", () => { document.body.classList.toggle("dark"); Sound.tap();
      const dark = document.body.classList.contains("dark");
      Toast.show(dark ? "soft dark mode 🌙" : "back to daylight ☀️", { sound: Sound.sparkle }); });
  }

  /* ========================================================
     EASTER EGGS
     ======================================================== */
  function setupEasterEggs() {
    const seq = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"]; let pos = 0;
    addEventListener("keydown", e => { const k = e.key.toLowerCase();
      if (k === seq[pos]) { pos++; if (pos === seq.length) { pos = 0; konami(); } } else pos = (k === seq[0]) ? 1 : 0; });
    $("#konami-close").addEventListener("click", () => $("#konami").classList.add("hidden"));
    const ht = $(".hero-title");
    if (ht) ht.addEventListener("dblclick", () => { Sound.sparkle(); Toast.show("⛏ hidden block — " + pick(CFG.randomMessages), { sound: Sound.chime }); });
  }
  function konami() { $("#konami-text").textContent = CFG.konamiMessage; $("#konami").classList.remove("hidden"); Sound.success(); confettiSoft({ particleCount: 180, spread: 150 }); }
  function startRandomMessages() { setInterval(() => { if (Math.random() < .4) Toast.show(pick(CFG.randomMessages), { sound: Sound.sparkle, icon: "♡" }); }, 26000); }

  /* ========================================================
     UTIL
     ======================================================== */
  function confettiSoft(opts) {
    if (typeof confetti !== "function") return;
    confetti(Object.assign({ particleCount: 80, spread: 80, origin: { y: .6 }, scalar: .9, ticks: 180,
      colors: ["#e0608a", "#f3a8bd", "#d2a85f", "#f7e6da", "#c14a72"] }, opts || {}));
  }
  function pick(a) { return a[(Math.random() * a.length) | 0]; }

})();
