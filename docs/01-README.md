# Productr — Project Documentation

**Productr** is a full-stack MERN product management dashboard that lets authenticated users create, edit, publish, and delete products with image uploads.

- **Live Frontend:** https://orufy-fullstack-assignment-five.vercel.app
- **Live Backend API:** https://orufy-fullstack-assignment-vggt.onrender.com

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS v4, React Router 7 |
| Backend | Node.js, Express 5, MongoDB, Mongoose 9 |
| Auth | OTP-based (passwordless), JWT (7-day expiry) |
| Image Storage | Cloudinary |
| Validation | Zod 4 (server-side) |
| Deployment | Vercel (frontend), Render (backend) |

---

## Recommended Reading Order

Read the files in this exact order to understand the full project from top to bottom.

### Step 1 — Big Picture
- **01** → [01-README.md](01-README.md) — You are here. Start here.
- **02** → [02-architecture.md](02-architecture.md) — High-level system design

### Step 2 — Frontend
- **03** → [frontend/01-frontend-overview.md](frontend/01-frontend-overview.md) — Entry points, folder roles, key patterns
- **04** → [frontend/02-routing-flow.md](frontend/02-routing-flow.md) — React Router 7 route tree and guards
- **05** → [frontend/03-component-structure.md](frontend/03-component-structure.md) — Every component, its purpose and props
- **06** → [frontend/04-state-management.md](frontend/04-state-management.md) — AuthContext, useProducts, and local state
- **07** → [frontend/05-api-integration.md](frontend/05-api-integration.md) — Axios setup, interceptors, API functions
- **08** → [frontend/06-rendering-flow.md](frontend/06-rendering-flow.md) — Component lifecycle and re-render triggers
- **09** → [frontend/07-ui-system.md](frontend/07-ui-system.md) — Design tokens, reusable UI components, styling approach

### Step 3 — Backend
- **10** → [backend/01-backend-overview.md](backend/01-backend-overview.md) — Express app, middleware order, route mounting
- **11** → [backend/02-server-flow.md](backend/02-server-flow.md) — Request lifecycle from HTTP to response
- **12** → [backend/03-api-structure.md](backend/03-api-structure.md) — All endpoints with method, path, auth, body, response
- **13** → [backend/04-middleware.md](backend/04-middleware.md) — Auth, upload, and validation middleware deep dive
- **14** → [backend/05-auth-flow.md](backend/05-auth-flow.md) — OTP generation, verification, and JWT issuance
- **15** → [backend/06-validation.md](backend/06-validation.md) — Zod schemas and the validate middleware
- **16** → [backend/07-database-flow.md](backend/07-database-flow.md) — Mongoose operations per route
- **17** → [backend/08-error-handling.md](backend/08-error-handling.md) — Error response format and global handler

### Step 4 — Database
- **18** → [database/01-schemas.md](database/01-schemas.md) — User, Product, OTP model definitions
- **19** → [database/02-relationships.md](database/02-relationships.md) — How models reference each other
- **20** → [database/03-query-flow.md](database/03-query-flow.md) — What queries run per API call

### Step 5 — Workflows (Connect Everything)
- **21** → [workflows/01-user-flow.md](workflows/01-user-flow.md) — Step-by-step user journeys
- **22** → [workflows/02-request-lifecycle.md](workflows/02-request-lifecycle.md) — Full HTTP round-trip annotated
- **23** → [workflows/03-frontend-to-backend.md](workflows/03-frontend-to-backend.md) — Data transformation UI → DB
- **24** → [workflows/04-crud-workflow.md](workflows/04-crud-workflow.md) — Product create/read/update/delete flow

### Step 6 — Deployment
- **25** → [deployment/01-environment.md](deployment/01-environment.md) — All env vars for client and server
- **26** → [deployment/02-deployment-flow.md](deployment/02-deployment-flow.md) — How the app is deployed
- **27** → [deployment/03-hosting.md](deployment/03-hosting.md) — Vercel and Render configuration

### Step 7 — Diagrams (Visual Reference)
- **28** → [diagrams/01-architecture-diagram.md](diagrams/01-architecture-diagram.md) — Mermaid system diagram
- **29** → [diagrams/02-request-flow.md](diagrams/02-request-flow.md) — Mermaid sequence diagrams
- **30** → [diagrams/03-component-tree.md](diagrams/03-component-tree.md) — Mermaid component hierarchy

### Step 8 — Interview Prep (Final Review)
- **31** → [interview/01-project-explanation.md](interview/01-project-explanation.md) — Confident 5-minute pitch
- **32** → [interview/02-technical-decisions.md](interview/02-technical-decisions.md) — Why each tech was chosen
- **33** → [interview/03-challenges-and-solutions.md](interview/03-challenges-and-solutions.md) — Real problems solved
- **34** → [interview/04-possible-questions.md](interview/04-possible-questions.md) — Q&A based on this codebase

---

## Quick Start (Local Dev)

**Backend:**
```bash
cd server
cp .env.example .env   # fill in your values
npm install
npm run dev            # starts on PORT 5000
```

**Frontend:**
```bash
cd client
cp .env.example .env   # set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev            # starts on http://localhost:5173
```
