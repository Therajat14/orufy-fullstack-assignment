# Component Tree

## Full Component Hierarchy with Props and State

```mermaid
graph TD
    subgraph Root["Root (App.jsx)"]
        APP["App"]
    end

    subgraph Providers["Providers"]
        AUTHPROV["AuthProvider\nstate: user, login(), logout()"]
        BROWSER["BrowserRouter"]
    end

    subgraph Auth["Auth Pages (GuestRoute only)"]
        AUTHLAYOUT["AuthLayout\nprops: children, bottomSlot"]
        LEFTPANEL["AuthLeftPanel\n(decorative, no props)"]
        LOGINPAGE["LoginPage\nstate: useForm, useToast"]
        OTPPAGE["OTPPage\nstate: useForm, useToast, timer"]
        SIGNUPPAGE["SignupPage\nstate: useForm, useToast"]
    end

    subgraph App2["App Pages (ProtectedRoute only)"]
        APPLAYOUT2["AppLayout\nstate: dropdownOpen"]
        SIDEBAR2["Sidebar\nreads: useLocation()"]
        HEADER2["Header (inline in AppLayout)\nreads: useAuth()"]
        
        HOMEPAGE["HomePage\nstate: useProducts, activeTab\nshowEditModal, showDeleteModal\nselectedProduct, useToast"]
        PRODPAGE["ProductsPage\nstate: useProducts\nshowAddModal, showEditModal\nshowDeleteModal, selectedProduct, useToast"]
    end

    subgraph ProductComponents["Product Components"]
        PRODCARD["ProductCard\nprops: product, onEdit, onDelete, onTogglePublish\nstate: currentImageIndex"]
        ADDMODAL["AddProductModal\nprops: onAdd, onClose\nstate: loading, error"]
        EDITMODAL["EditProductModal\nprops: product, onUpdate, onClose\nstate: loading, error"]
        DELMODAL["DeleteProductModal\nprops: product, onConfirm, onClose\nstate: loading"]
        PRODFORM["ProductForm\nprops: values, errors, handleChange, setError\nstate: (via useForm in parent)"]
    end

    subgraph UI["Reusable UI Components"]
        BUTTON["Button\nprops: variant, disabled, fullWidth\nonClick, type, className, style"]
        MODAL["Modal\nprops: isOpen, title, size\nonClose, footer"]
        TOAST["Toast\nprops: message, duration, onClose"]
        EMPTY["EmptyState\nprops: icon, title, description, action"]
        FORMFIELD["FormField\nprops: label, error, children"]
    end

    APP --> AUTHPROV --> BROWSER
    BROWSER --> AUTHLAYOUT
    AUTHLAYOUT --> LEFTPANEL
    AUTHLAYOUT --> LOGINPAGE
    AUTHLAYOUT --> OTPPAGE
    AUTHLAYOUT --> SIGNUPPAGE

    BROWSER --> APPLAYOUT2
    APPLAYOUT2 --> SIDEBAR2
    APPLAYOUT2 --> HEADER2
    APPLAYOUT2 --> HOMEPAGE
    APPLAYOUT2 --> PRODPAGE

    HOMEPAGE --> PRODCARD
    HOMEPAGE --> EDITMODAL
    HOMEPAGE --> DELMODAL
    HOMEPAGE --> TOAST

    PRODPAGE --> PRODCARD
    PRODPAGE --> ADDMODAL
    PRODPAGE --> EDITMODAL
    PRODPAGE --> DELMODAL
    PRODPAGE --> TOAST

    ADDMODAL --> MODAL
    ADDMODAL --> PRODFORM
    EDITMODAL --> MODAL
    EDITMODAL --> PRODFORM
    DELMODAL --> MODAL
    DELMODAL --> BUTTON

    PRODFORM --> FORMFIELD
    PRODFORM --> BUTTON

    LOGINPAGE --> FORMFIELD
    LOGINPAGE --> BUTTON
    LOGINPAGE --> TOAST
```

---

## Data Ownership Map

| Component | Owns State | Receives via Props |
|---|---|---|
| `AuthProvider` | `user`, `login`, `logout` | — |
| `ProductsPage` | `products`, `loading`, `showModals`, `selectedProduct` | — |
| `HomePage` | `products`, `loading`, `activeTab`, `showModals`, `selectedProduct` | — |
| `ProductCard` | `currentImageIndex` | `product`, `onEdit`, `onDelete`, `onTogglePublish` |
| `AddProductModal` | `loading`, `error` | `onAdd`, `onClose` |
| `EditProductModal` | `loading`, `error` | `product`, `onUpdate`, `onClose` |
| `DeleteProductModal` | `loading` | `product`, `onConfirm`, `onClose` |
| `ProductForm` | (all via useForm in parent) | `values`, `errors`, `handleChange`, `setError` |
| `AppLayout` | `dropdownOpen` | — |
| `Sidebar` | — | (reads `useLocation` internally) |

---

## Hook Dependency Map

```
useAuth()
  → reads AuthContext
  → used by: ProtectedRoute, GuestRoute, AppLayout header, Axios interceptor

useProducts()
  → calls productsApi.getAll()
  → returns: { products, loading, addProduct, updateProduct, removeProduct, togglePublish, deleteProduct }
  → used by: HomePage, ProductsPage

useForm(initialValues)
  → returns: { values, errors, handleChange, setError, reset, setValues }
  → used by: ProductForm, LoginPage, OTPPage, SignupPage

useToast()
  → returns: { toast, showToast, clearToast }
  → used by: HomePage, ProductsPage, LoginPage, OTPPage

useLocation() [React Router]
  → used by: Sidebar (active route highlighting)

useNavigate() [React Router]
  → used by: LoginPage, OTPPage, SignupPage, AppLayout (logout)

useSearchParams() [React Router]
  → used by: HomePage, ProductsPage (search query)
```
