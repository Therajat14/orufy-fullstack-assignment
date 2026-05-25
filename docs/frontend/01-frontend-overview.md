# Frontend Overview

## Entry Points

### `client/src/main.jsx`
The application's JavaScript entry point. It:
1. Creates the React 19 root on `#root`
2. Fires a `fetch()` to `VITE_API_URL/health` immediately — this "wakes up" the Render backend (which sleeps on the free tier) before the user even starts logging in
3. Renders `<App />` inside `<React.StrictMode>`

### `client/src/App.jsx`
The root component. It composes:
- `<AuthProvider>` — wraps the entire tree so any component can access auth state
- `<BrowserRouter>` — enables client-side routing
- `<AppRoutes />` — the central route configuration

---

## Folder Structure and Responsibilities

```
client/src/
├── api/              API call functions (sendOtp, verifyOtp, getAll, create…)
├── assets/           Static images (logo, background, product showcase image)
├── components/
│   ├── auth/         AuthLeftPanel (decorative left panel on auth pages)
│   ├── home/         ProductCard (shared between Home and Products pages)
│   ├── layout/       AppLayout, Sidebar, all SVG icon components
│   ├── products/     AddProductModal, EditProductModal, DeleteProductModal, ProductForm
│   └── ui/           Button, Modal, Toast, EmptyState, FormField
├── constants/        routes.js — all path strings in one place
├── context/          AuthContext.jsx, authContextValue.js, AuthProvider
├── hooks/            useAuth, useForm, useToast, useProducts
├── layouts/          AuthLayout (wrapper for login/OTP/signup pages)
├── pages/            LoginPage, OTPPage, SignupPage, HomePage, ProductsPage
├── routes/           index.jsx — route tree, ProtectedRoute, GuestRoute
├── services/         api.js — Axios instance with interceptors
├── App.jsx
└── main.jsx
```

### Why this folder split?

- `api/` is intentionally separate from `services/` — `services/api.js` is the **configured Axios instance**, while `api/` holds **domain-specific call functions** (auth vs products). This keeps the transport concern separate from the business concern.
- `components/ui/` contains only fully generic pieces (Button, Modal, Toast) that have no domain knowledge.
- `components/home/` and `components/products/` hold domain-specific components.
- `hooks/` extracts stateful logic so pages stay thin.
- `layouts/` wraps page-level shells (AuthLayout, AppLayout) so pages don't repeat chrome.

---

## Core Patterns

### Pattern 1 — Page owns state, passes handlers down
Pages like `ProductsPage` own the `useProducts` hook result and pass callbacks (`onEdit`, `onDelete`, `onPublish`) to `ProductCard`. This keeps product list mutations in one place.

### Pattern 2 — Modal controlled from page
Pages hold a boolean `showAddModal` / `showEditModal` / `showDeleteModal` state. The page renders the modal conditionally and passes the close handler. No global modal system is used.

### Pattern 3 — useForm for form state
Every form uses `useForm(initialValues)` which returns `{ values, errors, handleChange, setError, reset, setValues }`. This eliminates repeated `useState` boilerplate.

### Pattern 4 — FormData for file uploads
When a product form is submitted, the handler builds a `FormData` object manually (iterating over fields and appending `File` objects for images). This is required because `multipart/form-data` cannot be sent as JSON.

### Pattern 5 — Inline error display via FormField
Every form input is wrapped in `<FormField label="..." error={errors.fieldName}>`. The `FormField` component renders the label, the input (via `children`), and any error string below it.

---

## Environment Variable

```
VITE_API_URL=http://localhost:5000/api
```

Vite exposes any variable prefixed `VITE_` to the browser bundle as `import.meta.env.VITE_API_URL`. This is set at build time, not runtime, so Vercel must have it configured in its environment settings.
