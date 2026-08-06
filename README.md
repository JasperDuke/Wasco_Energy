# Wasco Energy — Vendor Qualification Portal

A production-quality procurement portal for Wasco Energy that enables vendor registration, dynamic onboarding forms, and integration with the Atenxion AI platform.

## Project Structure

```
Wasco/
├── backend/          # Express + MongoDB API
└── frontend/         # Next.js 15 + MUI web application
```

## Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- MUI (Material UI)
- React Hook Form
- Axios
- Zustand

### Backend
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT (HttpOnly cookies)
- Multer (prepared for file uploads)

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Getting Started

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run seed      # Creates admin, staff users and default form
npm run dev       # Starts on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev       # Starts on http://localhost:3000
```

## Default Accounts

| Role   | Email                | Password   |
|--------|----------------------|------------|
| Admin  | admin@wasco.com      | Admin@123  |
| Staff  | staff@wasco.com      | Staff@123  |
| Vendor | vendor@petrotech.com | Vendor@123 |

New vendors can self-register and must await admin approval before login.

## API Endpoints

### Authentication
| Method | Endpoint          | Description        |
|--------|-------------------|--------------------|
| POST   | /api/auth/register | Vendor registration |
| POST   | /api/auth/login    | Login (sets cookie) |
| POST   | /api/auth/logout   | Logout              |
| GET    | /api/auth/me       | Current user        |

### Users (Admin)
| Method | Endpoint                    | Description          |
|--------|-----------------------------|----------------------|
| GET    | /api/users                  | List all users       |
| GET    | /api/users/pending          | Pending vendors      |
| PATCH  | /api/users/:id/status       | Update user status   |
| PATCH  | /api/users/:id/toggle-active | Toggle active state |

### Forms (Admin)
| Method | Endpoint           | Description         |
|--------|--------------------|---------------------|
| POST   | /api/forms         | Create form         |
| GET    | /api/forms         | List all forms      |
| GET    | /api/forms/:id     | Get form by ID      |
| GET    | /api/forms/active  | Get active form     |
| PUT    | /api/forms/:id     | Update form         |
| DELETE | /api/forms/:id     | Delete form         |

### Settings (Admin)
| Method | Endpoint        | Description              |
|--------|-----------------|--------------------------|
| GET    | /api/settings   | Get system settings      |
| PUT    | /api/settings   | Create/update settings   |

## Roles

| Role   | Capabilities                                              |
|--------|-----------------------------------------------------------|
| Vendor | Register, submit applications, upload documents, view AI results |
| Staff  | Review submissions, view AI assessment, make procurement decisions |
| Admin  | All staff capabilities + vendor/staff management, form builder, settings |

## Architecture

```
Route → Controller → Service → Mongo Model
```

No repository pattern. No dependency injection. Simple and maintainable.

## What's Implemented

- Full vendor registration → admin approval → login workflow
- Dynamic form builder and renderer (no hardcoded onboarding fields)
- Application submission with Multer file upload (`/backend/uploads`)
- Sequential case IDs (`WASCO-VQ-000001`)
- Atenxion trigger API (reads Base URL, Access Token, Agent ID from settings)
- Atenxion callback (`POST /api/atenxion/callback`)
- AI assessment storage and display (scores, risk band, recommendation, mandatory gap)
- Human validation workflow (approve, conditionally approve, reject, request clarification)
- Staff/admin dashboards with live stats
- All portals connected to real Express + MongoDB APIs

## Application Workflow

1. Vendor registers → **Pending Approval**
2. Admin approves vendor → vendor logs in
3. Vendor completes dynamic form + uploads documents
4. Application created → **Processing** → **Proposal Under Review** → Atenxion triggered
5. Atenxion callback → **Assessment Completed**
6. Staff/Admin reviews AI summary and decides
7. If clarification needed, vendor uploads document → Atenxion re-triggered

### Additional Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/applications | Submit application |
| GET | /api/applications | List applications |
| GET | /api/applications/:id | Application details |
| POST | /api/applications/:id/clarifications | Upload clarification |
| POST | /api/applications/:id/validation | Human validation |
| GET/PUT | /api/vendor/profile | Vendor profile |
| GET | /api/vendors | List vendors (admin) |
| PUT | /api/vendors/:id/approve | Approve vendor |
| PUT | /api/vendors/:id/deactivate | Deactivate vendor |
| GET/POST/PUT/DELETE | /api/staff | Staff management |
| POST | /api/upload/file | Upload file |
| POST | /api/atenxion/callback | Atenxion callback |
| GET | /api/dashboard/staff | Staff stats |
| GET | /api/dashboard/admin | Admin stats |

## PM2 Deployment

Ports: **Frontend 3018** | **Backend 4014**

```bash
# On server after clone
cd backend && npm install && npm run build
cd ../frontend && npm install && npm run build
cd .. && pm2 start ecosystem.config.js
pm2 save
```

`ecosystem.config.js` runs:
- `wasco-be` → `backend/dist/index.js` on port **4014**
- `wasco-fe` → `frontend/node_modules/next/dist/bin/next start -p 3018`

## Environment Variables

### Backend (`backend/.env`)
```
PORT=4014
MONGODB_URI=mongodb://localhost:27017/wasco-vendor-portal
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3018
CORS_ORIGIN=http://localhost:3018
UPLOAD_DIR=uploads
API_PUBLIC_URL=http://localhost:4014
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:4014/api
```
