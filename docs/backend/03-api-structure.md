# API Structure

## Base URL

| Environment | Base URL |
|---|---|
| Development | `http://localhost:5000/api` |
| Production | `https://orufy-fullstack-assignment-vggt.onrender.com/api` |

---

## Auth Endpoints (`/api/auth`)

**File:** `server/routes/auth.js`

### POST `/api/auth/send-otp`

Generates a 6-digit OTP and stores it in MongoDB with a 5-minute TTL.

**Auth required:** No

**Request body:**
```json
{ "identifier": "user@email.com" }
// or
{ "identifier": "9876543210" }
```

Identifier can be an email address or a phone number (7–15 digits). Validated by `sendOtpSchema`.

**Success response (200):**
```json
{
  "message": "OTP sent successfully",
  "otp": "483920"
}
```
> The `otp` field is included in the response for demo/testing purposes. In production this would be sent via email/SMS and removed from the response.

**Error responses:**
- `422` — validation failed (invalid identifier format)

---

### POST `/api/auth/verify-otp`

Verifies the submitted OTP against the stored one. If valid, creates a user if one doesn't exist, and issues a JWT.

**Auth required:** No

**Request body:**
```json
{
  "identifier": "user@email.com",
  "otp": "483920"
}
```

**Success response (200):**
```json
{
  "message": "Logged in successfully",
  "token": "eyJhbGci...",
  "user": {
    "_id": "64a1b...",
    "identifier": "user@email.com",
    "name": "user"
  }
}
```

**Error responses:**
- `400` — OTP not found (never sent or already expired/used)
- `400` — OTP incorrect
- `400` — OTP expired
- `422` — validation failed

---

## Product Endpoints (`/api/products`)

**File:** `server/routes/products.js`

All product endpoints require a valid JWT in the `Authorization` header.

**Header required for all product endpoints:**
```
Authorization: Bearer <jwt_token>
```

---

### GET `/api/products`

Returns all products belonging to the authenticated user, sorted newest first.

**Auth required:** Yes

**Request body:** None

**Success response (200):**
```json
{
  "products": [
    {
      "_id": "64b2c...",
      "name": "Running Shoes",
      "productType": "Footwear",
      "quantityStock": 50,
      "mrp": 2999,
      "sellingPrice": 1999,
      "brandName": "Nike",
      "images": ["https://res.cloudinary.com/..."],
      "exchangeEligibility": true,
      "published": false,
      "createdBy": "64a1b...",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### POST `/api/products`

Creates a new product. Accepts `multipart/form-data` because images are uploaded.

**Auth required:** Yes

**Content-Type:** `multipart/form-data`

**Form fields:**
| Field | Type | Required | Validation |
|---|---|---|---|
| `name` | string | Yes | Non-empty |
| `productType` | string | Yes | One of: Foods, Electronics, Clothes, Footwear, Beauty, Sports, Other |
| `quantityStock` | number | Yes | >= 0 |
| `mrp` | number | Yes | >= 0 |
| `sellingPrice` | number | Yes | >= 0 |
| `brandName` | string | Yes | Non-empty |
| `exchangeEligibility` | string/boolean | Yes | 'Yes'/'No'/'true'/'false'/true/false |
| `images` | file(s) | No | Up to 10 files; jpg/jpeg/png/webp; max 5MB each |

**Success response (201):**
```json
{
  "product": { ...newProduct }
}
```

**Error responses:**
- `401` — missing or invalid token
- `422` — validation failed

---

### PUT `/api/products/:id`

Updates an existing product. Only the owner can update.

**Auth required:** Yes

**Content-Type:** `multipart/form-data`

**URL parameter:** `:id` — the product's MongoDB `_id`

**Form fields:** Same as POST, all optional (partial update supported)

**Behavior for images:** New uploaded images are **appended** to the existing `images` array. Existing images are not removed.

**Success response (200):**
```json
{
  "product": { ...updatedProduct }
}
```

**Error responses:**
- `401` — not authenticated
- `403` — not the owner of this product
- `404` — product not found
- `422` — validation failed

---

### PATCH `/api/products/:id/publish`

Toggles a product's published/unpublished status.

**Auth required:** Yes

**URL parameter:** `:id`

**Request body:**
```json
{ "published": true }
// or
{ "published": false }
```

**Success response (200):**
```json
{
  "product": { ...productWithUpdatedPublished }
}
```

**Error responses:**
- `401`, `403`, `404` as above
- `422` — `published` field missing or not boolean

---

### DELETE `/api/products/:id`

Permanently deletes a product. Ownership check required.

**Auth required:** Yes

**URL parameter:** `:id`

**Request body:** None

**Success response (200):**
```json
{ "message": "Product deleted" }
```

**Error responses:**
- `401`, `403`, `404` as above

---

## Health Endpoint

### GET `/api/health`

**Auth required:** No

**Response (200):**
```json
{ "status": "ok" }
```

---

## Standard Error Response Shape

All error responses follow this format:

```json
{ "message": "Human-readable error message" }
```

Validation errors (422) include field-level details:
```json
{
  "message": "Validation failed",
  "errors": [
    { "field": "name", "message": "Name is required" },
    { "field": "mrp", "message": "Expected number, received string" }
  ]
}
```
