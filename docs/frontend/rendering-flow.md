# Rendering Flow

## Initial Page Load Sequence

```
1. Browser loads index.html (served by Vercel)
2. Vite-bundled main.jsx executes
3. fetch(VITE_API_URL + '/health') fires (warms up Render backend)
4. ReactDOM.createRoot('#root').render(<App />)
5. App renders:
   a. AuthProvider mounts → reads localStorage → sets user state
   b. BrowserRouter mounts
   c. AppRoutes evaluates current URL path
6. Route guard checks (ProtectedRoute or GuestRoute)
7. Matching page component renders
```

---

## Auth State Initialization

`AuthProvider` runs this on mount (inside a `useEffect` or directly in `useState` initializer):

```javascript
const [user, setUser] = useState(() => {
  const stored = localStorage.getItem('user')
  return stored ? JSON.parse(stored) : null
})
```

Because `useState` accepts a lazy initializer function, this runs **once synchronously** before the first render. This means route guards have accurate auth state on the very first render — there is no "flash of wrong page."

---

## Protected Page Render (ProductsPage)

```
URL: /products
    │
    ▼
ProtectedRoute → user exists → renders children
    │
    ▼
AppLayout renders (sidebar + header + <Outlet />)
    │
    ▼
ProductsPage renders
    │
    ├── useProducts() called
    │     ├── useState → products=[], loading=true
    │     └── useEffect → productsApi.getAll()
    │                         │
    │               (async, next render)
    │
    ▼  Initial render:
ProductsPage renders:
    ├── Header with "Add Products" button
    ├── loading=true → Spinner shown
    └── ProductCard[] → empty (products=[])

    │
    ▼  After API resolves:
    ├── setProducts(response.products) → re-render
    ├── setLoading(false) → re-render
    └── ProductCard[] renders for each product
```

---

## Product Card Carousel Re-renders

`ProductCard` holds `currentImageIndex` in local `useState`. When a user clicks the left/right chevron:

```
onClick → setCurrentImageIndex(prev => prev + 1)
        → ProductCard re-renders
        → <img src={images[currentImageIndex]} /> updates
```

Only the single `ProductCard` instance re-renders. Parent components are not affected.

---

## Modal Open/Close Flow

```
ProductsPage holds:
  showAddModal = false

User clicks "Add Products" button
    │
    ▼
setShowAddModal(true) → ProductsPage re-renders
    │
    ▼
<AddProductModal isOpen={true} /> renders
    │
    └── Modal renders with backdrop
    └── ProductForm renders (fresh useForm state)

User submits form:
    ├── productsApi.create(formData) called
    ├── On success: onAdd(newProduct) called
    │     └── setProducts(prev => [newProduct, ...prev]) in useProducts
    ├── setShowAddModal(false) → modal unmounts
    └── showToast('Product added') → Toast renders
```

When the modal unmounts, `ProductForm`'s state (and `useForm`) is also destroyed and will be fresh next time.

---

## Search Filter Re-renders

The search bar in `AppLayout` header updates the URL's `?q=` query parameter:

```
User types in search bar
    │
    ▼
setSearchParams({ q: value })
    │ (React Router updates URL)
    ▼
ProductsPage reads: const [searchParams] = useSearchParams()
    │           const q = searchParams.get('q') || ''
    ▼
Filtered products computed:
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(q.toLowerCase())
    )
    │
    ▼
ProductCard[] re-renders with filtered list
```

Since the filter runs during render (no extra state), each keystroke causes one re-render of `ProductsPage`.

---

## Toast Lifecycle

```
Action completes (e.g., product created)
    │
    ▼
showToast('Product added successfully')
    │ sets: toast = { message, duration: 3000 }
    ▼
Page re-renders → <Toast message={...} onClose={clearToast} /> renders

Inside useToast:
    setTimeout(clearToast, 3000)

After 3 seconds:
    clearToast() → toast = null → Page re-renders → Toast unmounts
```

If `showToast` is called again before 3 seconds, the previous timeout is cleared and a new one starts (implemented via `useEffect` cleanup in the hook).

---

## Re-render Optimization Notes

- `useProducts` is called in each page separately — changes in one page's product list do not affect the other page's list
- No `React.memo` or `useMemo` is used — the product list is small enough that re-renders are fast
- Modals unmount when closed (`{showModal && <Modal />}` pattern), so their internal state resets
- The Sidebar and Header inside `AppLayout` only re-render if `AppLayout`'s own state changes (e.g., `dropdownOpen`)
