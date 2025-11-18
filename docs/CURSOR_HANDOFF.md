# TaskFlow - Cursor AI Handoff Package

## 🎯 What You're Building

TaskFlow is a **full-stack CRUD task management application** - the first portfolio project for Alex Matthews (construction → software developer transition). This isn't just another todo app; it's a career catalyst that proves he can ship production-quality code.

**Mission:** Build a complete, deployable MVP in 2 weeks that showcases systematic thinking and clean architecture.

---

## 📋 Quick Reference Card

### Tech Stack (LOCKED IN - Don't Suggest Alternatives)
- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Shadcn/ui
- **Backend:** Next.js API Routes + NextAuth.js + Prisma
- **Database:** PostgreSQL (via Supabase)
- **Deployment:** Vercel (frontend/API) + Supabase (database)
- **Validation:** Zod schemas (client + server)

### Timeline
- **Week 1:** Auth + Task CRUD
- **Week 2:** Filters/search + Polish + Deploy
- **Total:** 14 days to production

### MVP Scope (P0 Features Only)
✅ User registration/login/logout
✅ Create, read, update, delete tasks
✅ Task fields: title, description, status, priority, due_date
✅ Responsive design (mobile + desktop)
✅ Deployed to production

❌ OUT OF SCOPE: Teams, real-time sync, mobile apps, integrations, complex features

---

## 🗂️ File Structure Blueprint

```
taskflow/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx           # Centered layout, no nav
│   │   ├── login/page.tsx       # Login form
│   │   └── register/page.tsx    # Registration form
│   ├── (dashboard)/
│   │   ├── layout.tsx           # Layout with Header
│   │   └── tasks/
│   │       └── page.tsx         # Main task list view
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts  # NextAuth handler
│   │   └── tasks/
│   │       ├── route.ts         # GET (list) & POST (create)
│   │       └── [id]/route.ts    # GET, PUT, DELETE single task
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   └── error.tsx                # Error boundary
├── components/
│   ├── ui/                      # Shadcn components (button, input, card, etc.)
│   ├── tasks/
│   │   ├── TaskCard.tsx         # Display single task
│   │   ├── TaskForm.tsx         # Create/edit form (reusable)
│   │   ├── TaskList.tsx         # Grid of TaskCards
│   │   ├── TaskFilters.tsx      # Filter bar (Week 2)
│   │   └── TaskSearch.tsx       # Search (Week 2)
│   └── layout/
│       ├── Header.tsx           # Top navigation
│       └── Sidebar.tsx          # Optional sidebar
├── lib/
│   ├── db/
│   │   ├── prisma.ts            # PrismaClient singleton
│   │   └── queries.ts           # Database query functions
│   ├── auth/
│   │   └── session.ts           # Auth helper functions
│   └── utils.ts                 # Shared utilities
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
├── types/
│   ├── task.ts                  # Task types & enums
│   ├── user.ts                  # User types
│   └── api.ts                   # API response types
├── .env.local                   # Environment variables (gitignored)
├── .env.example                 # Environment template (committed)
├── next.config.js
├── tsconfig.json
├── tailwind.config.ts
├── package.json
└── README.md
```

---

## 🗄️ Database Schema (PostgreSQL + Prisma)

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String   @id @default(uuid())
  email         String   @unique
  password_hash String
  name          String?
  tasks         Task[]
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt

  @@index([email])
}

model Task {
  id           String    @id @default(uuid())
  user_id      String
  user         User      @relation(fields: [user_id], references: [id], onDelete: Cascade)
  title        String
  description  String?   @db.Text
  status       TaskStatus @default(todo)
  priority     TaskPriority @default(medium)
  due_date     DateTime?
  completed_at DateTime?
  created_at   DateTime  @default(now())
  updated_at   DateTime  @updatedAt

  @@index([user_id])
  @@index([status])
  @@index([due_date])
}

enum TaskStatus {
  todo
  in_progress
  done
}

enum TaskPriority {
  low
  medium
  high
  urgent
}
```

**Key Points:**
- User → Task: one-to-many relationship
- Cascade delete: deleting user removes all their tasks
- Indexes on: user_id, status, due_date, email
- Hard delete only (no soft delete in MVP)

---

## 🔌 API Specification

### Authentication Endpoints (NextAuth.js)
- `POST /api/auth/signin` - Login
- `POST /api/auth/signup` - Register (custom endpoint)
- `POST /api/auth/signout` - Logout
- `GET /api/auth/session` - Get current session

### Task Endpoints

**List Tasks**
```typescript
GET /api/tasks?status=done&priority=high&search=keyword

