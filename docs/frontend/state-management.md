# State Management

## Overview

This project does **not** use Redux, Zustand, or any global state library. State is managed at three levels:

| Level | Mechanism | Where |
|---|---|---|
| Global auth state | React Context + localStorage | `context/` folder |
| Page-level product state | `useProducts` custom hook | Used in `HomePage`, `ProductsPage` |
| Form state | `useForm` custom hook | Used in all forms |
| Toast state | `useToast` custom hook | Used in pages |
| Component-local state | `useState` | Modals, image carousel index, tab selection |

---

## AuthContext

### Files
- `client/src/context/AuthContext.jsx` — creates the context object
- `client/src/context/authContextValue.js` — defines the shape of the context value
- `AuthProvider` is also exported from the context folder

### What it stores
```javascript
{
  user: null | { _id, name, identifier },
  login: (userData, token) => void,
  logout: () => void
}
```

### Persistence strategy
Auth state is persisted to **localStorage** (not sessionStorage). On every page load, `AuthProvider` initializes `user` by reading `localStorage.getItem('user')` and parsing it. This means the user stays logged in across browser tabs and page refreshes until `logout()` is called.

```javascript
// login() — called after successful OTP verification
login(userData, token) {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(userData))
  setUser(userData)
}

// logout() — called from header dropdown
logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  setUser(null)
}
```

### useAuth hook
**File:** `client/src/hooks/useAuth.js` (or similar)

Any component can call `const { user, login, logout } = useAuth()` to access auth state without prop drilling. The Axios request interceptor also reads `localStorage.getItem('token')` directly (outside React) to attach the Bearer token.

---

## useProducts Hook

**File:** `client/src/hooks/useProducts.js`

This hook owns the product list for the current user. Both `HomePage` and `ProductsPage` call it independently — each page manages its own product list copy.

### State
```javascript
{
  products: [],  // array of product objects from API
  loading: true  // true during initial fetch
}
```

### Methods
| Method | What it does |
|---|---|
| `addProduct(product)` | Prepends new product to local `products` array (no refetch) |
| `updateProduct(updated)` | Replaces matching product by `_id` in local array |
| `removeProduct(id)` | Filters out product by `_id` from local array |
| `togglePublish(product)` | Calls `PATCH /api/products/:id/publish`, then calls `updateProduct` |
| `deleteProduct(product)` | Calls `DELETE /api/products/:id`, then calls `removeProduct` |
| `refresh()` | Re-fetches all products from API |

### Optimistic vs. server-confirmed updates
After a create/update/delete operation, the hook updates local state **after** the API call succeeds. This is server-confirmed (not optimistic) — the UI only changes after the server responds with the new data. This prevents stale or incorrect UI states.

---

## useForm Hook

**File:** `client/src/hooks/useForm.js`

Used in `ProductForm` and auth pages to manage controlled form state.

### API
```javascript
const { values, errors, handleChange, setError, reset, setValues } = useForm(initialValues)
```

| Property/Method | Description |
|---|---|
| `values` | Current form field values object |
| `errors` | Object mapping field names to error strings |
| `handleChange(field)` | Returns an event handler for that field; sets `values[field]` |
| `setError(field, msg)` | Sets an error message for a specific field |
| `reset()` | Resets values to `initialValues` and clears all errors |
| `setValues(newValues)` | Bulk-sets values (used in EditProductModal to pre-populate) |

---

## useToast Hook

**File:** `client/src/hooks/useToast.js`

```javascript
const { toast, showToast, clearToast } = useToast()
```

| Property/Method | Description |
|---|---|
| `toast` | `{ message, duration }` or `null` |
| `showToast(msg, duration=3000)` | Sets toast state |
| `clearToast()` | Sets toast to null |

Pages pass `toast` to the `<Toast>` component and `clearToast` as the `onClose` prop. Auto-dismiss uses a `setTimeout` inside the hook.

---

## Local Component State

These pieces of state live directly inside components with `useState`:

| Component | State | Purpose |
|---|---|---|
| `HomePage` | `activeTab` | `'published' \| 'unpublished'` tab selection |
| `HomePage` | `showEditModal`, `showDeleteModal` | Modal visibility |
| `HomePage` | `selectedProduct` | Which product is being edited/deleted |
| `ProductsPage` | `showAddModal`, `showEditModal`, `showDeleteModal` | Modal visibility |
| `ProductsPage` | `selectedProduct` | Which product is being edited/deleted |
| `ProductCard` | `currentImageIndex` | Image carousel position |
| `ProductForm` | (via useForm) | Form values and errors |
| `AppLayout` | `dropdownOpen` | Header avatar dropdown visibility |
