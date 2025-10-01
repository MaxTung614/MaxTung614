Game Top-Up Demo
================

A minimal full-stack demo for topping up in-game currency for multiple games.

Features
--------
- Express backend with mock endpoints
- Static frontend (HTML/CSS/JS) served by Express
- Simple order flow with in-memory store

Quick start
-----------
Prerequisites: Node.js 18+

```bash
npm install
npm run start
# visit http://localhost:3000
```

Endpoints
---------
- GET `/api/games`
  - Returns supported games and products
- POST `/api/create-order`
  - Body (JSON or x-www-form-urlencoded): `{ gameId, userId, productId, zoneId?, paymentMethod? }`
  - Returns created order with `status=pending`
- GET `/api/order/:id`
  - Returns order status (`pending` -> `completed` after ~3s)

Frontend
--------
- Form to select game, product, and enter user ID
- Creates an order and lets you poll status

Notes
-----
- This is a demo only. No real payments or game integrations.
- Data is stored in-memory and resets on server restart.
