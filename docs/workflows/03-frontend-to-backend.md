# Frontend to Backend Data Flow

## Layer-by-Layer Data Transformation

This document shows how data changes form as it moves from the UI to the database.

---

## Example: Creating a Product

### Layer 1 — React Component (ProductForm)

The user fills out inputs. `useForm` stores everything as strings (all HTML input values are strings):

```javascript
// useForm state after user input
values = {
  name: "Running Shoes Pro",
  productType: "Footwear",
  quantityStock: "50",        // string! input type=number still gives string
  mrp: "2999",
  sellingPrice: "1999",
  brandName: "Nike",
  exchangeEligibility: "Yes", // string from dropdown
  images: [File, File]        // browser File objects
}
```

---

### Layer 2 — API Function (client/src/api/products.js)

The form handler constructs `FormData`. Text fields are appended as strings, files are appended as `File` objects:

```javascript
const formData = new FormData()
formData.append('name', 'Running Shoes Pro')
formData.append('productType', 'Footwear')
formData.append('quantityStock', '50')    // still a string
formData.append('mrp', '2999')
formData.append('sellingPrice', '1999')
formData.append('brandName', 'Nike')
formData.append('exchangeEligibility', 'Yes')
formData.append('images', File{...})
formData.append('images', File{...})
```

---

### Layer 3 — HTTP Transport (multipart/form-data)

The browser serializes FormData as a multipart body:

```
Content-Type: multipart/form-data; boundary=----BoundaryXYZ

------BoundaryXYZ
Content-Disposition: form-data; name="name"

Running Shoes Pro
------BoundaryXYZ
Content-Disposition: form-data; name="quantityStock"

50
------BoundaryXYZ
Content-Disposition: form-data; name="images"; filename="shoe.jpg"
Content-Type: image/jpeg

[binary data...]
------BoundaryXYZ--
```

---

### Layer 4 — Multer Middleware (server/middleware/upload.js)

Multer parses the multipart body and:
1. Uploads binary file data to Cloudinary
2. Populates `req.body` with text fields (still strings)
3. Populates `req.files` with Cloudinary upload results

```javascript
req.body = {
  name: "Running Shoes Pro",
  productType: "Footwear",
  quantityStock: "50",           // still a string
  mrp: "2999",
  sellingPrice: "1999",
  brandName: "Nike",
  exchangeEligibility: "Yes"
}

req.files = [
  {
    fieldname: "images",
    path: "https://res.cloudinary.com/demo/image/upload/v1/products/abc.jpg",
    filename: "products/abc"
  }
]
```

---

### Layer 5 — Zod Validation (server/middleware/validate.js)

Zod's `createProductSchema` transforms the data:

```javascript
// INPUT (strings from FormData)
{ quantityStock: "50", mrp: "2999", sellingPrice: "1999", exchangeEligibility: "Yes" }

// OUTPUT (coerced types after Zod parsing)
{ quantityStock: 50, mrp: 2999, sellingPrice: 1999, exchangeEligibility: true }
//                 ^^ numbers! ^^                                          ^^^ boolean!
```

Zod's `z.coerce.number()` calls `Number()` on the string. Zod's `z.preprocess()` on `exchangeEligibility` maps `"Yes"` → `true`.

```javascript
req.body = {
  name: "Running Shoes Pro",
  productType: "Footwear",
  quantityStock: 50,           // number now
  mrp: 2999,                   // number now
  sellingPrice: 1999,          // number now
  brandName: "Nike",
  exchangeEligibility: true    // boolean now
}
```

---

### Layer 6 — Route Handler

The handler combines `req.body` (validated), `req.files` (Cloudinary URLs), and `req.user._id`:

```javascript
const imageUrls = req.files.map(f => f.path)

const product = new Product({
  name: "Running Shoes Pro",
  productType: "Footwear",
  quantityStock: 50,           // correct type
  mrp: 2999,                   // correct type
  sellingPrice: 1999,          // correct type
  brandName: "Nike",
  images: ["https://res.cloudinary.com/..."],
  exchangeEligibility: true,   // correct type
  published: false,            // default
  createdBy: ObjectId("64a1b...")
})
```

---

### Layer 7 — MongoDB Document

Mongoose validates against the schema and inserts:

```json
{
  "_id": ObjectId("64b2c..."),
  "name": "Running Shoes Pro",
  "productType": "Footwear",
  "quantityStock": 50,
  "mrp": 2999,
  "sellingPrice": 1999,
  "brandName": "Nike",
  "images": ["https://res.cloudinary.com/demo/image/upload/v1/products/abc.jpg"],
  "exchangeEligibility": true,
  "published": false,
  "createdBy": ObjectId("64a1b..."),
  "createdAt": ISODate("2024-01-15T10:30:00Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00Z"),
  "__v": 0
}
```

---

## Response Path (Database → UI)

```
MongoDB document
    │ Mongoose returns as plain JS object
    ▼
Route handler: res.status(201).json({ product })
    │ Express serializes to JSON
    ▼
HTTP Response body (JSON string)
    │ Axios parses JSON → response.data
    ▼
response.data.product = { _id, name, images, ... }
    │ passed to onAdd callback
    ▼
useProducts.addProduct(product)
    → setProducts(prev => [product, ...prev])
    │ React state update triggers re-render
    ▼
ProductCard renders with the new product data
```
