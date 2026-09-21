const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---- mobile nav toggle ----
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("open");
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.classList.remove("open");
    navLinks.classList.remove("open");
  });
});

// ---- stat bars fill in once the lore section scrolls into view ----
const statFills = document.querySelectorAll(".stat-fill");

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

statFills.forEach((fill) => statObserver.observe(fill));

// ---- cursor glow trail ----
const cursorGlow = document.getElementById("cursorGlow");

if (cursorGlow && !reduceMotion) {
  window.addEventListener("mousemove", (e) => {
    cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });
}

// ---- hero mouse parallax on the character art ----
const hero = document.querySelector(".hero");
const heroCharWrap = document.getElementById("heroCharWrap");

if (hero && !reduceMotion) {
  hero.addEventListener("mousemove", (e) => {
    if (!heroCharWrap) return;
    const { left, top, width, height } = hero.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    heroCharWrap.style.transform = `translate(${x * -20}px, ${y * -14}px)`;
  });
}

// ---- 3D tilt on hover for weapon + tier cards ----
function initTilt(selector) {
  document.querySelectorAll(selector).forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${y * -10}deg) rotateY(${x * 10}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

if (!reduceMotion) {
  initTilt(".weapon-card");
  initTilt(".tier-card");
}

// ---- ember particles rising through the hero ----
function initEmbers() {
  const canvas = document.getElementById("emberCanvas");
  if (!canvas || !hero) return;

  const ctx = canvas.getContext("2d");
  let particles = [];

  function resize() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function spawn() {
    particles.push({
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      r: Math.random() * 2 + 1,
      speed: Math.random() * 1.2 + 0.4,
      drift: (Math.random() - 0.5) * 0.6,
      color: Math.random() > 0.5 ? "255,46,156" : "53,230,255",
      life: 1,
    });
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (particles.length < 60 && Math.random() > 0.5) spawn();

    particles.forEach((p) => {
      p.y -= p.speed;
      p.x += p.drift;
      p.life -= 0.004;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${Math.max(p.life, 0)})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${p.color}, 0.8)`;
      ctx.fill();
    });

    particles = particles.filter((p) => p.life > 0 && p.y > -10);
    requestAnimationFrame(tick);
  }

  tick();
}

if (!reduceMotion) initEmbers();
