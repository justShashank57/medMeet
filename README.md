# Med-Meet - Medical Appointment System

A full-stack medical appointment booking system built with React.js frontend and Node.js/Express backend.

## 🚀 Features

### Patient Features
- ✅ User Registration & Authentication
- ✅ View Available Doctors
- ✅ Book Appointments
- ✅ View Appointment History
- ✅ Update Profile Information

### Doctor Features
- ✅ Doctor Registration & Authentication
- ✅ View Patient Appointments
- ✅ Confirm/Cancel Appointments
- ✅ Update Profile Information
- ✅ Toggle Availability Status

### Admin Features
- ✅ Manage Doctors
- ✅ View All System Data

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI Framework
- **Redux Toolkit** - State Management
- **React Router** - Navigation
- **Axios** - HTTP Client
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password Hashing

## 📋 Prerequisite

- **Node.js** (v14 or higher)
- **MongoDB** (Local installation or MongoDB Atlas)
- **Git**

## 🚀 Quick Start

### 1. Server Setup

```bash
# Navigate to server directory
cd Server

# Install dependencies
npm install

# Copy the example env file and fill in real values
cp .env.example .env

# Start server (with auto-restart)
npm run dev
```

See [Environment Variables](#-environment-variables) below for what each `.env` key does.

### 2. Client Setup

```bash
# Navigate to client directory
cd Client

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5500
- **API docs (Swagger UI)**: http://localhost:5500/api-docs

### 3. Or run everything with Docker

```bash
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(48).toString('hex'))") \
ADMIN_API_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))") \
docker compose up --build
```

This starts MongoDB, the API server, and an nginx-served production build of the client.

## 📁 Project Structure

```
med-meet/
├── Client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── Pages/          # Page components
│   │   ├── redux/          # State management
│   │   ├── services/       # API services
│   │   └── data/           # Static data
│   ├── public/             # Static assets
│   └── SETUP.md           # Frontend setup guide
├── Server/                 # Node.js Backend
│   ├── controllers/        # Route controllers
│   ├── Models/            # Database models
│   ├── Routes/            # API routes (with Swagger JSDoc annotations)
│   ├── services/          # expressApp assembly, DB connection, swagger spec
│   ├── middlewares/       # auth, validation, rate limiting, sanitization, error handling
│   ├── utility/           # logger, mailer, error tracking, password/JWT helpers
│   ├── tests/             # node:test + supertest integration/unit tests
│   ├── Dockerfile, .dockerignore
│   ├── config.js          # Configuration
│   └── setup-guide.md     # Backend setup guide
├── docker-compose.yml      # mongo + server + client
├── .github/workflows/ci.yml # Lint, test, build on push/PR
└── README.md              # This file
```

## 🏗️ Architecture

```
┌─────────────┐        HTTPS/JSON        ┌──────────────────┐        ┌─────────────┐
│   React SPA │ ───────────────────────▶ │  Express API      │ ─────▶ │  MongoDB    │
│  (Client/)  │ ◀─────────────────────── │  (Server/)         │ ◀───── │  Atlas      │
└─────────────┘   Bearer JWT in header   └──────────────────┘        └─────────────┘
                                                  │
                                                  ├─▶ winston + morgan (logs/)
                                                  ├─▶ Sentry (optional, via SENTRY_DSN)
                                                  └─▶ nodemailer (optional, via SMTP_*)
