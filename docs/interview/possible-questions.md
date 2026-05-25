# Possible Interview Questions

## About the Project Overall

**Q: Walk me through your project.**
A: Start with the elevator pitch, then explain the tech stack, then describe one full flow (e.g., creating a product). See `project-explanation.md`.

**Q: Why did you choose the MERN stack?**
A: MongoDB's document model fits product data (variable arrays like `images`). Express is minimal and flexible. React's component model works well for a dashboard with modals and forms. Node.js on the backend keeps the language consistent across the stack.

**Q: What's the most interesting technical challenge you solved?**
A: File uploads with cloud storage — coordinating Multer middleware, Cloudinary upload, and Zod validation in the right order required understanding how multipart form data flows through Express middleware.

---

## Authentication

**Q: How does OTP authentication work in your app?**
A: User sends their identifier (email/phone). Server generates a 6-digit OTP, stores it in MongoDB with a 5-minute TTL index (MongoDB auto-deletes it after expiry). User submits the OTP. Server checks: does it exist? Is it correct? Is it still valid? If all pass, it deletes the OTP (preventing reuse), finds or creates the user, and issues a 7-day JWT. From then on, the JWT is sent in every request's Authorization header.

**Q: Why OTP instead of password-based auth?**
A: No password to store, no password to breach. OTPs are simpler from a UX perspective — one less thing for users to remember. The tradeoff is that OTP delivery (email/SMS) adds latency and cost, but in this demo the OTP is returned directly in the API response for testing convenience.

**Q: How do you protect against OTP brute force?**
A: The OTP expires in 5 minutes. Any attempt to submit a new sendOtp overwrites the previous OTP — an attacker can't accumulate OTPs to test. In production you'd also add rate limiting on the sendOtp and verifyOtp endpoints.

**Q: How does JWT work here?**
A: After OTP verification, `jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })` creates a signed token. The client stores it in localStorage and sends it as `Authorization: Bearer <token>` on every request. The `authenticate` middleware calls `jwt.verify(token, JWT_SECRET)` — if the secret doesn't match or the token is expired, it throws and the request is rejected.

**Q: Why localStorage for JWT storage? What are the risks?**
A: LocalStorage is vulnerable to XSS attacks — if any injected script runs in the browser, it can steal the token. HttpOnly cookies are more secure (JavaScript can't read them). The tradeoff here is that localStorage is simpler to implement — for a production app handling sensitive data, cookies with `HttpOnly` and `SameSite=Strict` would be preferred.

---

## Backend & Express

**Q: Explain your middleware chain.**
A: For product write routes: `authenticate` runs first (verifies JWT, attaches `req.user`), then `upload.array('images', 10)` (Multer parses multipart body, streams files to Cloudinary, populates `req.files` and `req.body`), then `validate(schema)` (Zod validates and coerces `req.body`), then the route handler. Order matters because Multer must populate `req.body` before Zod can validate it.

**Q: Why does Multer come before Zod validation?**
A: `express.json()` can't parse `multipart/form-data`. Multer parses it and populates `req.body` with the text fields. If Zod ran before Multer, `req.body` would be empty and all validation would fail.

**Q: How does Express 5 improve error handling?**
A: In Express 4, if an async route handler throws, you had to wrap everything in try/catch and call `next(err)` manually or use a wrapper library. Express 5 automatically catches rejected promises from async handlers and forwards them to the global error handler. This lets me write clean async/await without defensive boilerplate.

**Q: How do you prevent users from modifying other users' products?**
A: Every mutating route (PUT, PATCH, DELETE) does a two-step check: first `Product.findById(id)` to get the product, then `product.createdBy.equals(req.user._id)` to verify ownership. If they don't match, it returns 403 Forbidden.

**Q: Why `.equals()` instead of `===` for ObjectId comparison?**
A: MongoDB ObjectIds are objects (`new ObjectId(...)`), not primitive strings. `===` compares references, so two ObjectId objects with the same value would be `false`. Mongoose provides `.equals()` which compares the underlying value correctly.

---

## Frontend & React

**Q: Why did you use React Context instead of Redux?**
A: The global state in this app is only the auth user object (name, identifier, _id). Redux adds boilerplate (actions, reducers, selectors) that isn't justified for one small piece of state. Context + a custom `useAuth` hook provides the same access pattern with far less code.

**Q: How does search work in your app?**
A: The search input updates the URL's `?q=` query parameter via React Router's `setSearchParams`. The page reads `searchParams.get('q')` and filters the product array during render. This keeps search state in the URL, making it bookmarkable and browser-back-compatible.

**Q: How do you handle file uploads on the frontend?**
A: The user picks or drops image files into a dropzone in `ProductForm`. The `useForm` hook stores `File` objects in the `images` field. On submit, a `FormData` is built by appending each `File` under the key `'images'`. Axios sends this as `multipart/form-data` automatically.

**Q: What happens when the JWT expires?**
A: The Axios response interceptor catches `401` responses globally. It clears `localStorage` (removes token and user) and redirects to `/login`. The user doesn't see any confusing error — they just get sent back to the login page.

**Q: How does the image carousel in ProductCard work?**
A: `currentImageIndex` is a `useState` number inside `ProductCard`. Left/right chevron buttons call `setCurrentImageIndex(prev => prev - 1)` and `+1`. The `<img>` renders `images[currentImageIndex]`. Navigation dots at the bottom show which image is active.

---

## Database

**Q: Explain your database schemas.**
A: Three collections: `users` (identifier + name), `products` (all product fields + `createdBy` ObjectId referencing the owning user), and `otps` (identifier, otp string, expiresAt date with a TTL index).

**Q: How does the OTP TTL index work?**
A: `otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })` tells MongoDB to delete documents when `expiresAt` has passed. MongoDB's background process checks this every ~60 seconds. It's automatic — no cron job or cleanup code needed.

**Q: Why use `$push: { $each: [...] }` for image updates instead of replacing the array?**
A: The edit flow only uploads new images — it doesn't re-upload existing Cloudinary images. Using `$push` appends new URLs to the array without disturbing the existing ones. Replacing the entire array would require the frontend to re-send all existing URLs plus new files, which is wasteful.

---

## Deployment

**Q: How did you deploy the frontend and backend separately?**
A: Frontend to Vercel with `client/` as the root directory. Vercel builds with Vite and serves the `dist/` output. `vercel.json` rewrites all routes to `index.html` for SPA routing. Backend to Render with `server/` as the root. Render runs `node index.js`. Environment variables are set separately in each platform's dashboard.

**Q: Why do you have a health check endpoint?**
A: Render's free tier spins down after 15 minutes of inactivity. The first request after spin-down has a cold start (30-60 seconds). `main.jsx` fires a fetch to `/api/health` immediately on page load — before the user even starts logging in — so the backend is warm by the time they submit the form.

**Q: Why can't you store uploaded images on the server filesystem?**
A: Render's free tier containers don't have persistent storage. Any file written to disk disappears on the next deploy or restart. Cloudinary is the right solution — it's an external service that persists images and serves them via CDN.
