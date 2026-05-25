# Productr — Product Management Dashboard

**Live Demo:** [https://orufy-fullstack-assignment-five.vercel.app](https://orufy-fullstack-assignment-five.vercel.app)  
**Backend API:** [https://orufy-fullstack-assignment-vggt.onrender.com](https://orufy-fullstack-assignment-vggt.onrender.com)

A full-stack MERN application for managing and publishing products. Built with React, Node.js, Express, MongoDB, and Cloudinary for image uploads.

---

## Tech Stack

| Layer      | Technology                                       |
| ---------- | ------------------------------------------------ |
| Frontend   | React 18, Vite, Tailwind CSS v4, React Router v6 |
| Backend    | Node.js, Express 5, MongoDB (Mongoose), JWT      |
| Storage    | Cloudinary (product images)                      |
| Auth       | OTP-based (passwordless), JWT                    |
| Validation | Zod (server-side)                                |

---

## Project Structure

```
orufy-fullstack-assignment/
├── client/               # React frontend (Vite)
│   ├── src/
│   │   ├── api/          # Axios API calls
│   │   ├── components/   # Reusable UI components
│   │   ├── constants/    # Route constants
│   │   ├── context/      # Auth context
│   │   ├── hooks/        # Custom React hooks
│   │   ├── layouts/      # Page layouts
│   │   └── pages/        # Route pages
│   ├── .env.example
│   └── vercel.json       # SPA rewrite rules for Vercel
│
└── server/               # Express backend
    ├── middleware/        # Auth, upload, Zod validation
    ├── models/            # Mongoose schemas
    ├── routes/            # API routes
    ├── schemas/           # Zod validation schemas
    └── .env.example
```

---

## Prerequisites

- Node.js v18+
- npm v9+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Therajat14/orufy-fullstack-assignment
cd orufy-fullstack-assignment
```

### 2. Set up the backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env` with your values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

### 3. Set up the frontend

```bash
cd ../client
npm install
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Running Locally

Open **two terminals**:

**Terminal 1 — Backend**

```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 — Frontend**

```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

---

## Deployment

### Frontend — Vercel

1. Connect your GitHub repo to Vercel
2. Set **Root Directory** to `client`
3. Add environment variable: `VITE_API_URL=https://orufy-fullstack-assignment-vggt.onrender.com/api`
4. Deploy — `vercel.json` handles SPA routing automatically

### Backend — Render

1. Connect your GitHub repo to Render
2. Set **Root Directory** to `server`
3. Set start command to `npm start`
4. Add all variables from `server/.env.example`
5. Set `CLIENT_URL` to `https://orufy-fullstack-assignment-five.vercel.app`

---

## Available Scripts

### Server (`/server`)

| Command       | Description                      |
| ------------- | -------------------------------- |
| `npm run dev` | Start with nodemon (auto-reload) |

### Client (`/client`)

| Command       | Description           |
| ------------- | --------------------- |
| `npm run dev` | Start Vite dev server |

---

## License

MIT
