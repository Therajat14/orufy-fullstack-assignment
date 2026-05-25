# Validation

## Validation Strategy

All request body validation happens **server-side only**, using Zod schemas. There is no Zod or validation library on the frontend — the frontend relies on native HTML validation attributes and displays error messages returned from the API.

---

## Validation Middleware Factory

**File:** `server/middleware/validate.js`

```javascript
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(422).json({
        message: 'Validation failed',
        errors: result.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      })
    }
    req.body = result.data  // Zod-coerced data replaces req.body
    next()
  }
}
```

Using `safeParse` (not `parse`) means Zod returns a result object instead of throwing. This lets the middleware handle errors gracefully.

---

## Auth Schemas

**File:** `server/schemas/auth.js`

### `sendOtpSchema`
```javascript
z.object({
  identifier: z.string().refine(
    (val) => /\S+@\S+\.\S+/.test(val) || /^\d{7,15}$/.test(val),
    { message: 'Must be a valid email or phone number (7-15 digits)' }
  )
})
```

Accepts either:
- An email address (basic regex: contains `@` and `.`)
- A phone number: 7 to 15 digits only

### `verifyOtpSchema`
```javascript
z.object({
  identifier: z.string(),  // same as above (or just non-empty)
  otp: z.string().regex(/^\d{6}$/, 'OTP must be exactly 6 digits')
})
```

OTP must be exactly 6 numeric digits.

---

## Product Schemas

**File:** `server/schemas/product.js`

### `createProductSchema`
All fields are required.

```javascript
z.object({
  name: z.string().min(1, 'Name is required'),
  productType: z.enum(['Foods', 'Electronics', 'Clothes', 'Footwear', 'Beauty', 'Sports', 'Other']),
  quantityStock: z.coerce.number().min(0, 'Stock must be 0 or more'),
  mrp: z.coerce.number().min(0, 'MRP must be 0 or more'),
  sellingPrice: z.coerce.number().min(0, 'Selling price must be 0 or more'),
  brandName: z.string().min(1, 'Brand name is required'),
  exchangeEligibility: z.preprocess(
    (val) => {
      if (val === 'true' || val === 'Yes') return true
      if (val === 'false' || val === 'No') return false
      return val
    },
    z.boolean()
  )
})
```

### Why `z.coerce.number()`?
When data comes from `multipart/form-data`, **all fields are strings** — even numeric ones. `FormData` sends `quantityStock` as the string `"50"`, not the number `50`. `z.coerce.number()` converts string numbers to actual numbers, so the route handler always receives the correct type.

### `updateProductSchema`
Same as `createProductSchema` but all fields wrapped in `.optional()`:
```javascript
createProductSchema.partial()
```

This allows partial updates — only send the fields you want to change.

### `publishSchema`
```javascript
z.object({
  published: z.boolean()
})
```

Strict boolean — must be `true` or `false`, not `"true"` (a string). This is fine because the publish request is sent as `application/json`, not FormData.

---

## Validation Error Response

```json
HTTP 422 Unprocessable Entity
{
  "message": "Validation failed",
  "errors": [
    { "field": "mrp", "message": "Expected number, received nan" },
    { "field": "productType", "message": "Invalid enum value. Expected 'Foods' | 'Electronics' | ..." }
  ]
}
```

The `field` value matches the form field name, which allows the frontend to display errors next to the correct input.

---

## Middleware Ordering (Critical)

For product write routes, the middleware order is:
```
authenticate → upload.array() → validate(schema) → handler
```

**`upload` must come before `validate`** because:
- `express.json()` cannot parse `multipart/form-data`
- Multer (in `upload`) parses the multipart body and populates `req.body`
- Only after Multer runs does `req.body` contain the text fields Zod needs to validate
