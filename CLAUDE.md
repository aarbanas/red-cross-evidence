# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

### Prerequisites

- Node.js 20+
- Yarn 1.22.22 (pinned in package.json)
- Docker (for running PostgreSQL database)

### Initial Setup

```bash
# Copy environment configuration
cp .env.example .env

# Start PostgreSQL database via Docker
docker-compose up -d

# Install dependencies
yarn install

# Run database migrations
yarn db:migrate

# Seed initial data (optional)
yarn db:seed:all
```

### Development Server

```bash
yarn dev
```

Runs Next.js in turbo mode at `http://localhost:3000`. HMR enabled with database connection caching in development.

## Essential Commands

### Development

- `yarn dev` - Start Next.js dev server with Turbo bundler
- `yarn build` - Build for production
- `yarn start` - Run production server
- `yarn lint` - Run ESLint with Next.js config
- `yarn lint:test` - Run ESLint on all files ignoring .gitignore
- `yarn prettier:check` - Check code formatting
- `yarn prettier:write` - Auto-format all files

### Database

- `yarn db:migrate` - Run pending Drizzle migrations
- `yarn db:push` - Push schema changes to database (alternative to migrate)
- `yarn db:generate` - Generate migration files from schema changes
- `yarn db:studio` - Open Drizzle Studio UI for database inspection
- `yarn db:seed:all` - Run all seed scripts (users, licenses, educations, terms)
- `yarn db:seed:users` - Seed sample users with ADMIN_PASSWORD from .env
- `yarn db:seed:licenses` - Seed sample licenses
- `yarn db:seed:educations` - Seed education programs
- `yarn db:seed:educationTerms` - Seed education terms/sessions
- `yarn db:schema:generate` - Generate ERD diagram (schema.dbml → erd.svg)

### Quality Checks

- Pre-commit hooks via Husky enforce: prettier check, lint
- GitHub PR workflow runs: lint, prettier check on all PRs

## Tech Stack

### Framework & Runtime

- **Next.js 15.2** - Full-stack React framework with App Router
- **React 19** - UI components with Server Components support
- **TypeScript 5.8** - Type-safe JavaScript

### API & Data

- **tRPC 11** - End-to-end type-safe APIs (query + mutations)
- **Drizzle ORM 0.41** - Type-safe SQL ORM for PostgreSQL
- **PostgreSQL** - Primary relational database
- **TanStack React Query 5** - Client-side data fetching & caching
- **Zod** - Schema validation (used in tRPC, env, forms)

### Authentication & Authorization

- **NextAuth.js 5 (beta)** - Session management via credentials + drizzle adapter
- **Bcrypt** - Password hashing (5.1.1)
- Route protection at tRPC procedure level via `protectedProcedure` middleware

### UI & Styling

- **Tailwind CSS 4** - Utility-first CSS with @tailwindcss/postcss
- **Radix UI** - Headless accessible components (dialog, label, popover, slot, switch)
- **Geist Font** - System font stack
- **Lucide React** - Icon library (474 icons)
- **class-variance-authority** - Component variant patterns
- **tailwindcss-animate** - Animation utilities
- **react-hook-form** - Form state management with minimal re-renders
- **react-toastify** - Toast notifications

### Build & Tools

- **Babel React Compiler** - Experimental compiler for optimized rendering (beta)
- **Husky** - Git hooks for quality checks
- **ESLint 9** - Linting with TypeScript support
- **Prettier 3.5** - Code formatting with Tailwind plugin
- **Drizzle Kit** - ORM migrations & schema tools
- **tsx** - TypeScript execution for seed scripts

### Date & Utilities

- **date-fns 4** - Date manipulation
- **moment 2.30** - Legacy date handling (coexists with date-fns)
- **react-datepicker** - Calendar UI component
- **react-day-picker** - Headless day picker
- **superjson** - JSON serialization for complex types (tRPC transformer)
- **server-only** - Ensures server-only imports
- **@uidotdev/usehooks** - React hooks utilities

### Rate Limiting & Monitoring

