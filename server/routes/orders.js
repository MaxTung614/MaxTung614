import { Router } from 'express';
import { nanoid } from 'nanoid';

const router = Router();

const inMemoryOrders = new Map();

router.post('/create-order', (req, res) => {
  const { gameId, userId, zoneId, productId, paymentMethod } = req.body || {};
  if (!gameId || !userId || !productId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const orderId = nanoid(10);
  const order = {
    id: orderId,
    gameId,
    userId,
    zoneId: zoneId || null,
    productId,
    paymentMethod: paymentMethod || 'balance',
    status: 'pending',
    amount: Math.round(Math.random() * 1000) / 100,
    createdAt: new Date().toISOString(),
  };
  inMemoryOrders.set(orderId, order);
  setTimeout(() => {
    const existing = inMemoryOrders.get(orderId);
    if (existing) {
      existing.status = 'completed';
      inMemoryOrders.set(orderId, existing);
    }
  }, 3000);
  res.status(201).json({ order });
});

router.get('/order/:id', (req, res) => {
  const order = inMemoryOrders.get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ order });
});

export default router;
