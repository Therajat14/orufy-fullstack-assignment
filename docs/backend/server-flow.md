# Server Flow

## Request Lifecycle (Detailed)

This document traces the complete journey of two representative requests through the Express application.

---

## Flow 1: Unauthenticated Request — Send OTP

```
POST /api/auth/send-otp
Content-Type: application/json
Body: { "identifier": "user@email.com" }

┌─────────────────────────────────────────────────────────────┐
│ 1. Node.js HTTP server receives TCP connection              │
│                                                             │
│ 2. CORS middleware                                          │
│    - Reads Origin header                                    │
│    - Checks against CLIENT_URL                              │
│    - Sets Access-Control-Allow-Origin response header       │
│                                                             │
│ 3. express.json()                                           │
│    - Content-Type is application/json                       │
│    - Parses body → req.body = { identifier: "..." }         │
│                                                             │
│ 4. Router: /api/auth matches → auth router                  │
│    /send-otp matches → route handler chain                  │
│                                                             │
│ 5. validate(sendOtpSchema)                                  │
│    - Zod safeParse({ identifier: "user@email.com" })        │
│    - Valid email → passes                                   │
│    - req.body = parsed result                               │
│                                                             │
│ 6. Route handler                                            │
│    a. Generate random 6-digit OTP string                    │
│    b. Set expiresAt = now + 5 minutes                       │
│    c. OTP.findOneAndUpdate({ identifier }, ..., upsert:true)│
│       → MongoDB Atlas query via Mongoose                    │
│    d. Respond: 200 { message, otp }                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Flow 2: Authenticated Request with File Upload — Create Product

```
POST /api/products
Authorization: Bearer eyJhbGci...
Content-Type: multipart/form-data
Body: form fields + image files

┌─────────────────────────────────────────────────────────────┐
│ 1. CORS middleware → passes (valid origin)                  │
│                                                             │
│ 2. express.json() → skips (not application/json)           │
│    express.urlencoded() → skips (not URL-encoded)           │
│                                                             │
│ 3. Router: /api/products → products router                  │
│    POST / → middleware chain starts                         │
│                                                             │
│ 4. authenticate middleware                                  │
│    a. Read Authorization header                             │
│    b. Split "Bearer " prefix → extract token                │
│    c. jwt.verify(token, JWT_SECRET) → decoded = { id }      │
│    d. User.findById(decoded.id).select('-__v')              │
│       → MongoDB query                                       │
│    e. req.user = userDocument                               │
│    f. next()                                                │
│                                                             │
│ 5. upload.array('images', 10) — Multer                      │
│    a. Parses multipart body                                 │
│    b. For each file:                                        │
│       - Checks MIME type (must be image/*)                  │
│       - Checks file size (max 5MB)                          │
│       - Streams to Cloudinary via CloudinaryStorage         │
│       - Cloudinary returns URL                              │
│    c. req.files = [{ path: "https://res.cloudinary.com/..." }]│
│    d. req.body = text fields from multipart                 │
│    e. next()                                                │
│                                                             │
│ 6. validate(createProductSchema) — Zod                      │
│    a. safeParse(req.body)                                   │
│    b. Coerces strings to numbers (quantityStock, mrp, etc.) │
│    c. Validates enum (productType)                          │
│    d. Validates exchangeEligibility ('Yes'/'No'/boolean)    │
│    e. If valid: req.body = coerced data                     │
│    f. next()                                                │
│                                                             │
│ 7. Route handler (createProduct)                            │
│    a. Extract image URLs: req.files.map(f => f.path)        │
│    b. Build product object from req.body + images + req.user│
│    c. new Product({ ...req.body, images, createdBy: user_id})│
│    d. product.save() → MongoDB insert                       │
│    e. Respond: 201 { product }                              │
└─────────────────────────────────────────────────────────────┘
```

---

## MongoDB Connection

```javascript
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err))
```

The connection is established once at startup. Mongoose maintains an internal connection pool. If the connection drops, Mongoose automatically attempts to reconnect.

`MONGO_URI` is a MongoDB Atlas connection string (cloud-hosted MongoDB), formatted as:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
```

---

## Error Flow

If any middleware or handler throws (or rejects a Promise in Express 5):

```
Route handler throws Error
    │
    ▼  (Express 5 catches async errors automatically)
Global error handler:
    app.use((err, req, res, next) => {
      console.error(err)
      res.status(500).json({ message: 'Internal server error' })
    })
    │
    ▼
Client receives: 500 { message: "Internal server error" }
```

Specific error cases that respond before reaching the global handler:
- `validate` → 422 with field errors
- `authenticate` → 401 with message
- Route handler ownership check → 403 with message
- Product not found → 404 with message