Response:
{
  success: true,
  data: [
    {
      id: "uuid",
      user_id: "uuid",
      title: "Build TaskFlow",
      description: "Complete MVP in 2 weeks",
      status: "in_progress",
      priority: "high",
      due_date: "2024-11-05T00:00:00Z",
      completed_at: null,
      created_at: "2024-10-22T10:00:00Z",
      updated_at: "2024-10-22T10:00:00Z"
    }
  ]
}
```

**Create Task**
```typescript
POST /api/tasks
Body: {
  title: string (required, max 200 chars),
  description?: string,
  status: "todo" | "in_progress" | "done",
  priority: "low" | "medium" | "high" | "urgent",
  due_date?: ISO timestamp
}

Response:
{
  success: true,
  data: { /* task object */ }
}
```

**Get Single Task**
```typescript
GET /api/tasks/[id]

Response:
{
  success: true,
  data: { /* task object */ }
}
```

**Update Task**
```typescript
PUT /api/tasks/[id]
Body: { /* same as POST, all fields optional */ }

Response:
{
  success: true,
  data: { /* updated task object */ }
}
```

**Delete Task**
```typescript
DELETE /api/tasks/[id]

Response:
{
  success: true,
  data: { message: "Task deleted" }
}
```

### Error Responses (Standard Format)
```typescript
{
  success: false,
  error: {
    code: "ERROR_CODE",      // VALIDATION_ERROR, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, INTERNAL_ERROR
    message: "Human-readable message",
    details?: object         // Optional extra context
  }
}
```

---

## 🔒 Security Requirements (CRITICAL)

### 1. Password Hashing
```typescript
// NEVER store plain passwords
import bcrypt from 'bcryptjs';

// Registration
const password_hash = await bcrypt.hash(password, 10);

// Login
const isValid = await bcrypt.compare(password, user.password_hash);
```

### 2. User Data Isolation
```typescript
// ❌ WRONG - Shows ALL users' tasks
const tasks = await prisma.task.findMany();

// ✅ CORRECT - Shows only logged-in user's tasks
const tasks = await prisma.task.findMany({
  where: { user_id: session.user.id }
});
```

**EVERY database query MUST filter by user_id!**

### 3. Input Validation (Zod)
```typescript
// Define schema
const TaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  due_date: z.string().datetime().optional()
});

// Validate before using
const validatedData = TaskSchema.parse(userInput); // Throws if invalid
```

### 4. Authentication Checks
```typescript
// In API routes
const session = await getServerSession(authOptions);
if (!session) {
  return new Response(JSON.stringify({
    success: false,
    error: { code: "UNAUTHORIZED", message: "Not authenticated" }
  }), { status: 401 });
}
```

### 5. Protected Routes
```typescript
// middleware.ts
export { default } from "next-auth/middleware";
export const config = {
  matcher: ["/dashboard/:path*", "/api/tasks/:path*"]
};
```

---

## 📝 TypeScript Types

```typescript
// types/task.ts
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: Date;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: Date;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: Date;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
}

// types/api.ts
export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResult<T> = ApiResponse<T> | ApiError;
```

---

## 🎨 UI/UX Requirements

### Responsive Design
- **Mobile:** Single column, hamburger menu
- **Tablet:** 2-column grid
- **Desktop:** 3-column grid

### Task Card Design
```
┌─────────────────────────────────┐
│ [Priority Badge] [Status Badge] │
│                                  │
│ Task Title                       │
│ Brief description...             │
│                                  │
│ Due: Oct 25, 2024               │
│ [Edit] [Delete]                 │
└─────────────────────────────────┘
```

### Color Scheme
- **Status Colors:**
  - todo: gray
  - in_progress: blue
  - done: green
  
- **Priority Colors:**
  - low: gray
  - medium: yellow
  - high: orange
  - urgent: red

### Components to Use (Shadcn)
- Button (primary, secondary, destructive variants)
- Input (text, email, password)
- Textarea (description)
- Select (status, priority dropdowns)
- Badge (status, priority indicators)
- Card (task container)
- Dialog (task form modal)
- Calendar (due date picker)

---

## 🚀 Development Workflow

### Initial Setup Commands
```bash
# Create Next.js project
npx create-next-app@latest taskflow --typescript --tailwind --app

# Install dependencies
npm install @prisma/client prisma next-auth bcryptjs zod
npm install -D @types/bcryptjs

# Initialize Prisma
npx prisma init

# Install Shadcn
npx shadcn-ui@latest init

# Add Shadcn components
npx shadcn-ui@latest add button input label card dialog select badge textarea calendar
```

### Environment Variables (.env.local)
```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/taskflow"

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

