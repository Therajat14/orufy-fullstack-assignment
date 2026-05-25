# Middleware

## Overview

Three custom middleware modules exist in `server/middleware/`:

| File | Purpose | Applied on |
|---|---|---|
| `auth.js` | JWT verification, attaches `req.user` | All `/api/products` routes |
| `upload.js` | Multer + Cloudinary storage, handles file upload | POST and PUT `/api/products` |
| `validate.js` | Zod schema validation, parses and validates `req.body` | All auth and product write routes |

---

## 1. Authentication Middleware

**File:** `server/middleware/auth.js`

### Responsibility
Extracts the JWT from the request, verifies its signature, looks up the user in MongoDB, and attaches the user document to `req.user`. If anything fails, it responds with 401.

### How it works (step by step)

```javascript
async function authenticate(req, res, next) {
  // 1. Extract Authorization header
  const authHeader = req.headers.authorization

  // 2. Check it starts with "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' })
  }

  // 3. Extract the token string
  const token = authHeader.split(' ')[1]

  // 4. Verify JWT signature and decode payload
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  // If invalid/expired, jwt.verify throws → caught by global error handler → 500
  // (Express 5 async error propagation)

  // 5. Look up user in DB
  const user = await User.findById(decoded.id).select('-__v')

  // 6. If user deleted after token issued
  if (!user) {
    return res.status(401).json({ message: 'User not found' })
  }

  // 7. Attach user to request object
  req.user = user

  next()
}
```

### Token format expected
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### JWT payload structure
The token contains `{ id: user._id }` and is signed with `process.env.JWT_SECRET` with a 7-day expiry:
```javascript
jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
```

### What routes use it
All routes in `server/routes/products.js` apply this middleware before the handler:
```javascript
router.get('/', authenticate, getProducts)
router.post('/', authenticate, upload.array('images', 10), validate(createProductSchema), createProduct)
// etc.
```

---

## 2. Upload Middleware

**File:** `server/middleware/upload.js`

### Responsibility
Configures Multer to stream uploaded files directly to Cloudinary. By the time the route handler runs, files are already uploaded and their Cloudinary URLs are in `req.files`.

### Configuration

```javascript
const storage = new CloudinaryStorage({
  cloudinary: cloudinaryV2,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { quality: 'auto', fetch_format: 'auto' }
    ]
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },  // 5MB
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images are allowed'))
    }
    cb(null, true)
  }
})
```

### What `req.files` looks like after upload

```javascript
req.files = [
  {
    fieldname: 'images',
    originalname: 'shoe.jpg',
    mimetype: 'image/jpeg',
    path: 'https://res.cloudinary.com/demo/image/upload/v1/products/abc123.jpg',
    filename: 'products/abc123'
  }
  // ... more files
]
```

The route handler extracts URLs: `req.files.map(f => f.path)`

### Cloudinary optimizations applied at upload
- `quality: 'auto'` — Cloudinary picks the best quality/size balance
- `fetch_format: 'auto'` — Cloudinary serves WebP to browsers that support it, JPEG otherwise

### Error cases
- File size > 5MB → Multer throws with "File too large"
- Non-image MIME type → `fileFilter` rejects with "Only images are allowed"
- More than 10 files → `upload.array('images', 10)` rejects the extra files

---

## 3. Validate Middleware

**File:** `server/middleware/validate.js`

### Responsibility
A **middleware factory** that accepts a Zod schema and returns an Express middleware function. It validates `req.body` against the schema, and either passes parsed data through to `req.body` or responds with a 422 error.

### How it works

```javascript
function validate(schema) {
  return function(req, res, next) {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const errors = result.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
      return res.status(422).json({
        message: 'Validation failed',
        errors
      })
    }

    req.body = result.data  // replace body with Zod-coerced/parsed data
    next()
  }
}
```

### Why `req.body = result.data`?
Zod can **coerce and transform** data. For example, `quantityStock` arrives from `FormData` as a string `"50"` — the Zod schema uses `z.coerce.number()` to convert it to the number `50`. The route handler receives the already-type-safe version.

### Usage pattern
```javascript
router.post(
  '/',
  authenticate,
  upload.array('images', 10),
  validate(createProductSchema),  // validate AFTER upload (body parsed after multipart)
  createProduct
)
```

Note: `validate` comes **after** `upload` because Multer must parse the `multipart/form-data` body before Zod can validate it.

### Error response example
```json
{
  "message": "Validation failed",
  "errors": [
    { "field": "mrp", "message": "Expected number, received nan" },
    { "field": "productType", "message": "Invalid enum value" }
  ]
}
```
