const root = document.documentElement;
const flow = document.querySelector(".flow-section");
const scenarioCards = [...document.querySelectorAll("[data-scenario-card]")];
const cards = [...document.querySelectorAll(".tool-card")];

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

function setScrollState() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const pageProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  root.style.setProperty("--page-progress", clamp(pageProgress).toFixed(4));

  if (flow) {
    const rect = flow.getBoundingClientRect();
    const range = rect.height - window.innerHeight * 0.45;
    const progress = range > 0 ? (window.innerHeight * 0.35 - rect.top) / range : 0;
    updateScenarioState(clamp(progress));
  }

  cards.forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    const progress = (window.innerHeight - rect.top + index * 14) / (window.innerHeight * 0.74);
    card.style.setProperty("--card-progress", clamp(progress).toFixed(4));
  });
}

function updateScenarioState(fallbackProgress = 0) {
  if (!scenarioCards.length) return;

  let activeIndex = Math.round(fallbackProgress * (scenarioCards.length - 1));
  const snapTarget = 118;
  let nearestDistance = Number.POSITIVE_INFINITY;

  scenarioCards.forEach((card, index) => {
    const distance = Math.abs(card.getBoundingClientRect().top - snapTarget);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      activeIndex = index;
    }
  });

  const progress = scenarioCards.length > 1 ? activeIndex / (scenarioCards.length - 1) : 0;
  root.style.setProperty("--flow-progress", progress.toFixed(4));
  root.style.setProperty("--lookup-active", activeIndex === 0 ? "1" : "0.42");
  root.style.setProperty("--band-active", activeIndex === 1 ? "1" : "0.42");
  root.style.setProperty("--cw-active", activeIndex === 2 ? "1" : "0.42");
  root.style.setProperty("--log-active", activeIndex === 3 ? "1" : "0.42");

  scenarioCards.forEach((card, index) => {
    card.classList.toggle("is-active", index === activeIndex);
  });
}

let ticking = false;

function requestScrollUpdate() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    setScrollState();
    ticking = false;
  });
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);
setScrollState();
updateScenarioState();
