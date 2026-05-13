// Révélation au scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Compteur dynamique
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

// Calcul dynamique du total des heures valorisées
function getTotalHours() {
  let total = 0;
  document.querySelectorAll('.activites-grid .act-card').forEach(card => {
    const hours = card.querySelectorAll('.act-hours');
    if (hours.length >= 2) {
      // Le 2ème .act-hours est toujours les "h valorisées"
      total += parseFloat(hours[1].textContent) || 0;
    } else if (hours.length === 1) {
      total += parseFloat(hours[0].textContent) || 0;
    }
  });
  return Math.round(total);
}

// Mise à jour de tous les affichages statiques du total
function updateStaticTotals(total) {
  // Badge dans la nav
  const navTag = document.querySelector('.nav-tag');
  if (navTag) navTag.textContent = total + 'h';

  // Stat dans le hero
  document.querySelectorAll('.hero-stats .stat-num').forEach(el => {
    if (el.closest('.stat')?.querySelector('.stat-label')?.textContent.includes('Total')) {
      el.textContent = total + 'h';
    }
  });
}

// Calcul dynamique du nombre d'activités et de thèmes
const nbActivites = document.querySelectorAll('.activites-grid .act-card').length;
const nbThemes = document.querySelectorAll('.theme-pill').length;

// Mise à jour dans le hero
document.querySelectorAll('.hero-stats .stat-num').forEach(el => {
  const label = el.closest('.stat')?.querySelector('.stat-label')?.textContent;
  if (label?.includes('Domaines')) el.textContent = nbActivites;
  if (label?.includes('Thèmes')) el.textContent = nbThemes;
});

// Initialisation au chargement
const totalHours = getTotalHours();
updateStaticTotals(totalHours);

// Animation du compteur au scroll
const counterEl = document.getElementById('total-counter');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(counterEl, totalHours);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

counterObserver.observe(document.querySelector('.total-section'));
