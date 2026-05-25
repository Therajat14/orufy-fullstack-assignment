# Component Structure

## Component Hierarchy

```
App
└── AuthProvider
    └── BrowserRouter
        └── AppRoutes
            ├── GuestRoute
            │   ├── AuthLayout
            │   │   └── LoginPage
            │   │       └── FormField + Button
            │   ├── AuthLayout
            │   │   └── OTPPage
            │   │       └── 6x digit inputs + Button
            │   └── AuthLayout
            │       └── SignupPage
            │           └── FormField + Button
            └── ProtectedRoute
                └── AppLayout
                    ├── Sidebar
                    │   ├── Logo
                    │   └── NavLinks (HomeIcon, ProductsIcon)
                    ├── Header (inside AppLayout)
                    │   ├── SearchBar
                    │   └── Avatar + Dropdown (LogoutIcon)
                    └── Outlet
                        ├── HomePage
                        │   ├── Tab bar (Published/Unpublished)
                        │   ├── ProductCard[]
                        │   │   └── Image carousel + action buttons
                        │   ├── EmptyState (when no products)
                        │   ├── EditProductModal
                        │   │   └── ProductForm
                        │   └── DeleteProductModal
                        └── ProductsPage
                            ├── Header (Add Products button)
                            ├── ProductCard[]
                            ├── EmptyState
                            ├── AddProductModal
                            │   └── ProductForm
                            ├── EditProductModal
                            │   └── ProductForm
                            └── DeleteProductModal
```

---

## UI Components (`client/src/components/ui/`)

### Button
**File:** `components/ui/Button.jsx`

**Props:**
| Prop | Type | Default | Description |
|---|---|---|---|
| variant | `'primary' \| 'danger' \| 'auth'` | `'primary'` | Color scheme |
| disabled | boolean | false | Disables click and reduces opacity |
| fullWidth | boolean | false | Sets width: 100% |
| className | string | — | Extra Tailwind classes |
| style | object | — | Inline style overrides |
| type | string | `'button'` | HTML button type |
| onClick | function | — | Click handler |

**Color mapping:**
- `primary` → `#3b4cca` background
- `auth` → `#1e2a8a` background (darker blue for auth pages)
- `danger` → `#ef4444` background

### Modal
**File:** `components/ui/Modal.jsx`

Three-slot structure: header (title + close X), scrollable body, optional footer. Closes on Escape keydown or backdrop click. Size is controlled via the `size` prop:
- `sm` → 360px max-width
- `md` → 420px max-width
- `lg` → 500px max-width

Backdrop: `rgba(15,22,40,0.45)` with `position: fixed, inset: 0`.

### Toast
**File:** `components/ui/Toast.jsx`

Fixed at bottom-center. Shows a green check icon (`#12B76A`) and a message string. Has an `X` close button. The caller passes `duration` (default 3000ms) and `onClose`. Auto-dismiss is handled inside the `useToast` hook, not inside this component.

### EmptyState
**File:** `components/ui/EmptyState.jsx`

Centered panel with `min-height: 420px`. Accepts `icon`, `title`, `description`, and an optional `action` (object with `label` and `onClick`). Used in both `HomePage` and `ProductsPage` when the product list is empty.

### FormField
**File:** `components/ui/FormField.jsx`

A simple wrapper: renders a `<label>`, then `{children}` (the actual input), then an error string in `color: #ff3b30` if `error` prop is truthy. Used in `ProductForm` and auth pages to standardize input layout.

---

## Layout Components (`client/src/components/layout/`)

### AppLayout
**File:** `components/layout/AppLayout.jsx`

The shell for all protected pages. Renders:
- A fixed 240px sidebar on the left
- A main content area on the right with a 52px header and a scrollable body (`<Outlet />`)
- The header contains a centered search bar, and a right-side avatar with dropdown (shows user name, identifier, and logout button)

