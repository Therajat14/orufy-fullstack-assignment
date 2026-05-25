# Project Explanation

## 30-Second Elevator Pitch

"I built a full-stack product management dashboard called Productr using the MERN stack. Users can sign up and log in using OTP-based authentication — no passwords needed. Once logged in, they can create products with details like name, type, price, brand, and upload multiple images. Products can be published or unpublished, and the app has separate views for published vs. unpublished products. The frontend is a React SPA deployed on Vercel, the backend is Express on Render, and images are stored on Cloudinary."

---

## 2-Minute Technical Walk-Through

"Let me walk through the technical structure:

**Frontend** — React 19 with Vite as the build tool. I used React Router 7 for navigation with two types of route guards: ProtectedRoute (redirects unauthenticated users to login) and GuestRoute (redirects logged-in users away from auth pages). For state, I avoided Redux and used React Context for auth state, and custom hooks for product list management. Axios handles all API calls with interceptors that auto-attach the JWT to every request and handle 401 responses globally.

**Backend** — Express 5 with three route modules: auth, products, and a health check. I used three custom middleware: an auth middleware that verifies JWT and attaches the user to the request, a Multer upload middleware that streams images directly to Cloudinary, and a Zod validation middleware that validates and coerces request bodies. All product routes are protected — users can only read and modify their own products.

**Database** — MongoDB Atlas with three collections: Users (identifier + name), Products (all product fields + createdBy FK), and OTPs (temporary with a 5-minute TTL index for auto-deletion).

**Auth flow** — OTP-based: the user sends their email or phone, the server generates a 6-digit OTP with a 5-minute expiry, the user submits it back, the server validates and issues a 7-day JWT. The user object is stored in localStorage and the token is auto-attached to every API request.

**Deployment** — Frontend on Vercel (SPA routing handled via vercel.json rewrites), backend on Render (free tier, with a health-check warm-up from the frontend), and Cloudinary for image CDN."

---

## Key Points to Emphasize

### 1. Separation of Concerns
- `api/` (function per domain) vs. `services/` (Axios instance)
- `components/ui/` (generic) vs. `components/products/` (domain-specific)
- `middleware/` is fully separated from routes

### 2. Middleware Pipeline
I can draw the chain: `authenticate → upload → validate → handler` and explain why order matters (Multer must parse the body before Zod can validate it).

### 3. OTP Flow
Clear explanation of: generate → upsert in MongoDB with 5-min TTL → user submits → validate OTP value + expiry → delete OTP → find/create user → issue JWT.

### 4. FormData + Cloudinary
Explain why `application/json` can't carry files, how `FormData` with `multipart/form-data` works, how Multer intercepts it and streams to Cloudinary before the handler runs.

### 5. Zod Coercion
FormData text fields arrive as strings. Zod `z.coerce.number()` converts `"50"` to `50`. After validation, `req.body` has correct types — the route handler doesn't need to do any type conversion.

### 6. Ownership Checks
Every mutating endpoint: `Product.findById` → check `product.createdBy.equals(req.user._id)` → proceed or 403. Explains why I use `.equals()` (ObjectId comparison, not `===`).

---

## What Makes This Project Stand Out

1. **Real-world auth pattern** — OTP auth is used in production apps (WhatsApp, Slack)
2. **File uploads to cloud storage** — not just storing files locally but using Cloudinary's auto-optimization
3. **Express 5 async error handling** — no try/catch needed in handlers
4. **Composable Zod schemas** — `updateProductSchema` is `createProductSchema.partial()` — DRY
5. **Backend warm-up pattern** — health check fired before user interaction to hide cold start latency
