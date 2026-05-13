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
    const eased = 1 - Math.pow(1 - progress, 3);
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
      total += parseFloat(hours[1].textContent) || 0;
    } else if (hours.length === 1) {
      total += parseFloat(hours[0].textContent) || 0;
    }
  });
  return Math.round(total);
}

// Mise à jour de tous les affichages statiques du total
function updateStaticTotals(total) {
  const navTag = document.querySelector('.nav-tag');
  if (navTag) navTag.textContent = total + 'h';
  document.querySelectorAll('.hero-stats .stat-num').forEach(el => {
    if (el.closest('.stat')?.querySelector('.stat-label')?.textContent.includes('Total')) {
      el.textContent = total + 'h';
    }
  });
}

// Génération dynamique des breakdown tags
function updateBreakdown() {
  const breakdown = document.querySelector('.total-breakdown');
  if (!breakdown) return;
  breakdown.innerHTML = '';
  document.querySelectorAll('.activites-grid .act-card').forEach(card => {
    const title = card.querySelector('.act-title')?.textContent?.trim();
    const hours = card.querySelectorAll('.act-hours');
    const valorisees = hours.length >= 2 ? parseFloat(hours[1].textContent) || 0 : 0;
    if (valorisees > 0) {
      const tag = document.createElement('span');
      tag.className = 'breakdown-tag';
      tag.textContent = `${title} · ${valorisees}h`;
      breakdown.appendChild(tag);
    }
  });
}

// Initialisation au chargement
const totalHours = getTotalHours();
updateStaticTotals(totalHours);
updateBreakdown();

// Calcul dynamique du nombre d'activités et de thèmes
const nbActivites = document.querySelectorAll('.activites-grid .act-card').length;
const nbThemes = document.querySelectorAll('.theme-pill').length;
document.querySelectorAll('.hero-stats .stat-num').forEach(el => {
  const label = el.closest('.stat')?.querySelector('.stat-label')?.textContent;
  if (label?.includes('Domaines')) el.textContent = nbActivites;
  if (label?.includes('Thèmes')) el.textContent = nbThemes;
});

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
