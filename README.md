# BranPlate — Full MERN E-Commerce Site

Biodegradable wheat-bran plates storefront + admin dashboard. Animation style modeled on buckssauce.com (animated hero, slide-in cart drawer, scroll-reveal features, reviews marquee).

## Structure
```
branplate/
├── client/   React (Vite) + Tailwind + Framer Motion storefront & admin UI
└── server/   Node + Express + MongoDB (Mongoose) REST API
```

## Quick Start (local)

### 1. Server
```bash
cd server
npm install
cp .env.example .env      # fill in MONGO_URI, JWT_SECRET, FIRST_ADMIN_EMAIL
npm run seed               # creates sample products + whitelists FIRST_ADMIN_EMAIL as admin
npm run dev                 # http://localhost:5000
```

### 2. Client
```bash
cd client
npm install
cp .env.example .env       # VITE_API_URL=http://localhost:5000/api
npm run dev                 # http://localhost:5173
```

### 3. First admin login
Go to `http://localhost:5173/admin/signup`, enter the Gmail you set as `FIRST_ADMIN_EMAIL`, choose a password. Then log in at `/admin/login`. From **Settings → Admin Access** you can whitelist more Gmail addresses.

## Deploy

### MongoDB — Atlas
1. Create a free cluster at https://cloud.mongodb.com
2. Create a database user + allow network access (0.0.0.0/0 for simplicity, or Render/Vercel's IPs).
3. Copy the connection string into `MONGO_URI`.

### Server — Render (or Railway/Fly.io)
1. Push this repo to GitHub.
2. Render → New → Web Service → connect repo → **root directory: `server`**.
3. Build command: `npm install`. Start command: `npm start`.
4. Add env vars: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your Vercel URL once deployed), `FIRST_ADMIN_EMAIL`.
5. After first deploy, run the seed script once via Render's shell: `npm run seed`.

### Client — Vercel
1. Vercel → New Project → import the same repo → **root directory: `client`**.
2. Framework preset: Vite.
3. Add env var: `VITE_API_URL=https://your-render-service.onrender.com/api`.
4. Deploy. `vercel.json` is already included so client-side routing (React Router) works on refresh.

## Replacing placeholder images
Product cards/detail pages read from `product.images[0]`. Either:
- Upload images somewhere (Cloudinary, S3, or even a `/public` folder in `client`) and paste the URLs into the `images` array when adding/editing a product in `/admin/products`, or
- Extend `AdminProducts.jsx` with a file-upload widget wired to an image host of your choice.

## Admin capabilities (as requested)
- Gmail-whitelisted admin login (`/admin/login`, `/admin/signup`)
- Add another admin Gmail (Settings → Admin Access)
- Add / edit products, alter price (`/admin/products`)
- Orders dashboard, **Completed** vs **Incomplete** tabs, status updates: Order Placed → Packed → Out for Delivery → Cancelled (`/admin/orders`)
- Edit public contact info (Settings → Contact Info)
- View & respond to refund/general queries (`/admin/queries`)

## Customer capabilities
- Browse/shop, add to cart (slide-in drawer), checkout (COD or Razorpay placeholder), track order status, submit contact/refund queries, view order history.
