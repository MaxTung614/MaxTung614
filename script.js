const games = [
  {
    id: 'mlbb',
    name: 'Mobile Legends',
    amounts: [50, 100, 250, 500],
  },
  {
    id: 'pubg',
    name: 'PUBG Mobile',
    amounts: [60, 120, 300, 600],
  },
  {
    id: 'genshin',
    name: 'Genshin Impact',
    amounts: [330, 648, 1296, 2592],
  },
];

const gamesContainer = document.getElementById('games');
const topupSection = document.getElementById('topup');
const gameTitle = document.getElementById('game-title');
const amountSelect = document.querySelector('select[name="amount"]');
const form = document.getElementById('topup-form');
const confirmation = document.getElementById('confirmation');

document.getElementById('year').textContent = new Date().getFullYear();

function renderGames() {
  games.forEach((game) => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.textContent = game.name;
    card.onclick = () => selectGame(game);
    gamesContainer.appendChild(card);
  });
}

function selectGame(game) {
  gameTitle.textContent = `Top Up ${game.name}`;
  amountSelect.innerHTML = '';
  game.amounts.forEach((amt) => {
    const opt = document.createElement('option');
    opt.value = amt;
    opt.textContent = `${amt} Diamonds`;
    amountSelect.appendChild(opt);
  });
  topupSection.classList.remove('hidden');
  confirmation.classList.add('hidden');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const playerId = form.playerId.value.trim();
  const amount = form.amount.value;
  confirmation.textContent = `Success! ${amount} credits will be added to Player ID ${playerId}.`;
  confirmation.classList.remove('hidden');
  form.reset();
});

renderGames();