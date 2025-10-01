# GameTopUp — Static Site

A fast, responsive static website to help users top up credits across popular games.

## Quick start

Serve the site locally (browsers block `file://` fetch of JSON):

```bash
cd /workspace
python3 -m http.server 5173
```

Then open `http://localhost:5173` in your browser.

## Customize games

Edit `assets/data/games.json` to add or change games, servers, and denominations:

```json
{
  "id": "example",
  "name": "Example Game",
  "category": "Genre",
  "servers": ["NA", "EU"],
  "denominations": [
    { "id": "ex-100", "label": "100 Gems", "price": 1.99, "currency": "USD" }
  ]
}
```

Prices are displayed using the `currency` code via `Intl.NumberFormat`.

## Features

- Responsive layout with header, hero, and footer
- Games catalog with search
- Top-up form (game, UID, server, denomination, email, payment)
- Client-side validation and live price
- Order summary with copy-to-clipboard

## Deploy

Any static hosting works:

- GitHub Pages: serve `/workspace` as the site root
- Netlify/Vercel: drag-and-drop or connect repo; set publish dir to `/workspace`

## Notes

This is a static demo. Integrate a backend/payment gateway to process real payments and issue vouchers/credits automatically.