### Database Commands
```bash
# Create migration
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Open Prisma Studio (database GUI)
npx prisma studio

# Deploy migrations (production)
npx prisma migrate deploy
```

### Git Workflow
```bash
# Commit frequently
git add .
git commit -m "feat: implement task creation API"

# Push to trigger Vercel deploy
git push origin main
```

---

## 📅 Week-by-Week Implementation Plan

### Week 1: Foundation + Core CRUD

**Day 1-2: Project Setup**
- [ ] Initialize Next.js project
- [ ] Install all dependencies
- [ ] Set up Prisma schema
- [ ] Create database migrations
- [ ] Configure environment variables
- [ ] Set up folder structure

**Day 3-4: Authentication**
- [ ] Configure NextAuth.js
- [ ] Create User model
- [ ] Build registration page/form
- [ ] Build login page/form
- [ ] Implement password hashing
- [ ] Set up protected route middleware
- [ ] Test auth flow

**Day 5-6: Task CRUD Backend**
- [ ] Create Task model
- [ ] Build `/lib/db/queries.ts` functions
- [ ] Create `/api/tasks` endpoint (GET, POST)
- [ ] Create `/api/tasks/[id]` endpoint (GET, PUT, DELETE)
- [ ] Implement Zod validation
- [ ] Add user_id filtering
- [ ] Test with Thunder Client/Postman

**Day 7: Task CRUD Frontend**
- [ ] Create TaskCard component
- [ ] Create TaskForm component
- [ ] Create TaskList component
- [ ] Build `/tasks` page
- [ ] Implement create task flow
- [ ] Implement edit task flow
- [ ] Implement delete task flow
- [ ] Test complete CRUD cycle

### Week 2: Features + Polish + Deploy

**Day 8-9: Filtering & Search**
- [ ] Add query params to GET /api/tasks
- [ ] Build TaskFilters component
- [ ] Build TaskSearch component
- [ ] Implement filter by status
- [ ] Implement filter by priority
- [ ] Implement search by title/description
- [ ] Add debouncing to search

**Day 10: Polish & Responsiveness**
- [ ] Test mobile layout
- [ ] Test tablet layout
- [ ] Test desktop layout
- [ ] Add loading states
- [ ] Add error states
- [ ] Add empty states
- [ ] Improve form validation messages
- [ ] Add success toast notifications

**Day 11: Testing**
- [ ] Manual test all CRUD operations
- [ ] Test auth flow (register, login, logout)
- [ ] Test protected routes
- [ ] Test filters and search
- [ ] Test responsive design
- [ ] Test error handling
- [ ] Fix any bugs found

**Day 12-13: Deployment**
- [ ] Create Supabase project
- [ ] Get DATABASE_URL from Supabase
- [ ] Run migrations on production database
- [ ] Create Vercel project
- [ ] Connect GitHub repo
- [ ] Set environment variables in Vercel
- [ ] Deploy to production
- [ ] Test production deployment
- [ ] Fix any deployment issues

**Day 14: Documentation**
- [ ] Write comprehensive README
- [ ] Document API endpoints
- [ ] Add setup instructions
- [ ] Take screenshots for portfolio
- [ ] Write project summary for resume
- [ ] Celebrate! 🎉

---

## 🎯 Implementation Guidelines for Cursor

### When Building Each Feature:

1. **Start with Types**
   - Define TypeScript interfaces first
   - Create Zod schemas for validation
   - Export types for reuse

2. **Build Backend First**
   - Create database queries in `/lib/db/queries.ts`
   - Build API endpoint with validation
   - Test with Postman/Thunder Client
   - Ensure user_id filtering works

3. **Then Build Frontend**
   - Create reusable components
   - Use Shadcn UI components
   - Implement form with react-hook-form + Zod
   - Connect to API endpoints
   - Add loading/error states

4. **Always Include:**
   - TypeScript types (no `any`)
   - Error handling (try/catch)
   - Input validation (Zod)
   - User authentication checks
   - Proper HTTP status codes
   - Consistent API response format

### Code Quality Standards:

**TypeScript:**
```typescript
// ✅ GOOD - Explicit types
interface CreateTaskProps {
  userId: string;
  data: CreateTaskInput;
}

async function createTask({ userId, data }: CreateTaskProps): Promise<Task> {
  // ...
}

// ❌ BAD - Implicit any
async function createTask(userId, data) {
  // ...
}
```

**Error Handling:**
```typescript
// ✅ GOOD
try {
  const task = await prisma.task.create({ data });
  return { success: true, data: task };
} catch (error) {
  console.error("Task creation failed:", error);
  return {
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "Failed to create task"
    }
  };
}

// ❌ BAD - No error handling
const task = await prisma.task.create({ data });
return task;
```

