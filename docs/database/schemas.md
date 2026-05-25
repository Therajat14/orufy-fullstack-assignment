# Database Schemas

All schemas are defined using Mongoose and stored in `server/models/`. MongoDB is hosted on MongoDB Atlas.

---

## User Schema

**File:** `server/models/User.js`

**Collection name:** `users` (Mongoose pluralizes automatically)

```javascript
const userSchema = new Schema(
  {
    identifier: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      default: 'User'
    }
  },
  { timestamps: true }
)
```

### Field Descriptions

| Field | Type | Constraints | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto-generated | MongoDB document ID |
| `identifier` | String | required, unique, trim | Email or phone number — the login credential |
| `name` | String | default: 'User' | Display name — auto-extracted from email (before `@`) or set to 'User' |
| `createdAt` | Date | auto (timestamps) | When the account was first created |
| `updatedAt` | Date | auto (timestamps) | Last modification time |

### Example Document
```json
{
  "_id": "64a1b2c3d4e5f6789abc0001",
  "identifier": "rajat@example.com",
  "name": "rajat",
  "createdAt": "2024-01-10T08:00:00.000Z",
  "updatedAt": "2024-01-10T08:00:00.000Z",
  "__v": 0
}
```

---

## Product Schema

**File:** `server/models/Product.js`

**Collection name:** `products`

```javascript
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    productType: {
      type: String,
      required: true
    },
    quantityStock: {
      type: Number,
      required: true,
      min: 0
    },
    mrp: {
      type: Number,
      required: true,
      min: 0
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0
    },
    brandName: {
      type: String,
      required: true,
      trim: true
    },
    images: {
      type: [String],
      default: []
    },
    exchangeEligibility: {
      type: Boolean,
      default: true
    },
    published: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
)
```

### Field Descriptions

| Field | Type | Constraints | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto-generated | MongoDB document ID |
| `name` | String | required, trim | Product display name |
| `productType` | String | required | Category (Foods / Electronics / Clothes / Footwear / Beauty / Sports / Other) |
| `quantityStock` | Number | required, min 0 | Current inventory count |
| `mrp` | Number | required, min 0 | Maximum Retail Price (shown struck-through in UI) |
| `sellingPrice` | Number | required, min 0 | Actual selling price |
| `brandName` | String | required, trim | Brand/manufacturer name |
| `images` | [String] | default: [] | Array of Cloudinary HTTPS URLs |
| `exchangeEligibility` | Boolean | default: true | Whether the product can be exchanged |
| `published` | Boolean | default: false | Whether the product is visible in "Published" tab |
| `createdBy` | ObjectId | ref: 'User' | FK reference to the owning User document |
| `createdAt` | Date | auto | Creation time |
| `updatedAt` | Date | auto | Last update time |

### Example Document
```json
{
  "_id": "64b2c3d4e5f6789abc0002",
  "name": "Running Shoes Pro",
  "productType": "Footwear",
  "quantityStock": 50,
  "mrp": 2999,
  "sellingPrice": 1999,
  "brandName": "Nike",
  "images": [
    "https://res.cloudinary.com/demo/image/upload/v1234/products/shoe1.jpg",
    "https://res.cloudinary.com/demo/image/upload/v1234/products/shoe2.jpg"
  ],
  "exchangeEligibility": true,
  "published": false,
  "createdBy": "64a1b2c3d4e5f6789abc0001",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "__v": 0
}
```

---

## OTP Schema

**File:** `server/models/OTP.js`

**Collection name:** `otps`

```javascript
const otpSchema = new Schema({
  identifier: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
})

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

### Field Descriptions

| Field | Type | Constraints | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto-generated | MongoDB document ID |
| `identifier` | String | required | Email or phone number this OTP was sent to |
| `otp` | String | required | The 6-digit OTP code |
| `expiresAt` | Date | required | Timestamp after which the OTP is invalid (5 min from creation) |

### TTL Index
The `{ expiresAt: 1 }, { expireAfterSeconds: 0 }` index tells MongoDB to delete the document when the current time passes `expiresAt`. This runs automatically as a background job every ~60 seconds — no application code needed to clean up expired OTPs.

### Example Document
```json
{
  "_id": "64c3d4e5f6789abc0003",
  "identifier": "rajat@example.com",
  "otp": "483920",
  "expiresAt": "2024-01-15T10:35:00.000Z"
}
```
This document auto-deletes at 10:35 AM.
