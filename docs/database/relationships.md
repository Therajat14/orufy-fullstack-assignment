# Database Relationships

## Entity Relationship Overview

```
┌──────────┐         ┌───────────┐         ┌──────────┐
│   User   │         │  Product  │         │   OTP    │
├──────────┤         ├───────────┤         ├──────────┤
│ _id      │◄────────│ createdBy │         │identifier│
│identifier│         │ name      │         │ otp      │
│ name     │         │ ...       │         │expiresAt │
└──────────┘         └───────────┘         └──────────┘
  1 user                N products           Temporary
  owns many             belongs to           (auto-deleted)
  products              1 user
```

---

## User → Product (One-to-Many)

**Type:** One-to-Many (1:N)

**Implementation:** Reference (not embedded)

Each `Product` document stores a `createdBy` field containing the `ObjectId` of the owning `User`. A single user can own many products, but each product belongs to exactly one user.

```javascript
// Product schema
createdBy: {
  type: Schema.Types.ObjectId,
  ref: 'User'           // Mongoose virtual populate target
}
```

### How it's used in queries

**Fetch user's products:**
```javascript
Product.find({ createdBy: req.user._id })
```
No JOIN needed — MongoDB queries directly on the `createdBy` field.

**Ownership check:**
```javascript
product.createdBy.equals(req.user._id)
```
`.equals()` compares two ObjectIds correctly (they are objects, not strings).

### Why reference instead of embed?

If products were embedded inside the User document (as a `products: [...]` array), the document would grow unboundedly. MongoDB has a 16MB document size limit. Storing products as separate documents with a reference is the standard approach for 1:N where N can be large.

---

## User ↔ OTP (Loose Reference by Identifier String)

**Type:** Not a formal Mongoose relationship (no `ref`)

The `OTP` model does not store a MongoDB `ObjectId` reference to `User`. Instead, it stores the `identifier` string (email or phone). This is because:

- The OTP is created before the user may exist (first-time login auto-creates the user)
- The `identifier` is the natural key shared between both collections
- There's no need to populate the relationship — OTP is consumed and deleted immediately

---

## Why No Embedded Products?

MongoDB supports two patterns for related data:
1. **Embedded** — store products as an array inside the User document
2. **Referenced** — store products as separate documents with a foreign key

This project uses **referenced** because:
- Products can have many fields and multiple image URLs — they're substantive documents
- Users could create many products — unbounded array growth
- Products can be queried, filtered, and sorted independently
- The ownership check (fetch → check → mutate) is clean with separate documents

---

## Data Deletion Behavior

| Action | What happens |
|---|---|
| Delete product | Product document deleted from `products` collection; Cloudinary images are NOT deleted |
| Logout | No DB operation — only clears client localStorage |
| OTP expires | MongoDB TTL index auto-deletes the OTP document |
| OTP verified | OTP document explicitly deleted (`OTP.deleteOne()`) by the verify handler |

There is no cascading delete — if a user is deleted (no delete user route exists), their products would remain in the database with an orphaned `createdBy` reference.
