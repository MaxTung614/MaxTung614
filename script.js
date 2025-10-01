const games = [
  { id: 'mobile-legends', name: 'Mobile Legends', cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop', tags: ['Diamonds', 'Global'] },
  { id: 'free-fire', name: 'Free Fire', cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop', tags: ['Diamonds', 'SEA'] },
  { id: 'valorant', name: 'Valorant', cover: 'https://images.unsplash.com/photo-1520975922284-7b683a3eccdb?q=80&w=1200&auto=format&fit=crop', tags: ['Points', 'NA/EU'] },
  { id: 'genshin', name: 'Genshin Impact', cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop', tags: ['Genesis Crystals', 'Global'] },
];

function populateYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}

function renderGameGrid() {
  const grid = document.getElementById('game-grid');
  if (!grid) return;
  grid.innerHTML = games.map(g => `
    <article class="game-card">
      <img class="cover" src="${g.cover}" alt="${g.name}" />
      <div class="content">
        <strong>${g.name}</strong>
        <div class="tags">${g.tags.map(t => `<span class=\"pill\">${t}</span>`).join(' ')}</div>
        <a class="btn btn-secondary" href="/?game=${encodeURIComponent(g.id)}#topup">Top Up</a>
      </div>
    </article>
  `).join('');
}

function preselectGameFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const gameId = params.get('game');
  if (!gameId) return;
  const gameSelect = document.getElementById('game');
  if (gameSelect) {
    const option = Array.from(gameSelect.options).find(o => o.value === gameId);
    if (option) {
      option.selected = true;
      document.getElementById('topup')?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

function validateField(input) {
  const errorEl = document.querySelector(`[data-error-for="${input.id}"]`);
  if (!errorEl) return true;

  let message = '';
  if (input.hasAttribute('required') && !input.value) {
    message = 'This field is required.';
  }
  if (input.id === 'userId' && input.value && !/^[\w-]{4,}$/.test(input.value)) {
    message = 'Enter a valid Player ID (min 4 characters).';
  }

  errorEl.textContent = message;
  return message === '';
}

function attachFormHandlers() {
  const form = document.getElementById('topup-form');
  if (!form) return;

  const inputs = form.querySelectorAll('input, select');
  inputs.forEach((el) => {
    el.addEventListener('blur', () => validateField(el));
    el.addEventListener('input', () => validateField(el));
    el.addEventListener('change', () => validateField(el));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    inputs.forEach((el) => { if (!validateField(el)) valid = false; });
    if (!valid) return;

    const data = Object.fromEntries(new FormData(form).entries());
    openCheckoutModal(data);
  });
}

function formatSummary(data) {
  const gameName = games.find(g => g.id === data.game)?.name || data.game;
  const denom = Number(data.denomination);
  const price = denom ? (denom / 10).toFixed(2) : '0.00';
  return `
    <div class="card" style="padding:12px;">
      <div><strong>Game:</strong> ${gameName}</div>
      <div><strong>Player ID:</strong> ${data.userId}</div>
      <div><strong>Region:</strong> ${data.server || '-'} </div>
      <div><strong>Denomination:</strong> ${denom || '-'} </div>
      <div><strong>Payment:</strong> ${data.payment}</div>
      <hr style="border-color: rgba(255,255,255,0.06);" />
      <div><strong>Total:</strong> $${price} USD</div>
    </div>
  `;
}

function openCheckoutModal(data) {
  const modal = document.getElementById('checkout-modal');
  const summary = document.getElementById('order-summary');
  if (!modal || !summary) return;
  summary.innerHTML = formatSummary(data);
  modal.showModal();

  modal.addEventListener('close', () => {
    if (modal.returnValue === 'confirm') {
      fakeProcessOrder(data);
    }
  }, { once: true });
}

function fakeProcessOrder(data) {
  const modal = document.getElementById('checkout-modal');
  modal.close();
  alert(`Order placed!\n\nGame: ${data.game}\nPlayer ID: ${data.userId}\nDenomination: ${data.denomination}`);
}

document.addEventListener('DOMContentLoaded', () => {
  populateYear();
  renderGameGrid();
  attachFormHandlers();
  preselectGameFromQuery();
});

