# UI System

## Styling Approach

This project uses a **mixed styling strategy**:

| Method | Used In | Why |
|---|---|---|
| Tailwind CSS v4 utility classes | Some layout wrappers and simple elements | Quick spacing/layout |
| React inline `style` objects | Most components (ProductCard, Sidebar, etc.) | Precise control, avoids class name collision |
| `<style>` tags inside JSX | `ProductForm` | Component-scoped CSS for complex interactive styles (hover, focus, drag-over states) |
| Global CSS | `src/index.css`, `src/App.css` | Resets, font imports, body background |

**No CSS Modules are used.** Tailwind CSS v4 is integrated via the `@tailwindcss/vite` plugin — no separate `tailwind.config.js` is needed.

---

## Color Palette

### Brand Blues
| Token | Value | Used On |
|---|---|---|
| Deep navy | `#111652` | Page backgrounds, headers |
| Auth button | `#1e2a8a` | Auth page buttons |
| Primary blue | `#3b4cca` | Primary action buttons |
| Sidebar dark | `#1A1F27` | Sidebar background |
| Sidebar item | `#1D222B` | Sidebar nav items |

### Status Colors
| Token | Value | Used On |
|---|---|---|
| Success green | `#12B76A` | Toast icon, published badge |
| Error red | `#ef4444` | Danger button background |
| Error red (forms) | `#ff3b30` | Field validation error text |

### Neutral Palette
| Token | Value | Used On |
|---|---|---|
| Primary text | `#1a1f2e` | Headings |
| Secondary text | `#344054` | Labels, body text |
| Muted text | `#98A2B3` | Placeholders, secondary labels |
| Border | `#D0D5DD` | Input borders |
| Light border | `#EAECF0` | Card borders |
| Background | `#F5F6FA` | App main background |
| Card white | `#FFFFFF` | Product cards, modals |

---

## Typography

No custom font library is used. The project relies on the system font stack via Tailwind's defaults and CSS resets. Font sizes are set via Tailwind utility classes (`text-sm`, `text-xs`, etc.) or inline `fontSize` values.

---

## Reusable UI Components

### Button (`components/ui/Button.jsx`)

The single button component for all interactive actions. Variants and color mapping:

```
variant="primary"  → background: #3b4cca  (blue)
variant="auth"     → background: #1e2a8a  (dark blue)
variant="danger"   → background: #ef4444  (red)
disabled           → opacity: 0.6, cursor: not-allowed
```

### Modal (`components/ui/Modal.jsx`)

Standard dialog with three slots:
- **Header:** title string + `×` close button
- **Body:** scrollable (scrollbar hidden via `scrollbar-none` class or `-webkit-scrollbar: none`)
- **Footer:** optional, for action buttons

Keyboard accessible: `Escape` closes the modal. Backdrop click also closes it.

Size variants: `sm` (360px), `md` (420px), `lg` (500px).

### Toast (`components/ui/Toast.jsx`)

Fixed position at `bottom: 24px, left: 50%, transform: translateX(-50%)`. Shows for 3000ms by default. Only one toast is shown at a time.

### EmptyState (`components/ui/EmptyState.jsx`)

Used when product lists are empty. Accepts:
- `icon` — SVG element (e.g., `<GridEmptyIcon />`)
- `title` — main heading
- `description` — subtext
- `action` — optional `{ label, onClick }` for a CTA button

### FormField (`components/ui/FormField.jsx`)

Thin wrapper that standardizes input layout:
```jsx
<FormField label="Product Name" error={errors.name}>
  <input ... />
</FormField>
```
Renders: `<label>` → `children` → `<span style={{color: '#ff3b30'}}>{error}</span>` if error exists.

---

## Icon System

**File:** `components/layout/index.jsx`

All icons are inline SVG React components. They accept a `size` prop (number, default `20`) that sets both `width` and `height`. No external icon library is used — this avoids bundle bloat for a small set of icons.

Icons available: `HomeIcon`, `ProductsIcon`, `SearchIcon`, `XIcon`, `PlusIcon`, `TrashIcon`, `EditIcon`, `ChevronLeftIcon`, `ChevronRightIcon`, `ChevronDownIcon`, `CheckCircleIcon`, `UploadIcon`, `GridEmptyIcon`, `LogoutIcon`.

---

## AuthLayout Split

The auth pages use a 40/60 column split:
- **Left 40%:** `AuthLeftPanel` — gradient backgrounds, product logo, showcase product card, marketing tagline
- **Right 60%:** Form content + optional `bottomSlot` (e.g., "Already have an account? Log in")

This layout is purely CSS flex with no Tailwind — uses inline `style` objects.

---

## AppLayout Header

The header inside `AppLayout` has a subtle **gradient mesh background** created by stacking multiple CSS `radial-gradient()` layers in a single `background` property. This gives the top bar a soft colorful glow without using an image.

The header is `52px` tall, has a centered search input, and a right-side user avatar. Clicking the avatar toggles a dropdown with the user's name, identifier, and a logout button.
