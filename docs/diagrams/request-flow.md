# Request Flow Diagrams

## Middleware Execution Chain

```mermaid
flowchart LR
    REQ["HTTP Request"] --> CORS["CORS\nmiddleware"]
    CORS --> JSON["express.json()\nexpress.urlencoded()"]
    JSON --> ROUTER["Router\nmatching"]
    
    ROUTER --> AUTH_ROUTE["/api/auth"]
    ROUTER --> PROD_ROUTE["/api/products"]
    ROUTER --> HEALTH["/api/health"]
    
    AUTH_ROUTE --> VALIDATE_AUTH["validate(schema)"]
    VALIDATE_AUTH --> AUTH_HANDLER["Auth handler\n(sendOtp / verifyOtp)"]
    
    PROD_ROUTE --> AUTHENTICATE["authenticate\n(JWT verify)"]
    AUTHENTICATE --> UPLOAD["upload.array()\n(Multer + Cloudinary)"]
    UPLOAD --> VALIDATE_PROD["validate(schema)"]
    VALIDATE_PROD --> PROD_HANDLER["Product handler\n(CRUD)"]
    
    AUTH_HANDLER --> DB["MongoDB\nAtlas"]
    PROD_HANDLER --> DB
    UPLOAD --> CDN["Cloudinary"]
    
    DB --> RES["HTTP Response\nJSON"]
    CDN --> RES
```

---

## GET /api/products — Data Flow

```mermaid
flowchart TD
    A["GET /api/products\nAuthorization: Bearer token"] --> B["authenticate middleware"]
    B --> C{"jwt.verify(token)"}
    C -->|"invalid/expired"| D["401 Unauthorized"]
    C -->|"valid"| E["User.findById(decoded.id)"]
    E --> F{"user exists?"}
    F -->|"no"| G["401 User not found"]
    F -->|"yes"| H["req.user = user\nnext()"]
    H --> I["Product.find({ createdBy: user._id })\n.sort({ createdAt: -1 })"]
    I --> J["200 { products: [...] }"]
    J --> K["Axios receives response"]
    K --> L["setProducts(data.products)\nsetLoading(false)"]
    L --> M["ProductCard[] renders"]
```

---

## POST /api/products — Data Flow

```mermaid
flowchart TD
    A["POST /api/products\nmultipart/form-data\n+ Bearer token"] --> B["authenticate\nverify JWT → req.user"]
    B --> C["upload.array('images', 10)"]
    C --> D{"Files valid?"}
    D -->|"wrong type/size"| E["400 Error"]
    D -->|"valid"| F["Stream to Cloudinary\nreq.files = [{path: URL}]"]
    F --> G["validate(createProductSchema)"]
    G --> H{"Zod safeParse"}
    H -->|"invalid"| I["422 Validation errors"]
    H -->|"valid"| J["req.body = coerced data\n(strings → numbers/booleans)"]
    J --> K["Route handler\nimageUrls = req.files.map(f=>f.path)"]
    K --> L["new Product({...}).save()"]
    L --> M["201 { product }"]
    M --> N["addProduct(product)\nState update"]
    N --> O["ProductCard appears"]
```

---

## OTP Authentication — State Machine

```mermaid
stateDiagram-v2
    [*] --> LoginPage: User opens app

    LoginPage --> SendOTP: User enters identifier
    SendOTP --> OTPSent: Server generates & saves OTP
    OTPSent --> OTPPage: navigate('/verify-otp')
    
    OTPPage --> VerifyOTP: User enters 6 digits
    
    VerifyOTP --> InvalidOTP: OTP wrong or not found
    InvalidOTP --> OTPPage: Show error
    
    VerifyOTP --> ExpiredOTP: OTP expired (>5min)
    ExpiredOTP --> OTPPage: Show error + resend
    
    VerifyOTP --> Authenticated: OTP valid
    Authenticated --> TokenStored: localStorage.setItem(token, user)
    TokenStored --> HomePage: navigate('/home')
    
    HomePage --> [*]: User uses app
    
    HomePage --> Logout: User clicks logout
    Logout --> LocalStorageCleared: removeItem(token, user)
    LocalStorageCleared --> LoginPage: navigate('/login')
```

---

## Product State Transitions

```mermaid
stateDiagram-v2
    [*] --> Created: POST /api/products
    Created --> Unpublished: published = false (default)
    
    Unpublished --> Published: PATCH /publish {published: true}
    Published --> Unpublished: PATCH /publish {published: false}
    
    Unpublished --> Updated: PUT /api/products/:id
    Published --> Updated: PUT /api/products/:id
    Updated --> Unpublished: if still unpublished
    Updated --> Published: if still published
    
    Unpublished --> [*]: DELETE /api/products/:id
    Published --> [*]: DELETE /api/products/:id
```
