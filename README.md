# 🎨 ArtVault — Online Art Gallery & Auction Platform

A full-stack MERN (MongoDB, Express, React, Node.js) application for discovering, buying, and auctioning original artworks.

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB running locally (`mongod`) or MongoDB Atlas URI

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Configure Environment

**Server** — edit `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/art-gallery-auction
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Client** — edit `client/.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Run the App
```bash
# Option A: Run both together (from root)
npm run dev

# Option B: Run separately
cd server && npm run dev    # Backend on port 5000
cd client && npm run dev   # Frontend on port 5173
```

Open **http://localhost:5173** in your browser.

---

## 👥 Demo Accounts

Register with these credentials, or create your own:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | demo123 |
| Artist | artist@demo.com | demo123 |
| Buyer | buyer@demo.com | demo123 |

> Admin account must be manually set in DB: `db.users.updateOne({email: "admin@demo.com"}, {$set: {role: "admin"}})`

---

## 🏗️ Project Structure

```
art-gallery-auction-platform/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── components/     # Navbar, Footer, Cards, ProtectedRoute
│       ├── pages/          # All 12 page components
│       ├── redux/          # State management (6 slices)
│       └── services/       # API calls (axios)
├── server/                 # Node.js + Express backend
│   ├── config/             # DB connection
│   ├── controllers/        # Business logic (8 controllers)
│   ├── middleware/         # Auth, Role, Upload, Error
│   ├── models/             # MongoDB schemas (6 models)
│   ├── routes/             # API routes (8 route files)
│   └── utils/              # Token, Winner, Alerts
└── package.json            # Root scripts
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/artworks` | Browse artworks |
| POST | `/api/artworks` | Upload artwork (Artist) |
| GET | `/api/auctions` | List auctions |
| POST | `/api/auctions` | Create auction (Artist) |
| PUT | `/api/auctions/:id/end` | End auction |
| POST | `/api/bids` | Place bid (Buyer) |
| PUT | `/api/orders/:id/pay` | Mock payment |
| GET | `/api/admin/stats` | Platform stats (Admin) |

---

## ⚡ Key Features

- **JWT Authentication** with role-based access (Artist / Buyer / Admin)
- **Artwork Gallery** with filters (category, price, sort, search)
- **Live Auctions** with real-time bid updates via Socket.io
- **Countdown Timers** for auction end dates
- **Mock Payment Flow** (ready to swap with Razorpay/Stripe)
- **Notifications** for bids placed, auction won, payments
- **Admin Dashboard** with platform stats and user management
- **Artist Dashboard** with artwork & auction management
- **Buyer Dashboard** with bid tracking and order history

---

## 🎨 Design

- Dark mode art gallery aesthetic
- Gold accent color system
- Glassmorphism cards
- Playfair Display + Inter typography
- Full responsive design
- Smooth micro-animations
