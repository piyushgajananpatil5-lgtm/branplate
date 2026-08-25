# BranPlate Server (Express + MongoDB)

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and fill in `MONGO_URI` (MongoDB Atlas connection string), `JWT_SECRET`, and `FIRST_ADMIN_EMAIL` (your Gmail — this becomes the first whitelisted admin).
3. `npm run seed` — populates sample products and creates the first admin whitelist entry.
4. `npm run dev` — starts the API on `http://localhost:5000`.

## Deploy (Render)
1. Push this repo to GitHub.
2. On Render: New → Web Service → connect repo → root directory `server`.
3. Build command: `npm install`. Start command: `npm start`.
4. Add the same environment variables from `.env.example` in Render's dashboard.
5. Once deployed, copy the Render URL — you'll need it as `VITE_API_URL` on the client.
