# 🚀 LeadFlow — Full Stack Lead Management System

A full-stack lead capture app built with **Next.js 15**, **MongoDB Atlas**, **Mongoose**, and **Tailwind CSS**.

---

## 📁 Folder Structure

```
lead-management/
├── app/
│   ├── api/
│   │   └── leads/
│   │       └── route.js        # POST & GET API routes
│   ├── globals.css             # Tailwind base styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Lead form + leads table UI
├── lib/
│   └── mongodb.js              # Mongoose connection (cached)
├── models/
│   └── Lead.js                 # Mongoose Lead schema
├── .env.local.example          # Environment variable template
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## ⚙️ Setup Instructions

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/lead-management.git
cd lead-management
npm install
```

---

### 2. Set Up MongoDB Atlas

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and sign in.
2. Create a **free cluster** (M0).
3. Under **Database Access** → Add a new user with a username and password.
4. Under **Network Access** → Add IP `0.0.0.0/0` (allow all) or your specific IP.
5. Click **Connect** → **Drivers** → copy the connection string. It looks like:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
```

---

### 3. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and paste your connection string:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/leadflow?retryWrites=true&w=majority
```

> ⚠️ Never commit `.env.local` — it's already in `.gitignore`.

---

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 API Reference

### `POST /api/leads`

Saves a new lead to MongoDB.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+91 98765 43210"
}
```

**Success Response (`201`):**
```json
{
  "success": true,
  "message": "Lead saved successfully!",
  "data": { "_id": "...", "name": "Jane Doe", "email": "...", "phone": "...", "createdAt": "..." }
}
```

**Error Response (`400` / `422` / `500`):**
```json
{
  "success": false,
  "message": "All fields are required."
}
```

---

### `GET /api/leads`

Returns all leads sorted by newest first.

**Response (`200`):**
```json
{
  "success": true,
  "count": 3,
  "data": [ { "_id": "...", "name": "...", "email": "...", "phone": "...", "createdAt": "..." } ]
}
```

---

## 🚀 Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add `MONGODB_URI` in your Vercel project → **Settings** → **Environment Variables**.

---

## 🛠 Tech Stack

| Technology     | Purpose                        |
|----------------|--------------------------------|
| Next.js 15     | App Router, API Routes, SSR    |
| React 19       | UI Components                  |
| MongoDB Atlas  | Cloud NoSQL Database           |
| Mongoose       | ODM / Schema Validation        |
| Tailwind CSS   | Utility-first Styling          |
| TypeScript     | Type Safety                    |
