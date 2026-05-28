# Unipedia — College Discovery Platform MVP

A beautiful, high-fidelity full-stack College Discovery Platform inspired by leading portals like **Collegedunia** and **Careers360**. Designed as an internship MVP, it features robust filters, side-by-side matrices, saved portfolios, and lightweight session authentication.

---

## 🚀 Sandbox Architecture

To run seamlessly inside the agent sandbox container while being ready for enterprise deployment to **Next.js + Prisma + Neon PostgreSQL**, this codebase adopts a highly scalable full-stack hybrid architecture:

1. **Development Runtime**: Full-stack Express backend server (`/server.ts`) serving custom JSON REST APIs proxying to a local, persistent database file (`/server/db.json`), layered with Vite Spa middleware serving React frontend components under port `3000`.
2. **Production/Vercel Output**: Standard blueprints directory (`/prisma/schema.prisma`, `/prisma/seed.ts`, `/prisma/nextauth-config.ts`) are completely configured to enable immediate Next.js App Router compilation and Neon PostgreSQL integration.

---

## 📁 Folder Structure Map

```text
├── prisma/
│   ├── schema.prisma          # Database models (User, College, SavedCollege)
│   ├── seed.ts                # Neon PostgreSQL seeder script (16 campuses)
│   └── nextauth-config.ts     # Enterprise NextAuth credentials configuration
├── server/
│   └── db.json                # Local persistent database file (16 verified colleges)
├── src/
│   ├── components/
│   │   ├── AuthModal.tsx      # Dynamic signin/signup overlays
│   │   ├── CollegeCard.tsx    # Campaign cards displaying ROI placements & fees
│   │   ├── CompareTable.tsx   # Side-by-side comparison spreadsheet matrix
│   │   ├── EmptyState.tsx     # Responsive search-filters error fallback
│   │   ├── FilterSidebar.tsx  # Interactive city, rating, and fees refinement
│   │   ├── Footer.tsx         # Minimal footer container
│   │   ├── LoadingSkeleton.tsx# Shimmer animations during loading
│   │   ├── Navbar.tsx         # Sticky header with active shortlisted counters
│   │   └── Pagination.tsx     # Clean index numbering controls
│   ├── context/
│   │   └── AuthContext.tsx    # Stateful authorization context
│   ├── pages/
│   │   ├── ExplorePage.tsx    # College Directory exploration home
│   │   ├── DetailPage.tsx     # Profiler overlay (overview, courses, placements)
│   │   ├── ComparePage.tsx    # Dedicated multi-college analyst
│   │   └── SavedPage.tsx      # Shortlisted bookmarks portfolio dashboard
│   ├── types.ts               # Shared TypeScript schemas
│   ├── App.tsx                # Context wrapper & top-level view router
│   ├── index.css              # Global Tailwind v4 style injections
│   └── main.tsx               # Client bootstrap anchor
├── index.html                 # Main browser page entry Point
├── package.json               # Full-stack compiling scripts
├── server.ts                  # REST API middleware proxy & Static Asset Server
└── tsconfig.json              # TypeScript compilation rules
```

---

## 📡 REST Api endpoints (Express/Vite)

- **`GET /api/colleges`**: Fetches colleges matching search queries, location tags, tuition bands, minimum NIRF reviews, and public/private filters.
- **`GET /api/colleges/:slug`**: Fetches a single college's profile dataset.
- **`GET /api/compare?slugs=sl1,sl2`**: Resolves multiple colleges side-by-side.
- **`POST /api/auth/signup`**: Registers a secure candidate profile.
- **`POST /api/auth/login`**: Authenticates credentials and issues safe localStorage session tokens.
- **`GET /api/auth/me`**: Performs session checks against authorization bearer headers.
- **`GET /api/saved-colleges`**: Fetches user-specific favorited institutions.
- **`POST /api/saved-colleges/toggle`**: Atomically saves/removes colleges in user bookmark collection.

---

## ⚡ Next.js / Neon.tech Production Migration Guide

When you export this platform to a full-stack Next.js production server, follow these steps to deploy to Vercel and map to Neon PostgreSQL:

### 1. Provision Neon PostgreSQL
- Sign up at [Neon.tech](https://neon.tech) and create a new project.
- Copy your pooled **PostgreSQL Connection String** from the dashboard.

### 2. Configure Environment Variables
Inside your Next.js `.env` variables list, set the following keys:
```env
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/neondb?sslmode=require"
NEXTAUTH_SECRET="your-generated-jwt-secret-string"
NEXTAUTH_URL="https://your-domain.vercel.app"
```

### 3. Deploy Database Migrations & Seeds
Run the following commands in your shell to map database models and seed them:
```bash
# Push database schemas to Neon
npx prisma db push

# Seeding Initial 16 Elite Indian Campuses
npx tsx prisma/seed.ts
```

### 4. Deploy to Vercel
1. Connect your Github repository to [Vercel](https://vercel.com).
2. Add your environment variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, etc.) inside Vercel Dashboard Settings.
3. Vercel automatically detects the Next.js setup, runs `npm run build`, and serves the platform.
