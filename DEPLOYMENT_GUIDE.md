# CMEMS — Free Deployment Guide
### TiDB Cloud (DB) · Render (Backend) · Netlify (Frontend)
**Total monthly cost: $0**

---

## Overview

| Layer | Service | Free Tier |
|-------|---------|-----------|
| Database | TiDB Cloud Serverless | 5 GB storage, 50M RUs/month |
| Backend API | Render Web Service | 750 hrs/month (enough for 1 service) |
| Frontend | Netlify | 100 GB bandwidth, unlimited sites |

---

## Step 1 — TiDB Cloud (Database)

### 1.1 Create a cluster
1. Go to [tidbcloud.com](https://tidbcloud.com) → **Sign Up** (free, no credit card needed)
2. Click **Create Cluster** → choose **Serverless**
3. Pick any region → click **Create**
4. Wait ~30 seconds for the cluster to provision

### 1.2 Get connection credentials
1. Click your cluster → **Connect**
2. Choose **General** connection type
3. Note down:
   - **Host** (looks like `gateway01.us-west-2.prod.aws.tidbcloud.com`)
   - **Port** — `4000`
   - **Username** (looks like `4En5MpxxxxxxxQ.root`)
   - **Password** — click **Generate Password**, copy it immediately
   - **Database** — create one named `cmems_db`

### 1.3 Create the database
In the TiDB Cloud web console → **SQL Editor**, run:
```sql
CREATE DATABASE IF NOT EXISTS cmems_db;
```

### 1.4 Run the schema
1. Open the CMEMS `backend/` folder and find your SQL schema file (or the schema in `server.js`)
2. In the TiDB SQL Editor (or any MySQL client), paste and run the full `CREATE TABLE` statements
3. Insert any seed data (admin user, roles) if you have seed scripts

---

## Step 2 — Render (Backend API)

### 2.1 Prepare your backend for deployment
In `backend/`, ensure `package.json` has:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

The backend reads these environment variables (set them in Step 2.3):
```
DB_HOST       = <TiDB host from Step 1.2>
DB_PORT       = 4000
DB_USER       = <TiDB username>
DB_PASSWORD   = <TiDB password>
DB_NAME       = cmems_db
JWT_SECRET    = <any long random string, e.g. openssl rand -hex 32>
JWT_EXPIRES_IN = 24h
CLIENT_URL    = https://YOUR_NETLIFY_SITE.netlify.app
```

**Important:** TiDB Cloud requires SSL. Add this to your MySQL connection config in `server.js` if not already present:
```js
ssl: { rejectUnauthorized: true }
```

### 2.2 Push backend to GitHub
```bash
cd cmems-project/backend
git init
git add .
git commit -m "Initial CMEMS backend"
gh repo create cmems-backend --public --source=. --push
# or push to an existing repo
```

### 2.3 Deploy on Render
1. Go to [render.com](https://render.com) → **Sign Up** with GitHub
2. Click **New +** → **Web Service**
3. Connect your `cmems-backend` GitHub repo
4. Fill in:
   - **Name**: `cmems-api`
   - **Root Directory**: *(leave blank if backend is the repo root)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Under **Environment Variables**, add all variables from Step 2.1
6. Click **Create Web Service**
7. Wait for the first deploy (~3–5 minutes)
8. Your backend URL will be: `https://cmems-api.onrender.com`

> **Note:** Free Render services spin down after 15 minutes of inactivity. The first request after a sleep will take ~30 seconds to wake up. This is normal on the free tier.

---

## Step 3 — Netlify (Frontend)

### 3.1 Update the API URL in frontend
In `frontend/src/services/api.js`, the `baseURL` should point to your Render backend.

**Option A — Direct URL (simpler):**
```js
baseURL: 'https://cmems-api.onrender.com/api'
```

**Option B — Netlify Proxy (keeps everything on one domain):**
Keep `baseURL: '/api'` and use the `netlify.toml` already provided in the `frontend/` folder. Edit line 10 of `netlify.toml`:
```toml
to = "https://cmems-api.onrender.com/api/:splat"
```

### 3.2 Push frontend to GitHub
```bash
cd cmems-project/frontend
git init
git add .
git commit -m "Initial CMEMS frontend"
gh repo create cmems-frontend --public --source=. --push
```

### 3.3 Deploy on Netlify
1. Go to [netlify.com](https://netlify.com) → **Sign Up** with GitHub
2. Click **Add new site** → **Import an existing project**
3. Connect your `cmems-frontend` repo
4. Build settings (Netlify auto-detects Vite):
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Under **Environment variables**, add:
   ```
   VITE_API_URL = https://cmems-api.onrender.com/api
   ```
   *(Only needed if you reference `import.meta.env.VITE_API_URL` in code)*
6. Click **Deploy site**
7. Your site will be live at `https://random-name.netlify.app`

### 3.4 Set a custom subdomain (optional, free)
In Netlify → **Site configuration** → **Domain management** → **Options** → **Edit site name**  
Change it to something like `cmems-church.netlify.app`

---

## Step 4 — Connect Frontend ↔ Backend (CORS)

In `backend/server.js`, update the CORS config to allow your Netlify domain:
```js
const cors = require('cors');
app.use(cors({
  origin: [
    'http://localhost:5173',               // local dev
    'https://cmems-church.netlify.app',    // production Netlify URL
  ],
  credentials: true,
}));
```

Redeploy the backend on Render (it auto-deploys on every GitHub push if you set up the GitHub integration).

---

## Step 5 — Verify Everything Works

1. Open your Netlify URL in the browser
2. Try logging in with your admin credentials
3. Check the browser Network tab — API calls should go to `*.onrender.com` or via the Netlify proxy and return `200` responses
4. If you see `502` or `CORS` errors:
   - Confirm `CLIENT_URL` env var on Render matches your Netlify URL exactly
   - Confirm the CORS `origin` array in `server.js` is updated and redeployed

---

## Common Issues & Fixes

| Problem | Fix |
|---------|-----|
| API returns 500 on TiDB | Add `ssl: { rejectUnauthorized: true }` to MySQL config |
| Render service times out on first load | Normal — free tier sleeps. Reload the page |
| Netlify shows blank page on refresh | The `[[redirects]]` in `netlify.toml` handles this — ensure it's committed |
| CORS error in browser | Update `CLIENT_URL` on Render + `origin` array in `server.js` |
| TiDB password special chars break DB_URL | URL-encode the password or use individual env vars (recommended) |

---

## Local Development

```bash
# Terminal 1 — Backend
cd cmems-project/backend
cp .env.example .env       # fill in your TiDB credentials
npm install
npm run dev                # runs on http://localhost:5000

# Terminal 2 — Frontend
cd cmems-project/frontend
npm install
npm run dev                # runs on http://localhost:5173
```

The Vite dev server proxies `/api` → `http://localhost:5000` via `vite.config.js`.

---

## Free Tier Limits Reference

| Service | Limit | What happens when exceeded |
|---------|-------|---------------------------|
| TiDB Serverless | 5 GB / 50M RUs | Queries fail with quota error |
| Render Free | 750 hrs/month | Service paused for the month |
| Netlify Free | 100 GB bandwidth | Site returns 402 until next month |

All three limits are very generous for a church management system with typical usage (< 500 members, < 50 daily active users).
