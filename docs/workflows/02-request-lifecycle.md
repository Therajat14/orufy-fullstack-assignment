# Request Lifecycle

## Complete Round-Trip: Create Product

This document traces the absolute complete lifecycle of a single HTTP request — from user click to screen update.

---

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BROWSER (React)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

① User clicks "Create Product" in AddProductModal

② React event handler fires:
   - setLoading(true) → button shows spinner, disabled
   - FormData built from useForm values + File objects

③ Axios request prepared:
   - method: POST
   - url: http://localhost:5000/api/products (from VITE_API_URL)
   - data: FormData object
   - Request interceptor adds: Authorization: Bearer eyJhbGci...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NETWORK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

④ HTTP request sent:
   POST /api/products HTTP/1.1
   Host: localhost:5000
   Authorization: Bearer eyJhbGci...
   Content-Type: multipart/form-data; boundary=----FormBoundaryXYZ
   
   ------FormBoundaryXYZ
   Content-Disposition: form-data; name="name"
   Running Shoes Pro
   ------FormBoundaryXYZ
   Content-Disposition: form-data; name="images"; filename="shoe.jpg"
   Content-Type: image/jpeg
   [binary file data]
   ------FormBoundaryXYZ--

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SERVER (Express)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⑤ Node.js HTTP server receives connection

⑥ CORS middleware:
   - Reads Origin: http://localhost:5173
   - Matches CLIENT_URL → allowed
   - Sets Access-Control-Allow-Origin: http://localhost:5173

⑦ express.json() → skips (not application/json)
   express.urlencoded() → skips (not URL-encoded)

⑧ Router matches: POST /api/products
   Middleware chain starts: [authenticate, upload, validate, handler]

⑨ authenticate middleware:
   - Extracts "eyJhbGci..." from header
   - jwt.verify(token, JWT_SECRET) → { id: "64a1b..." }
   - User.findById("64a1b...").select('-__v')
     [MongoDB query 1: find user]
   - req.user = user document
   - next()

⑩ upload.array('images', 10):
   - Parses multipart body
   - Finds file: shoe.jpg, mimetype: image/jpeg, size: 240KB
   - File filter passes (image/*)
   - Streams file to Cloudinary via multer-storage-cloudinary
     [External API call: POST to Cloudinary upload endpoint]
   - Cloudinary returns: { secure_url: "https://res.cloudinary.com/..." }
   - req.files = [{ path: "https://res.cloudinary.com/...", ... }]
   - req.body = { name: "Running Shoes Pro", productType: "Footwear", ... } (text fields)
   - next()

⑪ validate(createProductSchema):
   - Zod safeParse(req.body)
   - Coerces: "50" → 50 (quantityStock), "2999" → 2999 (mrp), etc.
   - Validates enum: "Footwear" ∈ allowed values ✓
   - Validates: "Yes" → true (exchangeEligibility preprocessing)
   - All pass → req.body = coerced data
   - next()

⑫ Route handler (createProduct):
   - imageUrls = req.files.map(f => f.path) → ["https://res.cloudinary.com/..."]
   - new Product({
       name: "Running Shoes Pro",
       productType: "Footwear",
       quantityStock: 50,
       mrp: 2999,
       sellingPrice: 1999,
       brandName: "Nike",
       images: ["https://res.cloudinary.com/..."],
       exchangeEligibility: true,
       published: false,
       createdBy: ObjectId("64a1b...")
     })
   - product.save()
     [MongoDB query 2: insert document]
   - res.status(201).json({ product: savedProduct })

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NETWORK (response)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⑬ HTTP response:
   HTTP/1.1 201 Created
   Content-Type: application/json
   
   { "product": { "_id": "64b2c...", "name": "Running Shoes Pro", ... } }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BROWSER (React)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⑭ Axios response interceptor:
   - Status is 201 (not 401) → pass through
   - Returns response object

⑮ try/catch in AddProductModal:
   - response.data.product extracted
   - onAdd(newProduct) called → useProducts.addProduct()
     [React state update: products = [newProduct, ...existing]]
   - setLoading(false) → button re-enabled
   - setShowAddModal(false) → modal unmounts
   - showToast('Product added successfully')

⑯ React re-renders:
   - ProductsPage re-renders with updated products array
   - New ProductCard renders for "Running Shoes Pro"
   - Toast component renders at bottom center
   - After 3000ms: Toast unmounts

Total DB queries: 2 (User.findById + Product.save)
Total external API calls: 1 (Cloudinary upload)
Total round-trip time: ~500ms-2s (depending on image size and Render cold start)
```