The gradient mesh in the header background is achieved via an inline `background` property with multiple radial gradients.

### Sidebar
**File:** `components/layout/Sidebar.jsx`

Dark-themed (`#1A1F27`). Contains:
- Logo image at top
- Navigation links: Home (`/home`) and Products (`/products`)
- Active state: highlighted background and white text on the active link
- Uses `useLocation()` to determine the active route

### Icons
**File:** `components/layout/index.jsx`

Exports SVG icon components: `HomeIcon`, `ProductsIcon`, `SearchIcon`, `XIcon`, `PlusIcon`, `TrashIcon`, `EditIcon`, `ChevronLeftIcon`, `ChevronRightIcon`, `ChevronDownIcon`, `CheckCircleIcon`, `UploadIcon`, `GridEmptyIcon`, `LogoutIcon`. All accept a `size` prop (default `20`).

### AuthLeftPanel
**File:** `components/auth/AuthLeftPanel.jsx`

The decorative left half of auth pages. Contains gradient overlays, the product logo, a product showcase image (from `assets/`), and marketing text. Pure presentation — no logic.

---

## Domain Components

### ProductCard
**File:** `components/home/ProductCard.jsx`

Displays a single product. Features:
- **Image carousel:** If `images.length > 1`, shows left/right chevron buttons and navigation dots. Tracks `currentImageIndex` in local state.
- **Details section:** productType, quantityStock (with "In Stock" label), MRP (struck-through), sellingPrice, brandName, image count badge, exchangeEligibility badge
- **Action buttons:** Publish/Unpublish toggle (`PATCH /api/products/:id/publish`), Edit (opens `EditProductModal` from parent), Delete (opens `DeleteProductModal` from parent)
- Hover effects: border color shift and box-shadow transition

Used in both `HomePage` (read-oriented, still allows publish/delete/edit) and `ProductsPage` (same cards, different surrounding layout).

### ProductForm
**File:** `components/products/ProductForm.jsx`

The shared form for creating and editing products. Fields:
- `name` — text input
- `productType` — custom dropdown (Foods, Electronics, Clothes, Footwear, Beauty, Sports, Other)
- `quantityStock` — number input
- `mrp` — number input
- `sellingPrice` — number input
- `brandName` — text input
- `images` — drag-and-drop upload zone + preview grid
- `exchangeEligibility` — custom dropdown (Yes / No)

Uses `useForm` hook for state. Image preview shows uploaded thumbnails with remove buttons. When editing, existing image URLs are displayed separately from newly picked File objects (since existing ones are already on Cloudinary).

### AddProductModal
**File:** `components/products/AddProductModal.jsx`

Wraps `ProductForm` in a `Modal` (size `lg`). On submit: builds a `FormData`, appends all fields, appends each `File` under the key `images`, calls `productsApi.create(formData)`, then calls `onAdd(newProduct)` to update parent state. Handles loading and error states.

### EditProductModal
**File:** `components/products/EditProductModal.jsx`

Same pattern as `AddProductModal` but pre-populates `useForm` with existing product values via `setValues()` on mount. Distinguishes `existingImages` (URLs already on Cloudinary) from new `File` objects in the form. On submit, sends a `PUT` with FormData, calling `onUpdate(updatedProduct)`.

### DeleteProductModal
**File:** `components/products/DeleteProductModal.jsx`

Simple confirmation modal. Shows the product name and a red "Delete" button. On confirm: calls `productsApi.remove(product._id)`, then calls `onDelete(product._id)` to update parent state.

---

## Auth Components (`client/src/layouts/AuthLayout.jsx`)

`AuthLayout` is a layout component (not a page). It renders a two-column layout:
- Left 40%: `<AuthLeftPanel />` (decorative)
- Right 60%: the form content passed as `children`, plus an optional `bottomSlot` prop for "Don't have an account? Sign up" links

Used by `LoginPage`, `OTPPage`, and `SignupPage`.
