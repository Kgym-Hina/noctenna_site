const root = document.documentElement;

function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function updateHeroProgress() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const rect = hero.getBoundingClientRect();
  const total = Math.max(hero.offsetHeight - window.innerHeight * 0.35, 1);
  const progress = clamp((window.innerHeight * 0.16 - rect.top) / total);
  root.style.setProperty("--hero-progress", progress.toFixed(4));
}

let ticking = false;

function requestUpdate() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateHeroProgress();
    ticking = false;
  });
}

window.addEventListener("scroll", requestUpdate, { passive: true });
window.addEventListener("resize", requestUpdate);
updateHeroProgress();
