GameTopUp - Static Demo Site
================================

A minimal static website that lets users select a game, enter player details, choose a denomination, and run through a mock checkout flow. Built with vanilla HTML/CSS/JS for easy hosting anywhere.

Features
--------
- Responsive landing page with hero and trust badges
- Top Up form with client-side validation
- Games catalog grid with quick Top Up links
- Modal-based mock checkout with order summary
- Modern dark UI, no frameworks required

Getting Started
---------------

1) Serve locally

Use any static server. Examples:

```bash
python3 -m http.server 5173 --directory .
# or
npx serve -l 5173 .
```

Then open `http://localhost:5173/`.

2) Edit content

- Update games in `script.js` (array at the top)
- Adjust styles in `styles.css`
- Modify pages `index.html` and `products.html`

3) Deploy

Upload the folder to any static host (e.g., Netlify, Vercel, Cloudflare Pages, GitHub Pages). No build step required.

Notes
-----
- This is a demo: no real payments are processed.
- Replace the Unsplash image URLs with your own assets for production.

