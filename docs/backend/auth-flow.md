# Auth Flow

## Authentication Strategy

Productr uses **OTP-based passwordless authentication**. There are no passwords stored anywhere. Users authenticate by:
1. Providing their email or phone number
2. Receiving a 6-digit OTP (for demo purposes, OTP is returned in the API response)
3. Submitting the OTP to receive a JWT

---

## Step 1: Send OTP

**Route:** `POST /api/auth/send-otp`

**File:** `server/routes/auth.js`

```
Client sends { identifier: "user@email.com" }
    │
    ▼
validate(sendOtpSchema)
  → checks: is it a valid email OR a 7-15 digit phone number?
  → 422 if invalid
    │
    ▼
Generate OTP:
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  // Produces a 6-digit string like "483920"
    │
    ▼
Set expiry:
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000)  // 5 minutes
    │
    ▼
Upsert OTP document:
  OTP.findOneAndUpdate(
    { identifier },
    { otp, expiresAt },
    { upsert: true, new: true }
  )
  // If an OTP was previously sent for this identifier, it's overwritten
    │
    ▼
Respond 200:
  { message: "OTP sent successfully", otp: "483920" }
  // otp included for demo purposes only
```

---

## Step 2: Verify OTP

**Route:** `POST /api/auth/verify-otp`

**File:** `server/routes/auth.js`

```
Client sends { identifier: "user@email.com", otp: "483920" }
    │
    ▼
validate(verifyOtpSchema)
  → checks: identifier valid? otp is exactly 6 digits?
    │
    ▼
Look up OTP document:
  OTP.findOne({ identifier })
    │
    ├── Not found → 400 "Invalid OTP"  (never sent or already deleted by TTL)
    │
    ▼
Check OTP value:
  if (otpDoc.otp !== otp)
    → 400 "Invalid OTP"
    │
    ▼
Check expiry:
  if (otpDoc.expiresAt < new Date())
    → 400 "OTP expired"
    │
    ▼
Auto-create or find User:
  User.findOneOrCreate({ identifier })
  // If user doesn't exist:
  //   extracts name from email (part before @) or generates random name
  //   creates new User document
    │
    ▼
Delete OTP document (consumed):
  OTP.deleteOne({ identifier })
    │
    ▼
Issue JWT:
  jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })
    │
    ▼
Respond 200:
  {
    message: "Logged in successfully",
    token: "eyJhbGci...",
    user: { _id, name, identifier }
  }
```

---

## Step 3: Subsequent Authenticated Requests

After login, the client stores the JWT in `localStorage`. Every request to `/api/products` automatically includes:

```
Authorization: Bearer eyJhbGci...
```

The `authenticate` middleware:
```
Extract Bearer token from header
    │
    ▼
jwt.verify(token, JWT_SECRET)
  → throws if expired or tampered
    │
    ▼
User.findById(decoded.id).select('-__v')
  → attaches to req.user
    │
    ▼
Route handler runs with req.user available
```

---

## OTP TTL Auto-Deletion

The `OTP` model has a MongoDB TTL index on `expiresAt`:

```javascript
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

MongoDB's TTL mechanism runs a background job every 60 seconds that deletes any OTP document where `expiresAt` has passed. This means:
- Expired OTPs are automatically cleaned up
- No manual cleanup code is needed
- There is a ~60 second delay between expiry and actual deletion, but the code also manually checks `expiresAt` during verification, so this doesn't create a security hole

---

## Security Notes

| Concern | How it's handled |
|---|---|
| OTP brute force | OTPs expire in 5 minutes; each new sendOtp overwrites the previous one |
| Token forgery | JWT signed with `JWT_SECRET` (HS256); tampered tokens fail `jwt.verify` |
| Token expiry | JWT expires in 7 days; client gets 401, localStorage cleared, redirected to login |
| User enumeration | No distinction in error response between "OTP not found" and "OTP wrong" (both say "Invalid OTP") |
| OTP reuse | OTP document deleted after successful verification (one-time use) |
| Password storage | No passwords — nothing to leak from DB |

---

## JWT Payload

```javascript
{
  id: "64a1b2c3d4e5f6789abc",  // user._id (MongoDB ObjectId)
  iat: 1705312800,              // issued at (Unix timestamp)
  exp: 1705917600               // expires at (iat + 7 days)
}
```

The `id` field is used by `authenticate` middleware to look up the user on every request.
