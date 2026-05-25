# Challenges and Solutions

## Challenge 1: File Uploads Through Middleware

**Problem:** Sending product images alongside text fields is not possible with `application/json`. Files are binary data. The backend also needs to validate text fields, but the file upload must happen before validation runs.

**Investigation:** `multipart/form-data` is the encoding that supports mixed text + binary. Express's built-in `express.json()` cannot parse it. A separate library (Multer) is needed.

**Solution:**
1. Frontend: Build `FormData` manually, append each field and each `File` object
2. Backend middleware order: `upload.array('images', 10)` runs first (parses multipart, uploads to Cloudinary, populates `req.body` + `req.files`), then `validate(schema)` runs on the now-populated `req.body`
3. Route handler receives clean data: `req.body` (validated) + `req.files` (Cloudinary URLs)

**Key insight:** The middleware order is not arbitrary. Zod needs `req.body` to be populated, and Multer is what populates it from a multipart request.

---

## Challenge 2: Type Coercion from FormData

**Problem:** All `FormData` fields arrive on the server as strings. `quantityStock: "50"`, `mrp: "2999"`, `exchangeEligibility: "Yes"` — even though the Product schema expects numbers and booleans. Mongoose would reject or silently coerce these incorrectly.

**Solution:** Zod's `z.coerce.number()` calls `Number()` on the string value during schema parsing — `"50"` becomes `50`. For `exchangeEligibility`, a `z.preprocess()` function maps `"Yes"` → `true` and `"No"` → `false` before Zod applies the boolean check.

After the `validate` middleware runs, `req.body` contains correctly-typed values. No manual type conversion is needed in the route handler.

---

## Challenge 3: OTP Expiry and Cleanup

**Problem:** Expired OTPs need to be cleaned up, but a scheduled cleanup job is complex to manage in a simple Express app. If old OTPs aren't deleted, the collection grows indefinitely.

**Solution:** MongoDB's TTL index. `otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })` tells MongoDB to delete documents automatically when `expiresAt` passes. The code also validates `expiresAt` during OTP verification (important because MongoDB's TTL cleanup runs every ~60 seconds, not exactly at the expiry moment).

**Result:** Zero application-level cleanup code. The database manages its own housekeeping.

---

## Challenge 4: SPA Routing on Vercel

**Problem:** React Router handles routing in the browser via JavaScript. But if a user navigates directly to `/products` or refreshes the page, Vercel's static server tries to find a file at `/products` — which doesn't exist — and returns a 404.

**Solution:** `client/vercel.json` with a rewrite rule:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
Vercel serves `index.html` for all non-static-file paths. React Router then handles the path in the browser, navigating to the correct page.

---

## Challenge 5: Backend Cold Start on Render Free Tier

**Problem:** Render's free tier spins down the backend after 15 minutes of inactivity. The next request after spin-down takes 30-60 seconds. If the user clicks "Send OTP" and the backend is cold, they see a 30-60 second spinner — a terrible UX.

**Solution:** In `client/src/main.jsx`, fire a `fetch(VITE_API_URL + '/health')` immediately when the React app loads. This happens before the user even sees the login page. By the time they fill in their identifier and click "Send OTP" (typically 5-10 seconds), the backend is already warm.

**Tradeoff:** The health endpoint is called on every page load, even for users who are already authenticated and won't need to hit the backend immediately. Acceptable for a demo app.

---

## Challenge 6: Image Update Without Losing Existing Images

**Problem:** When editing a product, the user might add new images. The existing Cloudinary URLs are already saved in the database. Re-uploading all existing images would be wasteful. But if the PUT endpoint just accepts files, the existing image URLs would be lost.

**Solution:** The frontend distinguishes between `existingImages` (URL strings) and `newImages` (File objects). On submit, only new File objects are sent in FormData. The backend's update handler uses `$push: { images: { $each: newUrls } }` — MongoDB's array push operator — to append new URLs to the existing array without replacing it.

**Limitation this creates:** There's no mechanism to remove existing images via the edit flow. This is a known limitation.

---

## Challenge 7: ObjectId Comparison for Ownership Checks

**Problem:** `product.createdBy === req.user._id` always returns `false`, even when they refer to the same user. The ownership check would incorrectly deny all updates.

**Root cause:** Mongoose `ObjectId`s are objects, not strings. `===` compares object references (always different in memory), not values.

**Solution:** Mongoose provides `.equals()` for ObjectId comparison: `product.createdBy.equals(req.user._id)`. This compares the underlying hex string values correctly.

---

## Scalability Discussion

**What would break first at scale?**

1. **`GET /products` — no pagination.** If a user has 10,000 products, the query returns all 10,000. Solution: cursor-based or page-based pagination.

2. **`Product.find({ createdBy })` — no index.** MongoDB does a collection scan. Solution: `productSchema.index({ createdBy: 1, createdAt: -1 })`.

3. **`authenticate` runs `User.findById` on every request.** At high load, this is one extra DB query per request. Solution: trust the JWT payload and only hit the DB when necessary (e.g., for sensitive operations), or cache user records in Redis.

4. **No OTP rate limiting.** Anyone can call `POST /api/auth/send-otp` thousands of times per second. Solution: rate limiting middleware (e.g., `express-rate-limit`).

5. **Single Render instance.** All traffic goes through one server. Solution: horizontal scaling (multiple instances with a load balancer), but this requires moving session/state out of process memory (not an issue here since auth is stateless JWT).
