async function fetchGames() {
  const res = await fetch('/api/games');
  if (!res.ok) throw new Error('Failed to load games');
  const data = await res.json();
  return data.games || [];
}

function renderOptions(select, items, getValue, getLabel) {
  select.innerHTML = '';
  for (const item of items) {
    const opt = document.createElement('option');
    opt.value = getValue(item);
    opt.textContent = getLabel(item);
    select.appendChild(opt);
  }
}

function currencyFormatter(amount) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(amount);
}

async function init() {
  const gameSelect = document.getElementById('game');
  const productSelect = document.getElementById('product');
  const form = document.getElementById('topup-form');
  const orderSection = document.getElementById('order-section');
  const orderDetails = document.getElementById('order-details');
  const checkStatusBtn = document.getElementById('check-status');

  let games = [];
  let currentOrderId = null;

  try {
    games = await fetchGames();
  } catch (e) {
    alert('Unable to load games. Please try again later.');
    return;
  }

  renderOptions(gameSelect, games, g => g.id, g => g.name);

  function updateProducts() {
    const selected = games.find(g => g.id === gameSelect.value);
    if (!selected) { productSelect.innerHTML = ''; return; }
    renderOptions(
      productSelect,
      selected.currencies,
      c => c.id,
      c => `${c.label} — ${currencyFormatter(c.price)}`
    );
  }
  updateProducts();
  gameSelect.addEventListener('change', updateProducts);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('userId').value.trim();
    const zoneId = document.getElementById('zoneId').value.trim();
    const paymentMethod = document.getElementById('payment').value;
    const gameId = gameSelect.value;
    const productId = productSelect.value;

    if (!userId || !gameId || !productId) {
      alert('Please fill in required fields.');
      return;
    }

    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, userId, zoneId, productId, paymentMethod })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order failed');
      const order = data.order;
      currentOrderId = order.id;
      orderDetails.textContent = `Order #${order.id} — ${order.status} — Amount ${currencyFormatter(order.amount)}`;
      orderSection.classList.remove('hidden');
    } catch (err) {
      alert(err.message);
    }
  });

  checkStatusBtn.addEventListener('click', async () => {
    if (!currentOrderId) return;
    try {
      const res = await fetch(`/api/order/${currentOrderId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch order');
      const order = data.order;
      orderDetails.textContent = `Order #${order.id} — ${order.status} — Amount ${currencyFormatter(order.amount)}`;
    } catch (err) {
      alert(err.message);
    }
  });
}

init();

