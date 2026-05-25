# Query Flow

## All Mongoose Queries by Endpoint

This document catalogs every database operation triggered by each API call.

---

## Auth Queries

### Send OTP
```
OTP.findOneAndUpdate(
  { identifier: "user@email.com" },
  { otp: "483920", expiresAt: Date(+5min) },
  { upsert: true, new: true }
)
```
**Effect:** Creates a new OTP document, or replaces the existing one for this identifier. The upsert ensures only one pending OTP exists per user at a time.

---

### Verify OTP
```
Step 1: OTP.findOne({ identifier: "user@email.com" })
        → Returns: OTP document or null

Step 2: OTP.deleteOne({ identifier: "user@email.com" })
        → Consumes the OTP (prevents reuse)

Step 3: User.findOne({ identifier: "user@email.com" })
        → Returns: User document or null

Step 4 (if user not found):
        User.create({ identifier: "user@email.com", name: "user" })
        → Creates new User document
```

---

## Product Queries

### GET /api/products
```
Product.find({ createdBy: ObjectId("64a1b...") })
       .sort({ createdAt: -1 })
```
**Effect:** Returns all products owned by the authenticated user, newest first. No pagination implemented — all products returned in one query.

---

### POST /api/products (create)
```
new Product({
  name: "Running Shoes",
  productType: "Footwear",
  quantityStock: 50,
  mrp: 2999,
  sellingPrice: 1999,
  brandName: "Nike",
  images: ["https://res.cloudinary.com/..."],
  exchangeEligibility: true,
  published: false,
  createdBy: ObjectId("64a1b...")
}).save()
```
**Effect:** Inserts one document into `products` collection.

---

### PUT /api/products/:id (update)
```
Step 1: Product.findById(ObjectId("64b2c..."))
        → Fetch for ownership check

Step 2: Product.findByIdAndUpdate(
          ObjectId("64b2c..."),
          {
            $set: {
              name: "Updated Name",
              sellingPrice: 1799
            },
            $push: {
              images: {
                $each: ["https://res.cloudinary.com/.../new-image.jpg"]
              }
            }
          },
          { new: true }
        )
```
**Effect:**
- `$set` — updates only the fields that were submitted (partial update)
- `$push: { $each: [...] }` — appends new image URLs to the existing array without removing old ones
- `{ new: true }` — returns the updated document (not the pre-update version)

---

### PATCH /api/products/:id/publish (toggle publish)
```
Step 1: Product.findById(ObjectId("64b2c..."))
        → Fetch for ownership check

Step 2: Product.findByIdAndUpdate(
          ObjectId("64b2c..."),
          { $set: { published: true } },
          { new: true }
        )
```
**Effect:** Updates only the `published` boolean field.

---

### DELETE /api/products/:id
```
Step 1: Product.findById(ObjectId("64b2c..."))
        → Fetch for ownership check

Step 2: Product.findByIdAndDelete(ObjectId("64b2c..."))
```
**Effect:** Permanently removes the product document. Cloudinary images are not deleted (the URLs in the `images` array become orphaned strings pointing to Cloudinary files that still exist).

---

## Authentication Middleware Query

This query runs on **every request** to `/api/products`:
```
User.findById(ObjectId("64a1b...")).select('-__v')
```
**Effect:** Fetches the user document to confirm the account still exists. The `.select('-__v')` excludes the Mongoose version key from the returned document.

---

## Query Performance Notes

| Query | Index | Performance |
|---|---|---|
| `OTP.findOne({ identifier })` | No explicit index (field is used as unique key in logic) | Fast for small collection |
| `Product.find({ createdBy })` | No explicit index on `createdBy` | Full collection scan at scale |
| `Product.findById(id)` | `_id` index (always exists in MongoDB) | O(log n), always fast |
| `User.findById(id)` | `_id` index | O(log n), always fast |

For production scale, adding a compound index on `products`:
```javascript
productSchema.index({ createdBy: 1, createdAt: -1 })
```
would make the `GET /products` query use an index instead of scanning all documents.
