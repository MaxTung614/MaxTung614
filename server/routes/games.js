import { Router } from 'express';

const router = Router();

const games = [
  { id: 'mlbb', name: 'Mobile Legends: Bang Bang', currencies: [{id:'diamonds_50', label:'50 Diamonds', price: 1.2}, {id:'diamonds_100', label:'100 Diamonds', price: 2.3}] },
  { id: 'ff', name: 'Free Fire', currencies: [{id:'diamonds_50', label:'50 Diamonds', price: 1.1}, {id:'diamonds_100', label:'100 Diamonds', price: 2.1}] },
  { id: 'genshin', name: 'Genshin Impact', currencies: [{id:'crystals_60', label:'60 Crystals', price: 0.99}, {id:'crystals_300', label:'300 Crystals', price: 4.5}] }
];

router.get('/', (req, res) => {
  res.json({ games });
});

export default router;
