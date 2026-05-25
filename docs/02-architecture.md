# Architecture Overview

## System Design

Productr is a classic **client-server** architecture where the frontend is a Single-Page Application (SPA) that communicates with a REST API backend. Both are deployed separately — the frontend on Vercel and the backend on Render.

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                              │
│                                                             │
│   React SPA (Vite)                                          │
│   ┌────────────────────────────────────────────────────┐   │
│   │  React Router 7  →  Pages  →  Components           │   │
│   │  AuthContext (localStorage)                         │   │
│   │  Axios (Bearer token auto-attached)                 │   │
│   └──────────────────┬─────────────────────────────────┘   │
│                      │ HTTPS REST calls                     │
└──────────────────────┼──────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│                    RENDER (Node.js)                          │
│                                                             │
│   Express 5 App                                             │
│   ┌────────────────────────────────────────────────────┐   │
│   │  CORS → express.json() → routes                    │   │
│   │  /api/auth   /api/products   /api/health            │   │
│   │  middleware: auth | upload | validate               │   │
│   │  controllers → Mongoose queries                     │   │
│   └──────────────────┬──────────────────────────────────┘  │
│                       │                                     │
│          ┌────────────┴────────────┐                        │
│          ▼                        ▼                         │
│   ┌─────────────┐       ┌──────────────────┐               │
│   │  MongoDB    │       │   Cloudinary     │               │
│   │  Atlas      │       │   (image CDN)    │               │
│   │  User       │       │   /products/     │               │
│   │  Product    │       │   folder         │               │
│   │  OTP        │       └──────────────────┘               │
│   └─────────────┘                                           │
└──────────────────────────────────────────────────────────────┘
```

---

## Separation of Concerns

| Layer | Location | Responsibility |
|---|---|---|
| Presentation | `client/src/pages/` | Page-level layout and composition |
| UI Components | `client/src/components/` | Reusable visual building blocks |
| State | `client/src/context/` + `hooks/` | Auth state and product list state |
| API Client | `client/src/services/api.js` | Axios instance with auth interceptor |
| API Functions | `client/src/api/` | Typed wrappers for each endpoint |
| HTTP Server | `server/index.js` | Express app bootstrap and route mounting |
| Routing | `server/routes/` | URL-to-handler mapping |
| Business Logic | Inline in routes | OTP logic, ownership checks, queries |
| Data Models | `server/models/` | Mongoose schema definitions |
| Validation | `server/schemas/` + `middleware/validate.js` | Zod-based request validation |
| File Handling | `server/middleware/upload.js` | Multer + Cloudinary storage |
| Auth Guard | `server/middleware/auth.js` | JWT verification |

---

## Data Flow Summary

```
User Action
    │
    ▼
React Component (event handler)
    │ calls
    ▼
API function (client/src/api/*.js)
    │ axios request (with Bearer token)
    ▼
Express Route (server/routes/*.js)
    │
    ├── auth middleware (verify JWT → attach req.user)
    ├── upload middleware (Multer → Cloudinary upload → req.files)
    ├── validate middleware (Zod → parsed req.body)
    │
    ▼
Route handler (inline business logic)
    │ Mongoose query
    ▼
MongoDB Atlas
    │ document
    ▼
Route handler sends JSON response
    │
    ▼
Axios response interceptor
    │
    ▼
React component updates state → UI re-renders
```

---

## Key Architectural Decisions

| Decision | What was chosen | Why |
|---|---|---|
| Auth strategy | OTP + JWT (no passwords) | Simpler UX, no bcrypt storage risk |
| Image storage | Cloudinary (not local disk) | Works on serverless/ephemeral hosts |
| Validation library | Zod (server only) | Type-safe, composable schemas |
| State management | React Context + hooks | No Redux needed for this scale |
| Styling | Tailwind v4 + inline styles | Rapid development, no CSS file overhead |
| Frontend hosting | Vercel | Native SPA support (rewrites to index.html) |
| Backend hosting | Render | Free tier supports Node.js with env vars |
