# Campus Connect Portal

CS3301 - Full Stack Development, RV University.
Author: Abhineeth A R

Campus Connect Portal is a MERN stack web application that connects students, faculty and administrators on a single platform: notices and events, assignments and submissions, attendance tracking and user management.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, React Router, Axios |
| Backend | Node.js, Express 4 |
| Database | MongoDB with Mongoose |
| Auth | JWT (jsonwebtoken) and bcryptjs password hashing |

## Project structure

```
campus-connect-portal/
├── client/                  React frontend (Vite)
│   ├── index.html           Static landing page and React mount point (#auth-root)
│   └── src/
│       ├── components/      AuthModule, PortalShell, ProtectedRoute
│       ├── pages/           StudentPortal, FacultyPortal, AdminPortal
│       ├── context/         AuthContext (login state)
│       └── services/        Axios API handlers
├── server/                  Express backend
│   ├── index.js             Entry point
│   └── src/
│       ├── config/          MongoDB connection
│       ├── controllers/     Route handlers
│       ├── models/          Mongoose schemas (User, Assignment)
│       ├── routes/          Express routers
│       └── middleware/      JWT auth, role check, error handling
├── .gitignore
└── README.md
```

## Features

- Static HTML landing page with hero banner, image carousel and role cards, with React mounted into it for login and registration.
- Register and log in as student or faculty. Passwords are hashed with bcrypt and sessions use signed JWTs.
- Role-based routing on the frontend and role-based authorization middleware on the backend.
- Student portal: notices, assignments (fetched from MongoDB, submit with one click), attendance, profile.
- Faculty portal: create and delete assignments, view submission status.
- Admin portal: user list and role counts. Admin accounts come from the seed script, never from public registration.
- Centralised error handling, request logging, health check at `/health`, CORS locked to the configured frontend origin.

## Prerequisites

- Node.js 20.19 or newer (Vite 7 requires it)
- MongoDB running locally on the default port, or a MongoDB Atlas connection string

## Run locally

Backend:

```bash
cd server
cp .env.example .env
npm install
npm run seed
npm run dev
```

Frontend, in a second terminal:

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173.

Demo accounts created by `npm run seed` (password `Passw0rd!`):

| Role | Email |
| --- | --- |
| Admin | admin@rvu.edu |
| Faculty | faculty@rvu.edu |
| Student | student@rvu.edu |

## Environment variables

`server/.env`

| Variable | Purpose |
| --- | --- |
| `PORT` | Port the API listens on (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign tokens, use a long random value |
| `JWT_EXPIRES_IN` | Token lifetime (default 7d) |
| `CLIENT_ORIGIN` | Allowed frontend origin(s) for CORS, comma separated |

`client/.env`

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Base URL of the backend API |

## API reference

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Create a student or faculty account |
| POST | `/api/auth/login` | Public | Log in and receive a JWT |
| GET | `/api/auth/users` | Admin | List all users |
| GET | `/api/assignments` | Public | List assignments |
| POST | `/api/assignments` | Faculty, Admin | Create an assignment |
| PUT | `/api/assignments/:id/submit` | Student | Mark an assignment as submitted |
| DELETE | `/api/assignments/:id` | Faculty, Admin | Delete an assignment |
| GET | `/health` | Public | Server health check |

## Deployment

1. Create a free MongoDB Atlas cluster, add a database user and allow network access for Render.
2. Create a Render Web Service from this repository with Root Directory `server`, Build Command `npm install`, Start Command `node index.js`.
3. Set `MONGO_URI`, `JWT_SECRET` and `CLIENT_ORIGIN` as environment variables on Render.
4. Set `VITE_API_URL` in `client/.env` to the Render URL when building the frontend.

Free Render web services spin down after 15 minutes without traffic, so the first request after idle takes about a minute.
