# 🩸 BloodLife - Emergency Blood Donor Platform

**BloodLife** is a full-stack, real-time emergency blood donation and donor matching platform. Built with a modern, modular React 19 frontend and a hardened Express/Node.js REST API with MongoDB.

---

## 🚀 Features

- **🔐 Secure Authentication & Role Management**
  - Cookie-based HTTP-only JWT authentication with cookie isolation.
  - Password hashing with `bcrypt` (salt rounds: 12).
  - Deactivation checks and role-based access control (`user`, `admin`).
- **🩺 Dedicated Health Check Endpoint**
  - `/api/health` endpoint returning real-time service status, system uptime, and MongoDB connection states (`connected`/`disconnected`).
- **🔍 Smart Blood Donor Search**
  - Filter donors by blood group (`A+`, `O-`, etc.), city, and real-time availability.
  - Compound indexing on MongoDB for high-performance spatial/attribute queries.
- **🚨 Emergency Blood Requests**
  - Create urgent requests with auto-expiration (48-hour lifecycle).
  - Priority sorting (`Critical` > `High` > `Medium` > `Low`).
- **🛡️ Security & Hardening**
  - **Helmet.js** for HTTP security headers.
  - **CORS Protection**: Restricted origins, explicit allowed methods and headers.
  - **Rate Limiting**: Request throttling (`express-rate-limit`) on `/api/*` endpoints.
  - **Sanitization & Payload Caps**: strict 10kb body payload limits to mitigate payload DOS.
- **📜 Structured Audit Logging**
  - Centralized logger ([logger.js](file:///d:/projects/bloodDonor/backend/src/utils/logger.js)) tracking key lifecycle actions (`USER_REGISTERED`, `USER_LOGGED_IN`, `USER_LOGGED_OUT`, `BLOOD_REQUEST_CREATED`, `BLOOD_REQUEST_UPDATED`).
- **⚠️ Comprehensive Global Error Handling**
  - **Backend**: Express global error middleware catching operational errors (`ApiError`), JSON syntax errors, Mongoose validation/cast errors, and process-level uncaught exceptions.
  - **Frontend**: React Error Boundary fallback UI ([ErrorBoundary.jsx](file:///d:/projects/bloodDonor/frontend/src/components/ErrorBoundary.jsx)), Axios error interceptors ([api.js](file:///d:/projects/bloodDonor/frontend/src/services/api.js)), and unhandled promise rejection listeners.

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JSON Web Token (`jsonwebtoken`) & `cookie-parser`
- **Security**: `helmet`, `cors`, `bcrypt`, `express-rate-limit`
- **Logging**: Morgan HTTP logger & custom structured Audit Logger

### Frontend
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Routing**: React Router DOM (v7) with active tab `NavLink` highlighting

---

## 📁 Directory Structure

```
bloodDonor/
├── .gitignore
├── README.md
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── nodemon.json
│   ├── package.json
│   ├── seeder.js             # Database seeder script
│   ├── server.js             # Application entry point & process listeners
│   └── src/
│       ├── api/
│       │   ├── auth/         # Auth controller, routes, validator
│       │   ├── donors/       # Donor controller, routes, validator
│       │   ├── health/       # Health check controller & routes
│       │   └── requests/     # Blood request controller, routes, validator
│       ├── config/
│       │   ├── db.js         # Mongoose connection setup
│       │   └── env.js        # Environment schema validation
│       ├── middleware/
│       │   ├── auth.middleware.js
│       │   ├── error.middleware.js
│       │   ├── notFound.middleware.js
│       │   └── rateLimiter.middleware.js
│       ├── models/
│       │   ├── BloodRequest.js
│       │   ├── DonorProfile.js
│       │   └── User.js
│       └── utils/
│           ├── ApiError.js
│           ├── ApiResponse.js
│           ├── asyncHandler.js
│           ├── generateToken.js
│           └── logger.js     # Audit & system logger
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx          # ErrorBoundary & global error listeners setup
        ├── components/
        │   ├── ErrorBoundary.jsx
        │   ├── Navbar.jsx    # Active tab NavLink navigation
        │   └── PrivateRoute.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── Dashboard.jsx
        │   ├── EmergencyRequests.jsx
        │   ├── Home.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   └── SearchDonors.jsx
        └── services/
            └── api.js        # Axios instance with response error interceptors
```

---

## 📡 API Reference

### Health Check
- `GET /api/health` — Returns status (`UP`), environment, system uptime, and DB state.

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new user (`name`, `email`, `password`).
- `POST /api/auth/login` — Login user (`email`, `password`) and set HTTP-only cookie.
- `POST /api/auth/logout` — Clear JWT cookie and log out.
- `GET /api/auth/profile` — Get authenticated user details.

### Donor Profiles (`/api/donors`)
- `GET /api/donors` — Search donors by `bloodGroup`, `city`, `isAvailable`, `page`, `limit`.
- `GET /api/donors/profile` — Get donor profile of logged-in user.
- `POST /api/donors/profile` — Create or update donor profile.

### Emergency Requests (`/api/requests`)
- `GET /api/requests` — List active emergency blood requests.
- `POST /api/requests` — Create emergency blood request (expires in 48 hrs).
- `GET /api/requests/my` — Get user's created requests.
- `PATCH /api/requests/:id/status` — Mark request as `Fulfilled` or `Expired`.

---

## ⚙️ Quick Start & Setup

### Prerequisites
- Node.js (`>=18.x`)
- MongoDB running locally on `mongodb://127.0.0.1:27017` (or via Docker Compose).

### 1. Environment Setup

Copy `.env.example` in `backend/`:
```bash
cp backend/.env.example backend/.env
```

Ensure `backend/.env` has:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bloodDonor
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=30d
CORS_ORIGIN=http://localhost:5173
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed     # (Optional) Seed sample donors & requests
npm run dev      # Starts backend server on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

### 4. Build for Production
```bash
# Verify Frontend Production Build
cd frontend
npm run build
```

---

## 🛡️ Security & Quality Measures

1. **Strict CORS Policy**: Requests strictly controlled via configured origins (`http://localhost:5173`) with `credentials: true`.
2. **Global Exception Handling**: Node process handles `uncaughtException` and `unhandledRejection` with clean logging and graceful shutdown.
3. **Audit Logged Events**: Key actions produce formatted terminal audit events for complete system visibility.
4. **React Error Boundary**: Guarantees app resiliency during unexpected component render crashes.

---

## 📝 License
Distributed under the ISC License.
