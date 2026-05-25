# Backend Overview

## Entry Point: `server/index.js`

This is the only file that boots the application. It:

1. Loads `.env` via `dotenv.config()`
2. Creates an Express 5 app
3. Applies global middleware: `cors`, `express.json()`, `express.urlencoded()`
4. Mounts route modules at `/api/auth` and `/api/products`
5. Registers a health check route at `GET /api/health`
6. Registers a global error handler (catches any unhandled error, responds 500)
7. Connects to MongoDB via `mongoose.connect(MONGO_URI)`
8. Starts the HTTP server on `process.env.PORT || 5000`

---

## Express 5

The project uses Express 5 (`express: ^5.2.1`). The most significant change from Express 4 for this project: **async route handlers throw errors automatically** — if an async function throws, Express 5 catches it and forwards to the error handler without needing `next(err)` or try/catch in every handler.

---

## Middleware Execution Order

Every incoming request passes through these layers in order:

```
Incoming HTTP Request
        │
        ▼
1. CORS middleware
   - Allows requests from CLIENT_URL only
   - Sets Access-Control-Allow-Origin, methods, headers
        │
        ▼
2. express.json()
   - Parses application/json body → req.body
        │
        ▼
3. express.urlencoded({ extended: true })
   - Parses URL-encoded form bodies → req.body
        │
        ▼
4. Route matching
   ├── /api/auth     → auth router
   ├── /api/products → products router
   └── /api/health   → inline handler
        │
        ▼
5. Route-specific middleware (applied per-route):
   ├── authenticate  (JWT verification)
   ├── upload.array('images', 10)  (Multer + Cloudinary)
   └── validate(schema)  (Zod validation)
        │
        ▼
6. Route handler (business logic + DB query)
        │
        ▼
7. Global error handler (if any middleware/handler throws)
```

---

## Folder Structure

```
server/
├── config/
│   └── cloudinary.js      Cloudinary v2 client initialization
├── middleware/
│   ├── auth.js            JWT verification → attaches req.user
│   ├── upload.js          Multer + CloudinaryStorage config
│   └── validate.js        Zod schema validation middleware factory
├── models/
│   ├── User.js            Mongoose User schema
│   ├── Product.js         Mongoose Product schema
│   └── OTP.js             Mongoose OTP schema (with TTL index)
├── routes/
│   ├── auth.js            /api/auth/* handlers
│   └── products.js        /api/products/* handlers
├── schemas/
│   ├── auth.js            Zod schemas for auth endpoints
│   └── product.js         Zod schemas for product endpoints
└── index.js               App bootstrap
```

---

## CORS Configuration

```javascript
cors({
  origin: process.env.CLIENT_URL
})
```

Only requests from the configured `CLIENT_URL` are allowed. In production this is the Vercel frontend URL. In development it's `http://localhost:5173`.

---

## Health Check Endpoint

```
GET /api/health
Response: 200 { status: 'ok' }
```

This exists for two reasons:
1. The frontend calls it on load to wake up the Render backend (free tier spins down after inactivity)
2. Can be used by uptime monitoring services

---

## Global Error Handler

```javascript
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
})
```

This is the last middleware registered. If any route handler throws (or calls `next(err)`), this catches it and returns a clean 500 response rather than crashing the server or leaking stack traces.
