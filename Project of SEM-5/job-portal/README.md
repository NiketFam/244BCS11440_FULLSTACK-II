# HireHub - Production-Grade MERN Job Portal

HireHub is a full-stack, enterprise-ready recruitment platform built with the MERN stack (MongoDB, Express, React, Node.js). It provides dedicated experiences for **Job Seekers** and **Recruiters**, with complete resume upload workflows, bookmarking, multi-stage application screening, analytics dashboards, and containerized deployment.

---

## Key Features

### For Job Seekers
- **Smart Job Search & Filtering:** Filter by keyword (title/company/skill), location, employment type (Full-time, Part-time, Internship, Remote, Contract), and experience level.
- **Direct Resume Upload:** Upload PDF/DOCX resumes (up to 5MB) directly during application with automatic server storage and validation.
- **Bookmarked / Saved Jobs:** Save interesting openings with a single click to review and apply later.
- **Candidate Profile:** Manage professional headline, skills tags, bio, and default resume.
- **Real-Time Application Tracking:** Track statuses (`Pending`, `Under Review`, `Shortlisted`, `Rejected`) across all submissions.

### For Recruiters
- **Job Posting & Lifecycle Management:** Create, edit, pause, and close job postings.
- **Analytics Dashboard:** Real-time metrics on total jobs, active postings, total views, incoming applicants, and shortlist rates.
- **Applicant Screening Pipeline:** Review applicant cover letters, open PDF resumes in-browser, save internal interview notes, and move candidates across stages.
- **Company Branding:** Manage company profile, industry size, website, and about details.

### Security & DevOps
- **Security Headers & Hardening:** Protected by `helmet` security headers, CORS origin controls, and bcrypt password hashing.
- **Rate Limiting:** Protected authentication routes against brute-force attacks via `express-rate-limit`.
- **Health Check & Monitoring:** Dedicated `/api/health` endpoint reporting uptime and MongoDB connection state.
- **Dockerized:** Ready for instant multi-container deployment via `docker-compose.yml`.
- **SPA Routing Ready:** Includes `_redirects` and `vercel.json` for seamless Vercel / Netlify routing.

---

## Tech Stack

- **Frontend:** React 18, Vite 5, React Router DOM 6, Axios, Lucide React (Icons).
- **Backend:** Node.js, Express 4.19, Mongoose 8.4, Multer (File Uploads), Helmet, Express Rate Limit, JWT.
- **Database:** MongoDB (with compound indexes preventing duplicate applications and text indexes for fast querying).
- **DevOps:** Docker, Docker Compose, Nginx.

---

## Quick Start (Docker)

To run the entire full-stack application (MongoDB + Express Backend + Vite/Nginx Frontend) with a single command:

```bash
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- MongoDB: `localhost:27017`

---

## Manual Local Development

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env   # configure MONGO_URI and JWT_SECRET
npm run dev
```
Backend runs on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd client
npm install
cp .env.example .env   # configure VITE_API_URL=http://localhost:5000/api
npm run dev
```
Frontend runs on `http://localhost:5173`.

---

## API Reference

### Authentication & Profiles
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register candidate or recruiter (rate-limited) |
| `POST` | `/api/auth/login` | Public | Login & receive JWT (rate-limited) |
| `GET` | `/api/auth/me` | Authenticated | Get current user profile & saved jobs |
| `PUT` | `/api/auth/profile` | Authenticated | Update user/company profile & skills |

### Jobs
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/jobs` | Public | Paginated job search with type, level & location filters |
| `GET` | `/api/jobs/:id` | Public | Get single job details & increment view count |
| `POST` | `/api/jobs` | Recruiter | Publish a new job opening |
| `PUT` | `/api/jobs/:id` | Recruiter (Owner) | Update an existing job opening |
| `DELETE` | `/api/jobs/:id` | Recruiter (Owner) | Delete job and cascade delete all applications |
| `GET` | `/api/jobs/mine/list` | Recruiter | Get all jobs posted by current recruiter with applicant counts |
| `GET` | `/api/jobs/mine/stats` | Recruiter | Recruiter analytics dashboard metrics |
| `POST` | `/api/jobs/:id/save` | Applicant | Toggle bookmark/saved status for a job |
| `GET` | `/api/jobs/saved/list` | Applicant | Get list of all saved jobs for current applicant |

### Applications
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/applications/:jobId` | Applicant | Apply to job with multipart PDF resume or link |
| `GET` | `/api/applications/mine` | Applicant | Get all applications submitted by candidate |
| `GET` | `/api/applications/job/:jobId` | Recruiter (Owner) | Get all applicants for a specific job posting |
| `PUT` | `/api/applications/:id/status` | Recruiter (Owner) | Update candidate status (`Shortlisted`, `Under Review`, etc.) & notes |

### Health & Monitoring
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Returns database connection status and server uptime |

---

## Production Deployment

### Frontend (Vercel / Netlify)
- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `VITE_API_URL=https://<your-backend-api-url>/api`
- *Note:* The included `_redirects` and `vercel.json` automatically prevent 404 errors on browser page reloads.

### Backend (Render / Railway / Fly.io)
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `node server.js`
- Environment Variables:
  - `MONGO_URI`: MongoDB Atlas connection string
  - `JWT_SECRET`: A secure 32+ character random secret
  - `CLIENT_URL`: `https://<your-frontend-domain>`
  - `PORT`: `5000`
