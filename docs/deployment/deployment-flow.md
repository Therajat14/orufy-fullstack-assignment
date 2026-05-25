# Deployment Flow

## Architecture

```
Developer pushes to GitHub
        │
        ├──────────────────────────────┐
        ▼                             ▼
  Vercel (frontend)            Render (backend)
  builds client/               runs server/
  serves static files          runs Node.js process
```

Both Vercel and Render are connected to the GitHub repository and can auto-deploy on push.

---

## Frontend Deployment (Vercel)

### What Vercel does
1. Detects that `client/` contains a Vite project
2. Runs `npm install` in the `client/` directory
3. Runs `npm run build` → Vite outputs `client/dist/` with:
   - `index.html` — the SPA shell
   - `assets/index-[hash].js` — entire React app bundle
   - `assets/index-[hash].css` — Tailwind CSS bundle
4. Serves the `dist/` folder as a static site

### SPA Routing Configuration

Since this is a Single-Page Application, the browser only downloads `index.html` once. React Router handles all subsequent navigation in JavaScript. However, if a user navigates directly to `/products` or refreshes the page, Vercel must serve `index.html` (not a 404).

This is handled by `client/vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

All requests that don't match a static file are rewritten to `index.html`, letting React Router take over.

### Build command
```bash
# Vercel runs:
cd client && npm install && npm run build

# vite.config.js → @vitejs/plugin-react + @tailwindcss/vite
# Output: client/dist/
```

---

## Backend Deployment (Render)

### What Render does
1. Pulls the `server/` directory
2. Runs `npm install` in `server/`
3. Runs `npm start` → `node index.js`
4. Exposes the service on a public HTTPS URL
5. Sets `PORT` automatically (the app reads from `process.env.PORT`)

### Start command (`server/package.json`)
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

### Free tier behavior
Render's free tier **spins down** the service after 15 minutes of inactivity. The next request causes a cold start (up to 30-60 seconds of delay). This is why `main.jsx` fires a fetch to `/api/health` immediately on page load — to start the warm-up before the user tries to log in.

---

## Deployment Sequence (First Time)

```
1. Create MongoDB Atlas cluster
   - Create database user with read/write access
   - Whitelist IP: 0.0.0.0/0 (allow all) for Render (dynamic IPs)
   - Copy connection string → MONGO_URI

2. Set up Cloudinary account
   - Get Cloud Name, API Key, API Secret from dashboard

3. Deploy backend to Render
   - Connect GitHub repo
   - Set Root Directory: server
   - Set Start Command: npm start
   - Add all server env vars

4. Get Render backend URL
   - e.g., https://orufy-fullstack-assignment-vggt.onrender.com

5. Deploy frontend to Vercel
   - Connect GitHub repo
   - Set Root Directory: client
   - Set VITE_API_URL = https://<render-url>/api
   - Deploy

6. Update server CLIENT_URL
   - In Render env vars: CLIENT_URL = https://<vercel-url>
   - Trigger redeploy on Render
```

---

## Environment-Specific Behavior

| Feature | Development | Production |
|---|---|---|
| API URL | `http://localhost:5000/api` | `https://...onrender.com/api` |
| CORS allowed origin | `http://localhost:5173` | Vercel deployment URL |
| OTP delivery | OTP in API response (demo) | OTP in API response (same — no email/SMS) |
| Backend uptime | Always on (local process) | Spins down on Render free tier |
| Hot reload | Yes (nodemon / Vite HMR) | No |
