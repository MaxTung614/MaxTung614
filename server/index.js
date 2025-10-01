import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import gamesRouter from './routes/games.js';
import ordersRouter from './routes/orders.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// Parse API bodies only under /api
app.use('/api', express.json());
app.use('/api', express.urlencoded({ extended: true }));

app.use('/api/games', gamesRouter);
app.use('/api', ordersRouter);

app.use(express.static(path.join(__dirname, '../src/public')));

// Serve index.html for all non-API GET requests (SPA fallback)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../src/public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
