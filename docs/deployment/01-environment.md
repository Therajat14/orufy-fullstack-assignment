# Environment Variables

## Client Environment Variables

**File:** `client/.env.example`

| Variable | Example Value | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` | Base URL for all API requests from the frontend |

### How Vite exposes env vars
Vite only exposes variables prefixed with `VITE_` to the client-side bundle. They're accessed at runtime via `import.meta.env.VITE_API_URL`. If the prefix is missing, Vite treats the variable as server-side-only and will not embed it in the bundle.

### Important
`VITE_API_URL` is baked into the JavaScript bundle **at build time**, not at runtime. This means:
- Local dev: Set in `client/.env` to `http://localhost:5000/api`
- Production: Set in Vercel's environment variable dashboard to the Render backend URL

Changing this value after the build requires a new deployment.

---

## Server Environment Variables

**File:** `server/.env.example`

| Variable | Example Value | Description |
|---|---|---|
| `PORT` | `5000` | Port the Express server listens on |
| `MONGO_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` | MongoDB Atlas connection string |
| `JWT_SECRET` | `your_jwt_secret_here` | Secret key for signing/verifying JWTs (keep long and random) |
| `CLOUDINARY_CLOUD_NAME` | `your_cloud_name` | Cloudinary account cloud name |
| `CLOUDINARY_API_KEY` | `123456789012345` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | `your_api_secret` | Cloudinary API secret |
| `CLIENT_URL` | `http://localhost:5173` | Frontend origin for CORS whitelist |

### Variable descriptions

**`PORT`**
Express server port. Render assigns a port automatically via this env var in production. Defaults to `5000` in development.

**`MONGO_URI`**
Full MongoDB Atlas connection string. Format:
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```
The database name in the URI determines which Atlas database Mongoose writes to.

**`JWT_SECRET`**
The symmetric key used to sign JWTs. Anyone with this secret can forge tokens. Use a long random string (32+ chars). Never commit this to git.

**`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`**
Credentials from the Cloudinary dashboard. Used in `server/config/cloudinary.js` to initialize the Cloudinary v2 SDK. Images are uploaded to the `products/` folder in the configured Cloudinary account.

**`CLIENT_URL`**
Passed to `cors({ origin: CLIENT_URL })`. Only the configured origin is allowed to make cross-origin requests to the API. In production: the Vercel deployment URL. In development: `http://localhost:5173` (Vite's default dev server port).

---

## Environment Files

```
client/
├── .env            (local development, gitignored)
├── .env.example    (template, committed to git)

server/
├── .env            (local development, gitignored)
└── .env.example    (template, committed to git)
```

`.env` files are in `.gitignore` and should never be committed. `.env.example` files are templates showing required keys without real values.

---

## Production Environment Configuration

**Vercel (frontend):**
Set in Vercel Project Settings → Environment Variables:
```
VITE_API_URL = https://orufy-fullstack-assignment-vggt.onrender.com/api
```

**Render (backend):**
Set in Render Service Settings → Environment Variables:
```
PORT           = (auto-set by Render)
MONGO_URI      = mongodb+srv://...
JWT_SECRET     = <strong random string>
CLOUDINARY_CLOUD_NAME = ...
CLOUDINARY_API_KEY    = ...
CLOUDINARY_API_SECRET = ...
CLIENT_URL     = https://orufy-fullstack-assignment-five.vercel.app
```
