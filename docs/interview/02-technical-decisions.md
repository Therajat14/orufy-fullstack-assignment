# Technical Decisions

## Why Each Technology Was Chosen

---

### React 19 + Vite 8

**React** — Component model is ideal for a dashboard with repeated UI patterns (product cards, modals). The hooks-based state system (Context, custom hooks) is expressive without requiring a framework like Next.js.

**Vite** over Create React App — Vite uses native ES modules in development, making HMR nearly instant. CRA's webpack-based approach is slower. Vite's production build (Rollup) is also smaller and faster.

**Why not Next.js?** — This app is fully client-rendered. All data fetching happens client-side after authentication. Server-side rendering would add complexity without benefit — products are private, so they can't be pre-rendered anyway.

---

### Tailwind CSS v4

**Tailwind** provides utility classes for rapid UI development without writing custom CSS. The tradeoff is that components can become verbose with many class names — mitigated here by also using inline style objects where precision is needed.

**v4 specifically** — uses a Vite plugin instead of a config file, which simplifies setup. No `tailwind.config.js` needed — works with Vite's plugin pipeline.

---

### React Context (not Redux or Zustand)

The only truly global state is the authenticated user. Redux would require actions, reducers, and selectors for a single `user` object — massive over-engineering. Zustand would work, but Context is built into React with no extra dependency. The `useAuth()` hook provides the same ergonomics as Zustand's store selectors.

---

### Express 5 (not Fastify or Koa)

Express has the largest ecosystem and most documentation. Express 5 specifically adds automatic async error handling — a real quality-of-life improvement. Fastify would be faster and has better TypeScript support, but for a demo project Express 5's familiar API was the right choice.

---

### OTP Authentication (not JWT + password)

**No password to store** — eliminates bcrypt complexity and the risk of a password database breach. The `bcryptjs` package is in `package.json` but unused — likely added during initial setup and not needed after the decision to go passwordless.

**Tradeoff** — requires email/SMS delivery in production (not implemented — OTP is in the response for demo). Also, a lost phone/email access means account lockout.

---

### Zod (not Joi, Yup, or express-validator)

- **Zod v4** — type-safe at the TypeScript level (though this project uses JavaScript, not TypeScript). Schema composability is excellent: `updateProductSchema = createProductSchema.partial()` is one line.
- **`z.coerce.number()`** — solves the FormData string-to-number problem elegantly without custom transform code.
- **`safeParse`** — returns a result object instead of throwing, making error handling clean without try/catch.

**vs Joi** — Joi has similar capabilities but worse TypeScript integration and a more verbose API.

---

### Multer + CloudinaryStorage

**Multer** is the standard Express middleware for handling multipart form data. It provides file filtering and size limits.

**multer-storage-cloudinary** — drops in as a Multer storage engine, transparently routing uploads to Cloudinary. The route handler never touches the binary file data — it just receives URLs in `req.files`.

**Why not handle uploads in the route handler?** — Keeping upload logic in middleware keeps the route handler clean and focused on business logic (saving to DB). It also means validation can happen after upload but before the DB write.

---

### MongoDB Atlas (not PostgreSQL)

**Flexible schema** — a product's `images` field is an array of strings that can grow. SQL's fixed schema would require a separate `product_images` table with a JOIN. MongoDB's document model stores it naturally.

**Tradeoff** — no foreign key constraints (no cascade delete), no transactions across collections (not needed here). At this scale, MongoDB's simplicity wins.

---

### JWT for Session Tokens (not cookies)

**localStorage + JWT** was chosen for simplicity — no server-side session storage needed. Token is self-contained (carries user ID, expiry).

**Tradeoff vs. HttpOnly cookies** — localStorage is accessible to JavaScript, making it vulnerable to XSS. For a demo/assignment, this is acceptable. In production, HttpOnly cookies are more secure.

---

### Vercel + Render (not AWS, DigitalOcean)

**Vercel** has first-class Vite/React support and automatic SPA routing via `vercel.json`. Zero configuration for HTTPS, CDN, and preview deployments.

**Render** offers a free tier for Node.js services with environment variable management and GitHub integration. The free tier's spin-down behavior is the main limitation, handled by the health-check warm-up pattern.

**Why not a single platform?** — Frontend (static) and backend (dynamic API) have different hosting needs. Static assets should be served from a CDN (Vercel). Dynamic APIs need a compute runtime (Render). Keeping them separate also means independent deployability.

---

## Decisions That Could Be Improved in Production

| Decision | Current | Production Alternative |
|---|---|---|
| OTP delivery | OTP in API response | Email (Resend/SendGrid) or SMS (Twilio) |
| JWT storage | localStorage | HttpOnly cookie |
| Image deletion | Not implemented | `cloudinary.uploader.destroy()` on product delete |
| Product query | No index on `createdBy` | Compound index `{ createdBy, createdAt }` |
| Validation | Server-side only | Add client-side with Zod (shared schemas) |
| Auth rate limiting | None | Rate limiting on `/api/auth/*` endpoints |
| Error monitoring | `console.error` | Sentry or similar |
| Pagination | All products in one query | Cursor or page-based pagination |