- **@upstash/ratelimit** - Sliding window rate limiter (optional, controlled via env)
- Rate limiter: 10 requests per 10 seconds when enabled

### T3 Stack

Bootstrapped with [create-t3-app v7.40.0](https://create.t3.gg/)

## Architecture & Data Flow

### App Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (pages)/                  # Route group for authenticated pages
│   │   ├── users/                # User management pages
│   │   ├── licenses/             # License (Licence) management pages
│   │   └── educations/           # Education & education terms pages
│   └── api/
│       ├── auth/[...nextauth]/   # NextAuth.js handler
│       └── trpc/[trpc].ts        # tRPC HTTP endpoint
├── server/
│   ├── api/                      # tRPC backend
│   │   ├── routers/              # Feature routers (user, license, education, etc)
│   │   ├── schema/               # Zod schemas for input validation
│   │   ├── trpc.ts               # tRPC context, procedures, middleware
│   │   └── root.ts               # Router composition
│   ├── auth/                     # NextAuth.js config & handlers
│   │   ├── config.ts             # Authentication strategies & callbacks
│   │   └── index.ts              # Auth exports (auth, handlers, signIn, signOut)
│   ├── db/                       # Database layer
│   │   ├── index.ts              # Drizzle ORM instance (with connection pooling)
│   │   ├── schema/               # Table definitions & relations (user, license, education, auth)
│   │   ├── seed/                 # Seed data scripts
│   │   ├── utility/              # DB helpers & type utilities
│   │   └── dbml-generator/       # ERD diagram generator
│   ├── services/                 # Business logic layer (service pattern)
│   └── utils/                    # Server utilities
├── trpc/                         # tRPC client helpers
│   ├── server.ts                 # Server-side tRPC caller factory
│   ├── react.tsx                 # React hooks (useQuery, useMutation via React Query)
│   └── query-client.ts           # TanStack Query client config
├── components/                   # React components
│   ├── atoms/                    # Reusable UI primitives (Button, Input, Card, etc)
│   ├── organisms/                # Complex feature components (Tables, Forms, etc)
│   ├── layout/                   # Layout wrappers
│   └── utils/                    # Component utilities
├── hooks/                        # Custom React hooks
├── styles/                       # Global CSS & SCSS
└── env.js                        # Environment variable validation (t3-env)
```

### Data Flow: Typical User/License CRUD

1. **Frontend Page** (e.g., `/users` - RSC with client boundaries)
   - Fetches data via `trpc.user.find()` using TanStack React Query
   - Renders table/list with inline client component for interactions

2. **Client Component** (e.g., UserForm)
   - Form state via `react-hook-form`
   - Input validation via `Zod` schema
   - Mutation via `trpc.user.create()`
   - Shows toast feedback via `react-toastify`

3. **tRPC Procedure** (routers/user.ts)
   - `protectedProcedure` checks session & rate limit
   - Validates input against Zod schema
   - Calls service layer for business logic
   - Returns type-safe result to client

4. **Service Layer** (services/user/user.service.ts)
   - Executes database queries via Drizzle ORM
   - Handles data transformations & relationships
   - Returns raw results to router

5. **Database** (Drizzle ORM)
   - Schema-driven TypeScript interfaces
   - Relations defined via `relations()` helpers
   - Migrations tracked in `/drizzle` folder

### Key Design Patterns

**tRPC Procedures & Middleware**

- `publicProcedure` - No authentication required
- `protectedProcedure` - Requires valid session, includes rate limiting
- Session data passed via `ctx.session` (from NextAuth)
- Zod validation at procedure input boundary

**Environment Validation**

- `src/env.js` uses `@t3-oss/env-nextjs` to validate all env vars
- Schema enforces types and defaults (e.g., `NODE_ENV`, `DATABASE_URL`, rate limiter settings)
- Build fails if validation errors (skippable via `SKIP_ENV_VALIDATION`)

**Database Transactions & Relationships**

- Drizzle relations defined alongside table schemas
- M-to-M relationships use junction tables with composite PKs (e.g., `profile_licence`, `profile_language`)
- Cascade deletes configured on foreign keys

**Authentication Flow**

- NextAuth.js credentials provider + Drizzle adapter
- Session cached via React `cache()` wrapper to avoid re-auth per request
- Routes redirect unauthenticated users to sign-in

### Database Schema Overview

**Core Tables**

- `user` - Authentication credentials (email, password hash, active flag)
- `profile` - Extended user data (firstName, lastName, OIB, phone, nationality, etc)
- `address` - Physical addresses with type enum (permanent_residence, temporary_residence, work, other)
- `city` & `country` - Location hierarchy
- `work_status` - Employment/education status with profession & institution
- `language` - Available languages (many-to-many via `profile_language`)
- `profile_size` - Physical measurements (shoe size, clothing size, height, weight)
- `license` - Certification/license types
- `profile_licence` - M-to-M between profiles & licenses
- `education` - Training programs with type enum (Volunteers, Public, Employee)
- `education_term` - Specific education sessions with dates & location
- `profile_education_term` - M-to-M enrollment tracking

**Enums (PostgreSQL)**

- `sexenum` - M, F, O
- `clothingsize` - XS, S, M, L, XL, XXL
- `workstatus` - EMPLOYED, UNEMPLOYED, SELF_EMPLOYED, STUDENT, PUPIL, RETIRED
- `educationlevel` - PRIMARY, SECONDARY, COLLEGE, BACHELOR, MASTER, DOCTORATE, POST_DOCTORATE
- `languagelevel` - A1, A2, B1, B2, C1, C2 (CEFR levels)
- `addresstype` - permanent_residence, temporary_residence, work, other
- `educationtypeenum` - Volunteers, Public, Employee

## File Conventions & Patterns

### Service Layer

- Services handle database queries and business logic
- Located at `src/server/services/[domain]/[entity].service.ts`
- Imported and called from tRPC routers
- Example: `userService.find(input)` returns array of users

### tRPC Routers

- One file per domain (user.ts, license.ts, education.ts, etc)
- Composed in `root.ts` and exported as `appRouter`
- Input validation via `z.object({...})` schemas
- Return type automatically inferred from resolver

### React Components

- Atoms: Bare UI primitives from Radix + Tailwind
- Organisms: Feature-specific complex components (usually with client-side state)
- Pages: Server components by default, use `"use client"` boundary at organism level
- Forms: Use `react-hook-form` with Zod validation

### Environment Variables

- Server-only: DATABASE*URL, NEXTAUTH_SECRET, ADMIN_PASSWORD, RATE_LIMITER_ENABLED, UPSTASH_REDIS*\*
- Optional: RATE*LIMITER_ENABLED, NEXTAUTH_SECRET (in dev), UPSTASH_REDIS*\* (only if rate limiting enabled)
- Validated at startup (build fails on missing required vars)

## Known Quirks & Considerations

- **moment.js coexists with date-fns** - Both libraries present; prefer date-fns for new code (more modern, tree-shakeable)
- **React Compiler is experimental** - Beta feature enabled in next.config.js; may require debugging if optimization issues arise
- **NextAuth.js v5 beta** - API may change; check compatibility before major version upgrades
- **Server-only imports** - Use `server-only` package to prevent accidental client-side imports of DB/auth code
- **Database connection pooling** - Handled in dev via global cache; connection reused across HMR updates
- **Drizzle strict mode** - Enabled in drizzle.config.ts; catches schema issues early
- **Composite indices** - Used for common queries (e.g., `idx_created_at_uuid` on users)

## Code Style

### Empty lines after control flow blocks

Always add one empty line after closing `}` of `if`, `else if`, and `else` blocks before the next statement. This applies everywhere — functions, components, API handlers, etc.

✅ Correct:

```typescript
if (foo) {
  doSomething();
}

const bar = 10;
```

❌ Wrong:

```typescript
if (foo) {
  doSomething();
}
const bar = 10;
```

This rule applies even when the next line is a return, throw, another if, or any other statement.
