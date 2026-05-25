# Database Flow

## Database: MongoDB Atlas

All data is stored in a cloud-hosted MongoDB Atlas cluster. Mongoose is used as the ODM (Object Document Mapper) — it provides schema validation at the application level, query building, and model methods.

---

## Queries Per Endpoint

### `POST /api/auth/send-otp`
```javascript
// Upsert OTP — create if not exists, update if already exists
OTP.findOneAndUpdate(
  { identifier },                    // filter: find by identifier
  { otp, expiresAt },               // update: new OTP and expiry
  { upsert: true, new: true }        // options: create if not found
)
```
- **Collection:** `otps`
- **Operation:** upsert (1 write)
- **Index used:** `identifier` field (unique-like behavior from query pattern)

---

### `POST /api/auth/verify-otp`
```javascript
// 1. Look up OTP
const otpDoc = await OTP.findOne({ identifier })

// 2. Delete OTP after successful verification
await OTP.deleteOne({ identifier })

// 3. Find or create user
let user = await User.findOne({ identifier })
if (!user) {
  const name = identifier.includes('@')
    ? identifier.split('@')[0]
    : 'User'
  user = await User.create({ identifier, name })
}

// 4. (No save needed — JWT is issued in-memory)
```
- **Collections:** `otps` (1 read + 1 delete), `users` (1 read + possibly 1 write)
- **Total DB operations:** 3 or 4

---

### `GET /api/products`
```javascript
const products = await Product.find({ createdBy: req.user._id })
  .sort({ createdAt: -1 })
```
- **Collection:** `products`
- **Filter:** `createdBy` must equal authenticated user's `_id`
- **Sort:** newest first (descending `createdAt`)
- **No projection** — returns all fields

---

### `POST /api/products`
```javascript
const imageUrls = req.files.map(f => f.path)  // from Cloudinary (already uploaded)

const product = new Product({
  ...req.body,             // validated and coerced fields
  images: imageUrls,
  createdBy: req.user._id
})
await product.save()
```
- **Collection:** `products`
- **Operation:** insert (1 write)
- Images are already on Cloudinary before the DB write — URLs stored as strings

---

### `PUT /api/products/:id`
```javascript
// 1. Ownership check
const product = await Product.findById(req.params.id)
if (!product) return 404
if (!product.createdBy.equals(req.user._id)) return 403

// 2. Collect new image URLs (uploaded to Cloudinary by Multer already)
const newImages = req.files.map(f => f.path)

// 3. Update with $set + $push for images
const updated = await Product.findByIdAndUpdate(
  req.params.id,
  {
    $set: { ...req.body },                         // update text fields
    $push: { images: { $each: newImages } }        // append new images
  },
  { new: true }                                    // return updated document
)
```
- **Collection:** `products`
- **Operations:** 1 read (ownership check) + 1 write (update)
- `$push: { images: { $each: [...] } }` — appends to the array without removing existing URLs

---

### `PATCH /api/products/:id/publish`
```javascript
const product = await Product.findById(req.params.id)
if (!product) return 404
if (!product.createdBy.equals(req.user._id)) return 403

const updated = await Product.findByIdAndUpdate(
  req.params.id,
  { $set: { published: req.body.published } },
  { new: true }
)
```
- **Collection:** `products`
- **Operations:** 1 read + 1 write

---

### `DELETE /api/products/:id`
```javascript
const product = await Product.findById(req.params.id)
if (!product) return 404
if (!product.createdBy.equals(req.user._id)) return 403

await Product.findByIdAndDelete(req.params.id)
```
- **Collection:** `products`
- **Operations:** 1 read (ownership check) + 1 delete
- Cloudinary images are **not deleted** from Cloudinary when a product is deleted (the URLs become orphaned)

---

## Ownership Check Pattern

Every mutating product endpoint follows the same pattern before modifying data:

```javascript
const product = await Product.findById(id)
if (!product) return res.status(404).json({ message: 'Product not found' })
if (!product.createdBy.equals(req.user._id)) {
  return res.status(403).json({ message: 'Not authorized' })
}
```

`.equals()` is a Mongoose method for comparing ObjectIds (which are objects, not strings — `===` would always be false).

---

## Indexes

| Collection | Index | Type | Purpose |
|---|---|---|---|
| `otps` | `expiresAt` | TTL (expireAfterSeconds: 0) | Auto-delete expired OTPs |
| `users` | `identifier` | unique | Prevent duplicate accounts |
| `products` | `createdBy` | (implicit, no explicit index) | Filter by owner |

> **Performance note:** For a small dataset, the lack of an explicit index on `products.createdBy` is acceptable. At scale, adding `productSchema.index({ createdBy: 1, createdAt: -1 })` would significantly speed up the GET products query.
