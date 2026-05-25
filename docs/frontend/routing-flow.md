# Routing Flow

## Route Constants

All route paths are defined in one place:

**File:** `client/src/constants/routes.js`
```javascript
export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  VERIFY_OTP: '/verify-otp',
  SIGNUP: '/signup',
  HOME: '/home',
  PRODUCTS: '/products',
}
```

This prevents magic strings from being scattered across components — every navigation call and `<Link to={...}>` imports from this file.

---

## Route Tree

**File:** `client/src/routes/index.jsx`

```
/                    → redirect to /login
/login               → LoginPage     (GuestRoute)
/verify-otp          → OTPPage       (GuestRoute)
/signup              → SignupPage    (GuestRoute)
/home                → HomePage      (ProtectedRoute → AppLayout)
/products            → ProductsPage  (ProtectedRoute → AppLayout)
/*                   → redirect to /login  (catch-all)
```

---

## Route Guards

### ProtectedRoute
```
User visits /home
    │
    ▼
ProtectedRoute checks: does AuthContext have a user?
    │
    ├── YES → render <Outlet /> (the page)
    └── NO  → <Navigate to="/login" replace />
```

`ProtectedRoute` reads from `useAuth()` context. If `user` is null (not set in localStorage), it redirects immediately before any page content renders.

### GuestRoute
```
User visits /login
    │
    ▼
GuestRoute checks: does AuthContext have a user?
    │
    ├── YES → <Navigate to="/home" replace />  (already logged in)
    └── NO  → render <Outlet /> (the page)
```

`GuestRoute` prevents logged-in users from accessing auth pages. If someone navigates to `/login` while holding a valid JWT, they're sent to `/home`.

---

## Navigation Between Auth Pages

The OTP page needs the `identifier` (email or phone) that was entered on the login page. Since these are separate routes, the identifier is passed via React Router's **location state**:

```javascript
// LoginPage.jsx — on sendOtp success:
navigate(ROUTES.VERIFY_OTP, { state: { identifier } })

// OTPPage.jsx — reads it:
const { state } = useLocation()
const identifier = state?.identifier
```

If `OTPPage` is accessed directly without state (e.g., user types `/verify-otp` in the browser), `identifier` is undefined and the page handles this gracefully by showing an error or redirecting.

---

## Nested Layout with Outlet

Protected pages use a nested layout pattern. `AppLayout` renders the sidebar and header, and places `<Outlet />` where the page content goes:

```
ProtectedRoute
└── AppLayout          ← renders sidebar + header + <Outlet />
    └── Outlet
        ├── /home      → HomePage
        └── /products  → ProductsPage
```

This means the sidebar and header are mounted **once** and stay persistent while the user navigates between Home and Products. Only the Outlet content swaps.

---

## Search Within Pages

Both `HomePage` and `ProductsPage` use `useSearchParams()` (React Router 7) to read the `?q=` query parameter from the URL. The header's search bar updates this parameter on input change, and the page filters the product list against it. This means the search state lives in the URL, not in component state — bookmarkable and browser-back-compatible.
