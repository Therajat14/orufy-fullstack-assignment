# Error Handling

## Strategy Overview

Errors are handled at multiple layers in the backend. Each layer handles what it knows about and lets the rest fall through to the global handler.

```
┌──────────────────────────────────────────────────────┐
│ Layer 1: Validation middleware (validate.js)         │
│   Returns 422 with field-level errors                │
├──────────────────────────────────────────────────────┤
│ Layer 2: Auth middleware (auth.js)                   │
│   Returns 401 for missing/invalid/expired tokens     │
├──────────────────────────────────────────────────────┤
│ Layer 3: Route handler (inline checks)               │
│   Returns 404 (not found) or 403 (forbidden)         │
├──────────────────────────────────────────────────────┤
│ Layer 4: Global error handler (index.js)             │
│   Returns 500 for any unhandled exception            │
└──────────────────────────────────────────────────────┘
```

---

## HTTP Status Codes Used

| Status | Meaning | When used |
|---|---|---|
| `200` | OK | Successful GET, PATCH, PUT, DELETE |
| `201` | Created | Successful POST (product creation) |
| `400` | Bad Request | OTP not found, OTP incorrect, OTP expired |
| `401` | Unauthorized | Missing token, invalid token, user not found |
| `403` | Forbidden | Authenticated but not the owner of the resource |
| `404` | Not Found | Product ID doesn't exist in DB |
| `422` | Unprocessable Entity | Zod validation failed (field-level errors) |
| `500` | Internal Server Error | Unhandled exception |

---

## Layer 1: Validation Errors (422)

```json
{
  "message": "Validation failed",
  "errors": [
    { "field": "name", "message": "Name is required" },
    { "field": "mrp", "message": "Expected number, received nan" }
  ]
}
```

The `errors` array allows the frontend to display per-field messages. Each item has:
- `field` — the dot-notation path in the request body (e.g., `"mrp"`)
- `message` — human-readable Zod error message

---

## Layer 2: Auth Errors (401)

```json
{ "message": "No token provided" }
{ "message": "User not found" }
```

If `jwt.verify()` throws (invalid signature, expired), Express 5 propagates the error to the global handler which responds with 500. Alternatively, the middleware can wrap the `jwt.verify` in try/catch and respond with 401 — the implementation detail matters for the actual behavior, but both result in a non-200 response indicating auth failure.

---

## Layer 3: Route Handler Errors (403, 404, 400)

Inline checks in route handlers:

```javascript
// 404 — resource not found
const product = await Product.findById(id)
if (!product) {
  return res.status(404).json({ message: 'Product not found' })
}

// 403 — resource found but user doesn't own it
if (!product.createdBy.equals(req.user._id)) {
  return res.status(403).json({ message: 'Not authorized' })
}

// 400 — domain-level invalid state (OTP logic)
if (otpDoc.otp !== otp) {
  return res.status(400).json({ message: 'Invalid OTP' })
}
if (otpDoc.expiresAt < new Date()) {
  return res.status(400).json({ message: 'OTP expired' })
}
```

---

## Layer 4: Global Error Handler (500)

Defined at the bottom of `server/index.js`:

```javascript
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
})
```

**What reaches this handler:**
- Unexpected exceptions in async route handlers (Express 5 catches these)
- Network errors to MongoDB (e.g., if Atlas is unreachable)
- JWT verify failures if not caught in auth middleware
- Any other runtime error

**What this handler does NOT do:**
- It does not expose the error stack trace to the client (security best practice)
- It logs to `console.error` for server-side debugging

---

## Express 5 Async Error Propagation

In Express 4, async handlers that threw would not be caught by the global error handler:
```javascript
// Express 4 — this would crash the process if an error is thrown
app.get('/products', async (req, res) => {
  const data = await Product.find({})  // if this throws, Express 4 doesn't catch it
  res.json(data)
})
```

Express 5 automatically wraps async handlers so any thrown error is forwarded to the error handler. This is why the project can use clean async/await without try/catch blocks in every handler.

---

## Frontend Error Handling

On the client side, every API call is wrapped in try/catch:

```javascript
try {
  const res = await productsApi.create(formData)
  onAdd(res.data.product)
} catch (err) {
  // 422 validation errors
  if (err.response?.status === 422) {
    err.response.data.errors?.forEach(({ field, message }) => {
      setError(field, message)
    })
  } else {
    showToast(err.response?.data?.message || 'Something went wrong')
  }
}
```

The Axios response interceptor handles 401 globally (clears auth, redirects to login) so individual components don't need to check for 401.
