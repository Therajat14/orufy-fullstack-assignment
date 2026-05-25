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

## Documentation Map

### Architecture
- [Architecture Overview](architecture.md) — High-level system design

### Frontend
- [Frontend Overview](frontend/frontend-overview.md) — Entry points, folder roles, key patterns
- [Component Structure](frontend/component-structure.md) — Every component, its purpose and props
- [Routing Flow](frontend/routing-flow.md) — React Router 7 route tree and guards
- [State Management](frontend/state-management.md) — AuthContext, useProducts, and local state
- [API Integration](frontend/api-integration.md) — Axios setup, interceptors, API functions
- [UI System](frontend/ui-system.md) — Design tokens, reusable UI components, styling approach
- [Rendering Flow](frontend/rendering-flow.md) — Component lifecycle and re-render triggers

### Backend
- [Backend Overview](backend/backend-overview.md) — Express app, middleware order, route mounting
- [Server Flow](backend/server-flow.md) — Request lifecycle from HTTP to response
- [API Structure](backend/api-structure.md) — All endpoints with method, path, auth, body, response
- [Middleware](backend/middleware.md) — Auth, upload, and validation middleware deep dive
- [Database Flow](backend/database-flow.md) — Mongoose operations per route
- [Auth Flow](backend/auth-flow.md) — OTP generation, verification, and JWT issuance
- [Validation](backend/validation.md) — Zod schemas and the validate middleware
- [Error Handling](backend/error-handling.md) — Error response format and global handler

### Database
- [Schemas](database/schemas.md) — User, Product, OTP model definitions
- [Relationships](database/relationships.md) — How models reference each other
- [Query Flow](database/query-flow.md) — What queries run per API call

### Workflows
- [User Flow](workflows/user-flow.md) — Step-by-step user journeys
- [Request Lifecycle](workflows/request-lifecycle.md) — Full HTTP round-trip
- [Frontend to Backend](workflows/frontend-to-backend.md) — Data flow from UI action to DB
- [CRUD Workflow](workflows/crud-workflow.md) — Product create/read/update/delete flow

### Deployment
- [Environment Variables](deployment/environment.md) — All env vars for client and server
- [Deployment Flow](deployment/deployment-flow.md) — How the app is deployed
- [Hosting](deployment/hosting.md) — Vercel and Render configuration

### Interview Preparation
- [Project Explanation](interview/project-explanation.md) — Confident 5-minute pitch
- [Possible Questions](interview/possible-questions.md) — Q&A based on this codebase
- [Technical Decisions](interview/technical-decisions.md) — Why each tech was chosen
- [Challenges and Solutions](interview/challenges-and-solutions.md) — Real problems solved

### Diagrams
- [Architecture Diagram](diagrams/architecture-diagram.md) — Mermaid system diagram
- [Request Flow](diagrams/request-flow.md) — Mermaid sequence diagrams
- [Component Tree](diagrams/component-tree.md) — Mermaid component hierarchy

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
