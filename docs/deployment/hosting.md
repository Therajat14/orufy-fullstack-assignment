# Hosting

## Frontend — Vercel

**URL:** https://orufy-fullstack-assignment-five.vercel.app

### Why Vercel?
- Native support for Vite/React SPAs
- `vercel.json` rewrites make client-side routing work without configuration complexity
- Zero-config HTTPS
- Globally distributed CDN — static assets served fast worldwide
- GitHub integration for automatic deploys on push

### How it serves the app
Vercel serves `client/dist/` as a static CDN. The React bundle (`index.js`) and CSS (`index.css`) are cached with content-addressed filenames (hashed). Only `index.html` is not cached aggressively, so new deploys are picked up immediately.

### Key config
**`client/vercel.json`**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
Without this, direct navigation to `/products` would return a 404 from Vercel's static server. With it, all paths serve `index.html` and React Router handles the routing.

---

## Backend — Render

**URL:** https://orufy-fullstack-assignment-vggt.onrender.com

### Why Render?
- Free tier supports Node.js web services
- Environment variable management in dashboard
- Automatic HTTPS
- Simple GitHub integration

### Service type
**Web Service** running Node.js. Render:
- Installs dependencies (`npm install`)
- Runs `npm start` (`node index.js`)
- Exposes port defined by `process.env.PORT`
- Provides a public HTTPS URL with automatic SSL

### Free tier limitations
| Limitation | Impact |
|---|---|
| Spins down after 15min inactivity | Cold starts on first request (~30-60s) |
| 512MB RAM | Fine for this app's load |
| Shared CPU | Response times vary under concurrent load |
| No persistent disk | Images must go to Cloudinary (not local filesystem) |

The cold start limitation is mitigated by the health-check fetch in `main.jsx`.

---

## Image Storage — Cloudinary

**Not a host for the app itself**, but a critical infrastructure dependency.

### Why Cloudinary?
- Render's free tier has no persistent filesystem — files written to disk disappear on redeploy
- Cloudinary provides a CDN-backed image storage service
- Supports auto-optimization (`quality: auto`, `fetch_format: auto`) at upload time
- Images served from Cloudinary's CDN globally

### Storage organization
All product images are uploaded to the `products/` folder in the configured Cloudinary account. URLs follow the pattern:
```
https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/products/<filename>
```

### Limitation
Images are never deleted from Cloudinary (no delete API call when a product is removed). This means orphaned images accumulate. In production, you'd call `cloudinary.uploader.destroy(publicId)` when deleting a product.

---

## Database — MongoDB Atlas

**URL:** Internal (connection string in `MONGO_URI`)

### Why Atlas?
- Managed MongoDB — no server to provision
- Free tier (M0) includes 512MB storage
- Global clusters available
- Automatic backups and monitoring dashboard
- Accessible from Render via IP whitelist (or allow-all `0.0.0.0/0`)

### Atlas configuration for Render
Since Render assigns dynamic IPs to its containers, the Atlas network access must either:
- Whitelist `0.0.0.0/0` (all IPs) — simplest, used in this project
- Or use Render's static outbound IPs (paid Render plan feature)
