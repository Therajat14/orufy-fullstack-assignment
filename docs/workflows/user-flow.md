# User Flow

## Flow 1: First-Time User — Sign Up / Login

```
User opens https://orufy-fullstack-assignment-five.vercel.app
    │
    ▼
main.jsx fires fetch('/api/health') → wakes Render backend
    │
    ▼
/ route → redirects to /login (GuestRoute sees no user)
    │
    ▼
LoginPage renders (AuthLayout: left panel + right form)
    │
    ▼
User types email or phone number in the identifier input
    │
    ▼
Clicks "Send OTP" (Button variant="auth")
    │
    ▼
sendOtp("user@email.com") → POST /api/auth/send-otp
    │
    ├── Server validates identifier format
    ├── Server generates 6-digit OTP
    ├── Server upserts OTP in MongoDB (5min TTL)
    └── Server returns { message, otp: "483920" }
    │
    ▼
Toast shows: "OTP sent — [483920]" (demo convenience)
    │
    ▼
navigate('/verify-otp', { state: { identifier } })
    │
    ▼
OTPPage renders
    ├── 6 separate digit input boxes (grid layout)
    ├── 20-second resend countdown starts
    └── User's identifier shown for context
    │
    ▼
User types/pastes OTP (auto-focus advances between inputs)
    │
    ▼
Clicks "Verify OTP"
    │
    ▼
verifyOtp("user@email.com", "483920") → POST /api/auth/verify-otp
    │
    ├── Server finds OTP document
    ├── Server checks OTP value matches
    ├── Server checks not expired
    ├── Server finds or creates User
    ├── Server deletes OTP document
    └── Server returns { token, user }
    │
    ▼
login(user, token) called
    ├── localStorage.setItem('token', token)
    ├── localStorage.setItem('user', JSON.stringify(user))
    └── setUser(user) → AuthContext updates
    │
    ▼
navigate('/home')
    │
    ▼
HomePage renders (ProtectedRoute allows through)
```

---

## Flow 2: Returning User — Normal Login

Same as Flow 1, but at step "Server finds or creates User", the user already exists so only `User.findOne({ identifier })` runs (no create).

---

## Flow 3: Create a Product

```
User is on ProductsPage (/products)
    │
    ▼
Clicks "Add Products" button
    │
    ▼
setShowAddModal(true) → AddProductModal opens
    │
    ▼
ProductForm renders with empty fields
    │
    ▼
User fills:
    - name: "Running Shoes Pro"
    - productType: "Footwear" (from dropdown)
    - quantityStock: 50
    - mrp: 2999
    - sellingPrice: 1999
    - brandName: "Nike"
    - exchangeEligibility: "Yes" (from dropdown)
    │
    ▼
User drags/selects images into upload zone
    ├── Images previewed in grid (file URL preview)
    └── Individual remove buttons per image
    │
    ▼
Clicks "Create Product"
    │
    ▼
FormData built:
    formData.append('name', 'Running Shoes Pro')
    formData.append('images', file1)
    formData.append('images', file2)
    ...
    │
    ▼
productsApi.create(formData) → POST /api/products
    ├── authenticate middleware verifies JWT
    ├── upload.array() uploads images to Cloudinary
    ├── validate() checks all required fields
    └── Handler saves product to MongoDB, returns { product }
    │
    ▼
addProduct(newProduct) → product prepended to list
setShowAddModal(false) → modal closes
showToast('Product added successfully')
    │
    ▼
New ProductCard appears at top of the grid
```

---

## Flow 4: Publish a Product

```
User sees a product card with "Unpublished" state
    │
    ▼
Clicks "Publish" button on ProductCard
    │
    ▼
togglePublish(product) called in useProducts
    │
    ▼
productsApi.togglePublish(product._id, true)
    → PATCH /api/products/:id/publish
    → body: { published: true }
    │
    ├── authenticate middleware verifies JWT
    ├── Handler fetches product, checks ownership
    └── findByIdAndUpdate → { $set: { published: true } }
    │
    ▼
updateProduct(updatedProduct) → local state updated
    │
    ▼
ProductCard re-renders with "Published" state
    │
    ▼
On HomePage "Published" tab, this product now appears
On HomePage "Unpublished" tab, it disappears
```

---

## Flow 5: Delete a Product

```
User clicks trash icon on a ProductCard
    │
    ▼
setSelectedProduct(product)
setShowDeleteModal(true) → DeleteProductModal opens
    │
    ▼
Modal shows: "Delete 'Running Shoes Pro'?"
    │
    ▼
User clicks red "Delete" button
    │
    ▼
productsApi.remove(product._id) → DELETE /api/products/:id
    ├── authenticate verifies JWT
    ├── Handler fetches product, checks ownership
    └── findByIdAndDelete → removes from MongoDB
    │
    ▼
removeProduct(product._id) → filters product from local state
setShowDeleteModal(false) → modal closes
    │
    ▼
ProductCard disappears from the grid
```

---

## Flow 6: Logout

```
User clicks avatar in header → dropdown opens
    │
    ▼
User clicks "Logout"
    │
    ▼
logout() called (from useAuth)
    ├── localStorage.removeItem('token')
    ├── localStorage.removeItem('user')
    └── setUser(null) → AuthContext updates
    │
    ▼
ProtectedRoute detects user === null → navigate('/login')
    │
    ▼
User sees LoginPage again
```
