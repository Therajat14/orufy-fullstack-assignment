# CRUD Workflow

## Products CRUD Summary

| Operation | Frontend | HTTP | Backend |
|---|---|---|---|
| Create | AddProductModal + ProductForm | `POST /api/products` (FormData) | authenticate → upload → validate → Product.save() |
| Read | useProducts hook on mount | `GET /api/products` | authenticate → Product.find({ createdBy }) |
| Update | EditProductModal + ProductForm | `PUT /api/products/:id` (FormData) | authenticate → upload → validate → findByIdAndUpdate |
| Delete | DeleteProductModal | `DELETE /api/products/:id` | authenticate → ownership check → findByIdAndDelete |
| Publish | ProductCard publish button | `PATCH /api/products/:id/publish` (JSON) | authenticate → ownership check → findByIdAndUpdate |

---

## CREATE

### Trigger
User fills `ProductForm` inside `AddProductModal` and clicks "Create Product".

### Frontend steps
1. `handleSubmit` in `AddProductModal` fires
2. Build `FormData` with all fields + File objects for images
3. Set button to loading state
4. Call `productsApi.create(formData)`
5. On success: `onAdd(response.data.product)` → `setProducts(prev => [newProduct, ...prev])`
6. Close modal, show success toast

### Backend steps
1. `authenticate` → verify JWT → attach `req.user`
2. `upload.array('images', 10)` → upload files to Cloudinary → `req.files`
3. `validate(createProductSchema)` → Zod coerces strings to numbers/booleans
4. Handler: `new Product({ ...req.body, images: req.files.map(f=>f.path), createdBy: req.user._id }).save()`
5. Return `201 { product }`

### State update
`products` array in `useProducts` is updated **without re-fetching** — the new product is prepended locally.

---

## READ

### Trigger
`useProducts` hook's `useEffect` runs on component mount (`ProductsPage` or `HomePage` render).

### Frontend steps
1. `setLoading(true)`
2. `productsApi.getAll()` → `GET /api/products`
3. On success: `setProducts(response.data.products)`, `setLoading(false)`
4. Products render in grid

### Backend steps
1. `authenticate` → verify JWT → attach `req.user`
2. `Product.find({ createdBy: req.user._id }).sort({ createdAt: -1 })`
3. Return `200 { products: [...] }`

### Filtering (client-side)
After fetch, products are filtered in the render function:
- **ProductsPage**: by `name.toLowerCase().includes(searchQuery)`
- **HomePage**: by tab (`published === true/false`) AND search query

No server-side filtering or pagination exists.

---

## UPDATE

### Trigger
User edits fields in `EditProductModal` and clicks "Update Product".

### Pre-population
When `EditProductModal` opens, `setValues(product)` is called on `useForm`, pre-filling all fields with current product values. The user only changes what they want.

### Image handling
`EditProductModal` distinguishes between:
- `existingImages`: array of URL strings from the current product (already on Cloudinary)
- `newImages`: new `File` objects the user just selected

On submit, `existingImages` are **not sent** in FormData (they're already saved). Only `newImages` are appended as files. The server appends them to the existing array using `$push: { images: { $each: [...] } }`.

**Limitation:** There is no way to remove existing images via the edit flow.

### Frontend steps
1. Build `FormData` with updated fields + any new File objects
2. Call `productsApi.update(product._id, formData)`
3. On success: `onUpdate(response.data.product)` → `updateProduct(updated)` in `useProducts`
   → `setProducts(prev => prev.map(p => p._id === updated._id ? updated : p))`
4. Close modal, show success toast

### Backend steps
1. `authenticate` → `upload.array()` → `validate(updateProductSchema)` (all fields optional)
2. `Product.findById(id)` → ownership check
3. `Product.findByIdAndUpdate(id, { $set: req.body, $push: { images: { $each: newUrls } } }, { new: true })`
4. Return `200 { product }`

---

## DELETE

### Trigger
User clicks trash icon on `ProductCard` → `DeleteProductModal` opens → clicks "Delete".

### Frontend steps
1. `productsApi.remove(product._id)` → `DELETE /api/products/:id`
2. On success: `onDelete(product._id)` → `removeProduct(id)` in `useProducts`
   → `setProducts(prev => prev.filter(p => p._id !== id))`
3. Close modal, show success toast

### Backend steps
1. `authenticate` → ownership check via `Product.findById`
2. `Product.findByIdAndDelete(id)`
3. Return `200 { message: 'Product deleted' }`

### Note on Cloudinary
The Cloudinary images are **not deleted** when a product is removed. This is a limitation — Cloudinary storage accumulates orphaned files over time.

---

## PUBLISH TOGGLE

### Trigger
User clicks "Publish" or "Unpublish" button on `ProductCard`.

### Frontend steps
1. `productsApi.togglePublish(product._id, !product.published)`
2. On success: `updateProduct(response.data.product)` in `useProducts`
3. `ProductCard` re-renders with new published state

### Backend steps
1. `authenticate` → ownership check
2. `Product.findByIdAndUpdate(id, { $set: { published: req.body.published } }, { new: true })`
3. Return `200 { product }`

### Effect on HomePage
After toggling, the product:
- If `published → true`: now appears in "Published" tab, disappears from "Unpublished" tab
- If `published → false`: moves to "Unpublished" tab

This is immediate because `useProducts` in `HomePage` updates its local state, and the tab filter is computed during render.
