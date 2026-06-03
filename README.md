# Church Ministry and Event Management System (CMEMS)

**Advanced Database Systems — Final Project**

A full-stack web application for managing church members, ministries, choirs, events, attendance, volunteers, and donations. Demonstrates 3NF database design, MySQL triggers, views, indexing, JWT authentication, and RBAC.

---

## Technology Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18 + Vite + Tailwind CSS          |
| Backend    | Node.js + Express.js (MVC)              |
| Database   | MySQL 8 (via XAMPP / phpMyAdmin)        |
| Auth       | JWT (JSON Web Tokens) + bcryptjs        |
| Charts     | Recharts                                |

---

## Default Accounts

| Email                   | Password   | Role                 |
|-------------------------|------------|----------------------|
| admin@cmems.com         | Admin@123  | Super Administrator  |
| leader@cmems.com        | Admin@123  | Ministry Leader      |
| choir@cmems.com         | Admin@123  | Choir Coordinator    |
| volunteer@cmems.com     | Admin@123  | Volunteer            |
| member@cmems.com        | Admin@123  | Church Member        |

---

## Quick Setup (Windows with XAMPP)

### Prerequisites

1. **XAMPP** — https://www.apachefriends.org/ (includes MySQL 8 + phpMyAdmin)
2. **Node.js 18+** — https://nodejs.org/ (LTS version recommended)
3. **Git** (optional) — https://git-scm.com/

---

## Step-by-Step Installation

### Step 1 — Install and Start XAMPP

1. Install XAMPP to `C:\xampp`
2. Open **XAMPP Control Panel** (Run as Administrator)
3. Click **Start** next to **Apache**
4. Click **Start** next to **MySQL**
5. Both should show green "Running" status

---

### Step 2 — Import the Database

1. Open your browser → http://localhost/phpmyadmin
2. Click **"New"** in the left sidebar
3. Type database name: `cmems_db` → click **Create**
4. Click on `cmems_db` to select it
5. Click the **"Import"** tab at the top
6. Click **"Choose File"** → select:
   `cmems-project\database\cmems.sql`
7. Scroll down → click **"Go"**
8. Wait for the green success message

This creates **15 tables**, seeds sample data, creates the **trigger**, the **view**, and all **indexes**.

---

### Step 3 — Configure the Backend

1. Open File Explorer → go to `cmems-project\backend\`
2. Copy `.env.example` → rename the copy to `.env`

Default settings work with XAMPP (root user, no password). If you set a MySQL root password, open `.env` with Notepad and update:

```
DB_PASSWORD=your_mysql_password
```

Also update `JWT_SECRET` to any long random string:

```
JWT_SECRET=your_super_secret_key_here_minimum_32_characters
```

---

### Step 4 — Install Backend Dependencies

Open **Command Prompt** (Win+R → type `cmd` → Enter):

```cmd
cd C:\path\to\cmems-project\backend
npm install
npm run dev
```

You should see:
```
✅  MySQL connected to: cmems_db
🚀  CMEMS API running at http://localhost:5000
📋  Health check:     http://localhost:5000/api/health
```

**Keep this window open.**

---

### Step 5 — Install Frontend Dependencies

Open a **new** Command Prompt window:

```cmd
cd C:\path\to\cmems-project\frontend
npm install
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

---

### Step 6 — Open the Application

1. Open your browser
2. Go to: **http://localhost:5173**
3. Login with any default account (e.g., `admin@cmems.com` / `Admin@123`)

---

## Quick Launch Scripts

### `start-backend.bat` (double-click to start backend)
Create a file `start-backend.bat` in the project root:
```batch
cd /d "%~dp0backend"
npm run dev
pause
```

### `start-frontend.bat` (double-click to start frontend)
Create a file `start-frontend.bat` in the project root:
```batch
cd /d "%~dp0frontend"
npm run dev
pause
```

---

## Project Structure

```
cmems-project/
├── database/
│   └── cmems.sql                  ← Full MySQL schema + seed data
├── backend/
│   ├── .env.example               ← Copy to .env and configure
│   ├── package.json
│   ├── server.js                  ← Express app entry point
│   ├── config/
│   │   └── db.js                  ← MySQL connection pool
│   ├── middleware/
│   │   ├── auth.js                ← JWT authentication + RBAC
│   │   └── error.js               ← Global error handler
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── memberController.js
│   │   ├── ministryController.js
│   │   ├── choirController.js
│   │   ├── eventController.js
│   │   ├── attendanceController.js
│   │   ├── volunteerController.js
│   │   ├── donationController.js
│   │   └── dashboardController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── members.js
│   │   ├── ministries.js
│   │   ├── choirs.js
│   │   ├── events.js
│   │   ├── attendance.js
│   │   ├── volunteers.js
│   │   ├── donations.js
│   │   └── dashboard.js
│   └── utils/
│       └── logger.js              ← Activity log utility
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── contexts/
        │   └── AuthContext.jsx    ← JWT auth state
        ├── services/
        │   └── api.js             ← Axios instance
        ├── components/
        │   ├── Layout.jsx
        │   ├── Sidebar.jsx
        │   ├── Header.jsx
        │   └── ProtectedRoute.jsx
        └── pages/
            ├── Login.jsx
            ├── Dashboard.jsx      ← Stats, charts, recent activity
            ├── Members.jsx
            ├── Ministries.jsx
            ├── Choirs.jsx
            ├── Events.jsx
            ├── Attendance.jsx
            ├── Volunteers.jsx
            ├── Donations.jsx
            ├── Reports.jsx        ← Ministry participation view
            └── Users.jsx
```

---

## Database Tables (15 tables)