```

- The client is a Create React App SPA; it never talks to MongoDB directly, only to the Express API over JSON.
- Auth is stateless: login/signup return a JWT, the client stores it and sends it back as `Authorization: Bearer <token>`. There are no server-side sessions or auth cookies.
- `Server/services/expressApp.js` is the single place the middleware stack (helmet, CORS, rate limiting, sanitization, routing, error handling) is assembled — see that file to trace a request end-to-end.
- Admin write endpoints (`POST/DELETE /admin/doctor*`) are gated by a shared `x-admin-key` header rather than a full admin-account system, since none exists yet (see [Known gaps](#-known-gaps--recommended-next-steps)).

## 🔧 Configuration

### Environment Variables

Copy `Server/.env.example` to `Server/.env` and fill in real values:

| Variable | Required | Purpose |
|---|---|---|
| `MONGODB_URL` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes in production (dev falls back to an insecure default with a warning) | Signs auth tokens — generate with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `PORT` | No (default 5500) | API port |
| `NODE_ENV` | No (default development) | Enables stricter error responses and disables the JWT_SECRET fallback in `production` |
| `CLIENT_URL` | No (default http://localhost:3000) | Allowed CORS origin |
| `ADMIN_API_KEY` | No, but admin write endpoints return 503 until set | Shared secret required in the `x-admin-key` header to create/delete doctors |
| `SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASS`/`MAIL_FROM` | No | Enables appointment confirmation/status emails; booking still works without them, emails are just skipped |
| `SENTRY_DSN` | No | Enables error reporting to Sentry; errors are always logged locally regardless |

For the client, copy `Client/.env.example` to `Client/.env` (or rely on the committed `Client/.env.development`) — `REACT_APP_API_BASE_URL` points the SPA at your local API instead of the deployed one.

### API Endpoints

#### Authentication
- `POST /patient/signup` - Patient registration
- `POST /patient/login` - Patient login
- `POST /doctor/signup` - Doctor registration
- `POST /doctor/login` - Doctor login

#### Patient Endpoints
- `GET /patient/getDoctors` - List doctors (public; supports `?page&limit&search&speciality&isAvailable`)
- `GET /patient/profile` - Get patient profile
- `PATCH /patient/profile` - Update patient profile
- `GET /patient/getDoctor/:id` - Get a single doctor
- `POST /patient/create-appointment` - Book appointment (rejects past times and double-booked slots)
- `GET /patient/appointments` - Get patient appointments
- `GET /patient/appointment/:id` - Get one appointment
- `PATCH /patient/appointment/:id/cancel` - Cancel an appointment (must be ≥2 hours out)

#### Doctor Endpoints
- `GET /doctor/profile` - Get doctor profile
- `PATCH /doctor/profile` - Update doctor profile
- `GET /doctor/appointments` - Get doctor appointments
- `GET /doctor/confirm-appointment/:id` - Toggle appointment confirmation
- `POST /doctor/update-status` - Update appointment status/notes
- `GET /doctor/service` - Toggle availability

#### Admin Endpoints
*(`POST`/`DELETE` require an `x-admin-key` header matching `ADMIN_API_KEY`)*
- `GET /admin/doctors` - List doctors (paginated)
- `GET /admin/doctor/:id` - Get a doctor
- `POST /admin/doctor` - Create doctor
- `DELETE /admin/doctor/:id` - Delete doctor

Full request/response schemas are documented interactively at `/api-docs` (Swagger UI) once the server is running.

## 🗄️ Database Schema

Three Mongoose collections in MongoDB (`Server/Models/`):

**Patient** — `name`, `email` (unique), `password` (bcrypt hash), `salt`, `phone`, `gender`, `age`, `pincode`, `address`, `photo`, `appointments` (refs → Appointment). `password`/`salt` are stripped from JSON responses.

**Doctor** — same identity fields as Patient plus `speciality` (indexed), `hospital`, `rating`, `isAvailable`, `appointments` (refs → Appointment). `email` is unique; `gender` is required (Patient's is not).

**Appointment** — `doctorId`, `patientId` (both plain string copies of the owning document's `_id`, indexed), `appointmentId` (a short human-readable code), `date`, `time`, `duration`, `status` (`Pending`/`Confirmed`/`Cancelled`/...), `confirmed`, `reason`, `notes`. A compound index on `(doctorId, date, time)` backs the double-booking check.

## 📱 Usage

### For Patients
1. Register as a patient
2. Login to access features
3. Browse available doctors
4. Book appointments
5. View appointment history

### For Doctors
1. Register as a doctor
2. Login to access dashboard
3. View patient appointments
4. Confirm/cancel appointments
5. Update profile and availability

## 🔒 Security Features

- JWT-based authentication (Bearer token, no auth cookies → not vulnerable to CSRF)
- Password hashing with bcrypt (constant-time compare via `bcrypt.compare`)
- `helmet` security headers, CORS restricted to `CLIENT_URL`
- Rate limiting on auth endpoints (brute-force mitigation) and globally
- Request validation via `express-validator` (email format, password strength, phone format, Mongo ObjectId params)
- Recursive stripping of `$`-prefixed/dotted keys from `body`/`params`/`query` (NoSQL operator injection defense)
- Admin write endpoints gated by a shared `x-admin-key` secret
- Centralized error handler that never leaks stack traces or raw driver errors in production
- `JWT_SECRET` is refused as empty/default when `NODE_ENV=production` (the server won't start); `ADMIN_API_KEY` disables admin write endpoints (503) until it's set, in any environment

## 🌐 API Integration

The frontend uses a centralized API service (`src/services/webcalls.js`) that provides:
- Centralized API management
- Automatic token handling
- Error handling
- Type-safe API calls

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env file

2. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration

3. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing processes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Roadmap

- [x] Email notifications (appointment booked/confirmed/status changed)
- [x] Admin dashboard UI (lightweight — see below)
- [ ] Payment integration
- [ ] Real-time chat
- [ ] Video consultation
- [ ] Mobile app
- [ ] Real admin accounts (per-admin login, audit trail)

## ⚠️ Known gaps & recommended next steps

Deliberately not built in this pass, with the reasoning, so they're not mistaken for oversights:

- **End-to-end tests** — no Cypress/Playwright suite yet. Unit + integration tests exist (`Server/tests`, `Client/src/**/*.test.js`); E2E is the next testing investment.
- **API versioning (`/v1/...`)** — skipped since it'd be a breaking route change with no external consumers yet to protect. Add a version prefix before the API has consumers you can't coordinate with.
- **Real-time updates (WebSocket)** — appointment status changes currently require a refetch; Socket.IO would need both server and client changes and its own test pass.
- **File uploads (doctor/patient photos)** — `photo` fields exist on the schema but nothing writes to them; would need `multer` + storage (local disk or S3-compatible) + a client upload UI.
- **Refresh tokens** — JWTs are long-lived (3 days) with no rotation/revocation. Fine for this app's risk profile today; revisit if you need shorter-lived sessions.
- **Analytics** — needs a product decision (which vendor, what to track, privacy/consent policy) before wiring anything in.
- **Database migrations / backup strategy** — Mongoose is schemaless at the DB level so there's nothing to migrate yet; backups are a MongoDB Atlas dashboard setting (enable continuous backups / point-in-time recovery there), not application code.
- **Real admin accounts** — admin write endpoints are gated by a single shared `x-admin-key` secret rather than per-admin login, since no admin user model exists. Fine for a single operator; build out an Admin model + auth if you need multiple admins or an audit trail.

### Admin UI

`/admin` in the client (not linked from the navbar — reach it by URL) is a minimal doctor-management page: enter the `ADMIN_API_KEY` value to unlock, then create or delete doctors. It's intentionally not full accounts — the key is kept in `sessionStorage` (cleared when the tab closes) and there's no way to distinguish one operator from another. Note the client can't validate the key without a real write attempt, so entering *any* non-empty value unlocks the page's UI; a wrong key is only caught (and bounces you back to the gate with an error) when you actually try to create or delete a doctor.

---

**Note**: This is a development version. Make sure to configure proper environment variables and security settings for production use.