**User Data Filtering:**
```typescript
// ✅ GOOD - Always filter by user_id
const tasks = await prisma.task.findMany({
  where: {
    user_id: session.user.id,
    status: filters.status
  }
});

// ❌ BAD - Missing user_id filter (SECURITY ISSUE!)
const tasks = await prisma.task.findMany({
  where: { status: filters.status }
});
```

---

## 🚨 Common Pitfalls to Avoid

1. **Security Issues:**
   - ❌ Forgetting to filter queries by user_id
   - ❌ Storing plain text passwords
   - ❌ Missing authentication checks
   - ❌ No input validation

2. **TypeScript Issues:**
   - ❌ Using `any` type
   - ❌ Ignoring type errors
   - ❌ Not defining interfaces

3. **Architecture Issues:**
   - ❌ Business logic in components
   - ❌ Duplicate code
   - ❌ Not using reusable components
   - ❌ Inconsistent error handling

4. **Process Issues:**
   - ❌ Building features out of scope
   - ❌ Over-engineering solutions
   - ❌ Not testing as you go
   - ❌ Skipping documentation

---

## 🤖 How to Work with Cursor

### Effective Prompts:

**Good Prompts:**
```
"Create the TaskCard component that displays a single task with title, 
description, status badge, priority badge, and edit/delete buttons. 
Use Shadcn Card, Badge, and Button components. Make it responsive."

"Build the POST /api/tasks endpoint with:
- NextAuth session check
- Zod validation for title, status, priority
- user_id from session
- Return standardized ApiResponse format
- Include error handling"

"Implement the task filter functionality that filters by status and 
priority on the server side. Update the GET /api/tasks endpoint to 
accept query params and modify the Prisma query."
```

**Less Effective Prompts:**
```
"Make a task component"
"Add filtering"
"Build the backend"
```

### When You Get Stuck:

1. **Check the architecture diagrams** (provided in handoff)
2. **Reference this document** for exact specifications
3. **Look at similar implementations** in the codebase
4. **Ask specific questions** with context
5. **Test in isolation** - does the API work without the frontend?

### Testing Checklist (Before Moving On):

- [ ] TypeScript compiles without errors
- [ ] No console errors in browser
- [ ] Feature works in development
- [ ] All CRUD operations work
- [ ] Authentication is enforced
- [ ] Error messages are clear
- [ ] Mobile responsive

---

## 📚 Additional Resources

### Documentation Links:
- Next.js 14: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- NextAuth.js: https://next-auth.js.org
- Shadcn UI: https://ui.shadcn.com
- Zod: https://zod.dev
- TypeScript: https://www.typescriptlang.org/docs

### Key Concepts to Understand:
- **App Router** (Next.js 14) vs Pages Router
- **Server Components** vs Client Components
- **API Routes** as serverless functions
- **Prisma ORM** for database queries
- **JWT tokens** for authentication
- **Middleware** for route protection

---

## ✅ Definition of Done (MVP Complete)

TaskFlow MVP is complete when:

- [ ] User can register a new account
- [ ] User can log in with email/password
- [ ] User can log out
- [ ] User can create a new task
- [ ] User can view all their tasks
- [ ] User can edit a task
- [ ] User can delete a task
- [ ] User can filter tasks by status/priority
- [ ] User can search tasks by title
- [ ] UI is responsive (mobile, tablet, desktop)
- [ ] No critical bugs
- [ ] Deployed to production (Vercel + Supabase)
- [ ] README has setup instructions
- [ ] All environment variables documented

---

## 🎓 Teaching Philosophy

When implementing features, remember:

1. **Why over How:** Understand WHY this architecture choice was made
2. **Build Simply:** Start with the simplest solution that works
3. **Ship Fast:** MVP in 2 weeks, iterate later
4. **Quality Matters:** Production-grade code, not prototype code
5. **Document Decisions:** Update docs when making architectural choices

**Alex's Philosophy:** "The most interesting solutions emerge when systems are free to discover themselves."

Translation: Start simple, let complexity emerge naturally through iteration. Don't over-engineer upfront.

---

## 📦 Success Metrics

You'll know you've succeeded when:

✅ Alex can demo TaskFlow to potential employers
✅ All core features work reliably
✅ Code is clean, typed, and documented
✅ Application is deployed and accessible
✅ Alex understands every line of code
✅ Alex can explain architectural decisions in interviews

This isn't just code - it's Alex's career transition catalyst. Build it right. 🚀
