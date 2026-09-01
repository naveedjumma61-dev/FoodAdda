# 🍔 HostelAdda — Full-Stack Campus Food Delivery Platform

> **"Your Campus Food, Delivered Fast"**  
> A full-stack, mobile-first campus food delivery platform connecting university students, hostel residents, nearby restaurants, and riders in Islamabad (COMSATS Chak Shehzad, Abasyn University, and Hostel City).

---

## 🚀 Key Highlights & Architecture

- **Full-Stack Next.js 14 App Router**: End-to-end TypeScript architecture with React Server Components, Client interactive flows, and secure API route handlers.
- **PostgreSQL Database with Prisma ORM**: Complete relational schema supporting Users, Restaurants, Menu Items, Hostels, User Addresses, Orders, Order Items, Riders, Settings, and Notifications.
- **Role-Based Authentication & Permissions**:
  - **CUSTOMER**: Browse restaurants, customizable food cart, checkout, live order tracking, profile and address management.
  - **RIDER**: Mobile delivery interface with active order dispatching, pickup/drop-off status workflow, and PostgreSQL availability toggle.
  - **ADMIN**: Operations hub for live order management, restaurant onboarding, menu item control, fleet oversight, and platform settings.
- **Security & Route Guarding**:
  - Encrypted password hashing with `bcryptjs`.
  - Signed JWT session tokens with `jose` stored in secure HTTP-only cookies (`hosteladda_session`).
  - Next.js Edge Middleware guarding `/admin` (ADMIN only), `/rider` (RIDER and ADMIN), `/dashboard`, and `/checkout`.
- **Campus-Tailored Business Rules**:
  - Campus delivery minimum: Rs. 500 (Delivery charge: Rs. 89).
  - Hostel delivery minimum: Rs. 300 (Delivery charge: Rs. 70).
  - Supported Areas: COMSATS University Islamabad, Abasyn University, Hostel City Islamabad.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, API Routes, Edge Middleware)
- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, canvas-confetti
- **Backend**: Next.js Route Handlers (REST APIs)
- **Database & ORM**: PostgreSQL & Prisma ORM
- **Authentication**: JWT (jose) + HTTP-Only Session Cookies + bcryptjs
- **Validation & Mapping**: Zod, bi-directional OrderStatus mapping layer

---

## 📁 Project Structure

```
FoodAdda/
├── prisma/
│   ├── schema.prisma              # 10 relational PostgreSQL models & enums
│   └── seed.ts                    # Database seed script for restaurants, riders, & users
├── src/
│   ├── middleware.ts              # Edge Route Protection Middleware
│   ├── app/
│   │   ├── layout.tsx             # Root layout with Auth, Location, Cart, Order, & Toast providers
│   │   ├── page.tsx               # Campus Home (Hero, Categories, Top Spots, Deals)
│   │   ├── login/page.tsx         # Standalone Authentication (Login / Register)
│   │   ├── unauthorized/page.tsx  # 403 Access Denied page
│   │   ├── restaurants/           # Restaurant Directory & Detail Views
│   │   ├── cart/page.tsx          # Cart & voucher management
│   │   ├── checkout/page.tsx      # Hostel delivery checkout (connected to POST /api/orders)
│   │   ├── orders/                # Customer Order History & Live 8-step Tracking
│   │   ├── dashboard/page.tsx     # Student Profile & Saved Addresses
│   │   ├── admin/page.tsx         # Admin Operations & Dispatch Portal
│   │   ├── rider/page.tsx         # Rider Delivery Management App
│   │   └── api/                   # Full REST API routes (auth, orders, restaurants, riders, etc.)
│   ├── components/                # Reusable UI cards, headers, navigation drawers, modals
│   ├── context/                   # AuthContext, CartContext, LocationContext, OrderContext, ToastContext
│   ├── lib/                       # Prisma client, auth helpers, orderMapper, storage, validation
│   ├── data/                      # Structured campus dataset & fallback fixtures
│   └── types/                     # TypeScript data contracts & OrderStatus definitions
```

---

## ⚡ Quick Start & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file from `.env.example`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hosteladda?schema=public"
AUTH_SECRET="hosteladda-super-secure-campus-food-secret-key-2026"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Migration & Seed
```bash
npx prisma generate
npx prisma db push
npm run prisma:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 🔑 Demo Seed Accounts

| Role | Email | Password | Allowed Access |
|---|---|---|---|
| **Admin** | `admin@hosteladda.com` | `admin123` | Full Admin Portal (`/admin`), platform settings, all orders |
| **Rider** | `rider1@hosteladda.com` | `rider123` | Rider Portal (`/rider`), delivery tasks, availability toggle |
| **Student** | `student1@hosteladda.com` | `student123` | Ordering, Cart, Checkout (`/checkout`), Profile (`/dashboard`) |

---

## 🔒 Security Summary

1. **Authentication**: All user credentials are verified against salted bcrypt hashes. Session state is managed via cryptographically signed JWT cookies with `HttpOnly`, `SameSite: Lax`, and `Secure` attributes.
2. **Authorization**: Edge Middleware strictly intercepts unauthorized visits to `/admin` and `/rider` before any page rendering occurs.
3. **API Access Control**: Endpoints performing mutations (`/api/restaurants`, `/api/menu-items`, `/api/riders`, `/api/settings`) enforce `requireRole(['ADMIN'])`.
4. **Data Isolation**: Customers can only view their own orders and address records; riders receive only active delivery jobs.