| Table                   | Description                                    |
|-------------------------|------------------------------------------------|
| `roles`                 | 5 user roles                                   |
| `users`                 | System users with hashed passwords             |
| `members`               | Church member profiles                         |
| `ministries`            | Ministry groups                                |
| `member_ministries`     | Member–Ministry junction table                 |
| `choirs`                | Choir groups                                   |
| `choir_members`         | Choir membership with voice parts              |
| `events`                | Church events with capacity tracking           |
| `event_registrations`   | Member event sign-ups                          |
| `attendance`            | Attendance records (Present/Absent/Excused)    |
| `volunteers`            | Volunteer profiles                             |
| `volunteer_assignments` | Volunteer event task assignments               |
| `donations`             | Donation records with type classification      |
| `activity_logs`         | System-wide audit trail                        |
| `notifications`         | User notification records                      |

---

## Advanced Database Features

### Trigger: `update_event_attendance_count`
- **Table:** `attendance` (AFTER INSERT)
- **Purpose:** When a new attendance record is inserted with `status = 'Present'`, automatically:
  - Increments `events.total_attendees`
  - Recalculates `events.attendance_percentage` based on capacity

### View: `vw_ministry_participation_dashboard`
Joins `members`, `ministries`, `member_ministries`, `attendance`, and `events` to display:
- Member Name
- Ministry Name
- Total Events Attended
- Attendance Rate (%)
- Last Participation Date
- Ministry Role

Used in the **Reports** page (`GET /api/dashboard/reports/ministry-participation`).

### Indexes
| Index                    | Column                   | Purpose                        |
|--------------------------|--------------------------|--------------------------------|
| `idx_members_last_name`  | `members.last_name`      | Fast name search               |
| `idx_members_email`      | `members.email`          | Unique lookup, login           |
| `idx_events_start_date`  | `events.start_date`      | Date-range event queries       |
| `idx_donations_date`     | `donations.donation_date`| Monthly report filtering       |

---

## API Endpoints

### Authentication
| Method | Endpoint             | Description         |
|--------|----------------------|---------------------|
| POST   | `/api/auth/login`    | Login, get JWT      |
| POST   | `/api/auth/register` | Register new user   |
| GET    | `/api/auth/profile`  | Get current user    |

### Members
| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
| GET    | `/api/members`     | List members         |
| GET    | `/api/members/:id` | Get single member    |
| POST   | `/api/members`     | Create member        |
| PUT    | `/api/members/:id` | Update member        |
| DELETE | `/api/members/:id` | Delete member        |

### Ministries
| Method | Endpoint                          | Description          |
|--------|-----------------------------------|----------------------|
| GET    | `/api/ministries`                 | List all             |
| POST   | `/api/ministries`                 | Create               |
| PUT    | `/api/ministries/:id`             | Update               |
| DELETE | `/api/ministries/:id`             | Delete               |
| POST   | `/api/ministries/:id/members`     | Assign member        |
| DELETE | `/api/ministries/:id/members/:mId`| Remove member        |

### Events
| Method | Endpoint                    | Description          |
|--------|-----------------------------|----------------------|
| GET    | `/api/events`               | List events          |
| POST   | `/api/events`               | Create event         |
| PUT    | `/api/events/:id`           | Update event         |
| DELETE | `/api/events/:id`           | Delete event         |
| POST   | `/api/events/:id/register`  | Register for event   |

### Attendance
| Method | Endpoint               | Description          |
|--------|------------------------|----------------------|
| GET    | `/api/attendance`      | List records         |
| POST   | `/api/attendance`      | Record attendance    |
| GET    | `/api/attendance/summary` | Per-event summary |

### Volunteers, Donations, Choirs
Similar CRUD pattern — see `backend/routes/` for full details.

### Dashboard & Reports
| Method | Endpoint                                    | Description                      |
|--------|---------------------------------------------|----------------------------------|
| GET    | `/api/dashboard`                            | Stats, charts, activity feed     |
| GET    | `/api/dashboard/reports/ministry-participation` | View data for reports page   |
| GET    | `/api/dashboard/users`                      | All users (admin only)           |

---

## Security Features

- **JWT Authentication** — Stateless token-based auth (24h expiry)
- **bcryptjs Password Hashing** — Salt rounds: 10
- **Role-Based Access Control** — 5 roles with route-level middleware enforcement
- **Parameterized SQL Queries** — All queries use `?` placeholders (no string concatenation)
- **CORS** — Configured to allow only the frontend origin
- **Activity Logging** — All CRUD actions logged to `activity_logs` table

---

## Troubleshooting

**MySQL connection error:**
- Make sure XAMPP MySQL is running (green in Control Panel)
- Check `.env` has correct `DB_PASSWORD`
- Verify `DB_NAME=cmems_db`

**Database import fails:**
- Make sure you created `cmems_db` before importing
- MySQL version must be 8.0+

**`npm` not found:**
- Install Node.js from https://nodejs.org and restart Command Prompt

**Port already in use:**
- Backend (5000): Change `PORT=5001` in `.env` and update `vite.config.js` proxy target
- Frontend (5173): Vite auto-picks next available port

**Bcrypt error on startup:**
- Run `npm install` again in the `backend` folder

---

## ERD Summary (Key Relationships)

```
users ──< members
roles >── users
members ──< member_ministries >── ministries
members ──< choir_members >── choirs
members ──< event_registrations >── events
members ──< attendance >── events
members ──< volunteers ──< volunteer_assignments >── events
members ──< donations
```

All foreign keys enforce referential integrity with `ON DELETE CASCADE` or `ON DELETE SET NULL` as appropriate.

---

*Church Ministry and Event Management System — Advanced Database Systems Final Project*
