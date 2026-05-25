# API Integration

## Axios Instance

**File:** `client/src/services/api.js`

A single configured Axios instance is created and exported. All API functions import from this file instead of from `axios` directly — this ensures every request goes through the same interceptors.

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL  // e.g., http://localhost:5000/api
})
```

### Request Interceptor — Auto-attach Bearer token
Before every request, the interceptor reads the JWT from localStorage and attaches it:

```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

This means **no API function needs to manually set the Authorization header** — it's always there automatically if a token exists.

### Response Interceptor — Handle 401
If the server responds with HTTP 401 (token expired or invalid), the interceptor:
1. Clears `localStorage` (`token` and `user`)
2. Redirects the browser to `/login`

```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

---

## Auth API Functions

**File:** `client/src/api/auth.js`

```javascript
sendOtp(identifier)
  → POST /auth/send-otp
  → body: { identifier }
  → returns: { message, otp }   ← demo mode: OTP in response

verifyOtp(identifier, otp)
  → POST /auth/verify-otp
  → body: { identifier, otp }
  → returns: { message, token, user }
```

### How LoginPage uses sendOtp
```
1. User submits identifier
2. sendOtp(identifier) called
3. Response.otp shown in toast (demo convenience)
4. navigate('/verify-otp', { state: { identifier } })
```

### How OTPPage uses verifyOtp
```
1. User enters 6 digits
2. verifyOtp(identifier, otp) called
3. On success: login(user, token) → localStorage updated
4. navigate('/home')
```

---

## Products API Functions

**File:** `client/src/api/products.js`

```javascript
getAll()
  → GET /products
  → headers: Authorization: Bearer <token>
  → returns: { products: [...] }

create(formData)
  → POST /products
  → body: FormData (multipart/form-data)
  → returns: { product: {...} }

update(id, formData)
  → PUT /products/:id
  → body: FormData (multipart/form-data)
  → returns: { product: {...} }

togglePublish(id, published)
  → PATCH /products/:id/publish
  → body: { published: boolean }
  → returns: { product: {...} }

remove(id)
  → DELETE /products/:id
  → returns: { message: 'Product deleted' }
```

---

## FormData Construction

When creating or editing a product, the frontend must send files (images) alongside text fields. JSON cannot carry binary data, so `FormData` is used:

```javascript
const formData = new FormData()
formData.append('name', values.name)
formData.append('productType', values.productType)
formData.append('quantityStock', values.quantityStock)
formData.append('mrp', values.mrp)
formData.append('sellingPrice', values.sellingPrice)
formData.append('brandName', values.brandName)
formData.append('exchangeEligibility', values.exchangeEligibility)

// Each file is appended under the same key 'images'
values.images.forEach((file) => {
  formData.append('images', file)
})
```

Axios detects `FormData` and automatically sets `Content-Type: multipart/form-data` with the correct boundary. **Do not manually set Content-Type** when sending FormData with Axios.

---

## Error Handling on the Frontend

Every API call in pages/modals is wrapped in try/catch:

```javascript
try {
  const response = await productsApi.create(formData)
  onAdd(response.data.product)
  showToast('Product added successfully')
} catch (err) {
  const message = err.response?.data?.message || 'Something went wrong'
  setError('form', message)  // or showToast(message)
}
```

Validation errors from the server come back as:
```json
{
  "message": "Validation failed",
  "errors": [
    { "field": "name", "message": "Name is required" }
  ]
}
```

The frontend can iterate `err.response.data.errors` and call `setError(field, message)` for each one to display errors inline in the form.

---

## API Base URL Configuration

| Environment | VITE_API_URL |
|---|---|
| Local development | `http://localhost:5000/api` |
| Production (Vercel) | `https://orufy-fullstack-assignment-vggt.onrender.com/api` |

The base URL is set in `.env` (development) and in Vercel's environment variable settings (production).
