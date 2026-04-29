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

function getTotalHours() {
  let total = 0;
  document.querySelectorAll('.act-hours').forEach(el => {
    total += parseInt(el.textContent) || 0;
  });
  return total;
}

const counterEl = document.getElementById('total-counter');
const totalHours = getTotalHours();

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(counterEl, totalHours);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

counterObserver.observe(document.querySelector('.total-section'));