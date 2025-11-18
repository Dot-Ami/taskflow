# TaskFlow - Cursor Implementation Guide

## 🎯 How to Use This with Cursor

This guide contains **copy-paste prompts** for Cursor to implement TaskFlow systematically.

---

## 📋 Setup Phase

### Step 1: Project Initialization

**Cursor Prompt:**
```
Create a new Next.js 14 project with TypeScript, Tailwind CSS, and App Router.
Use these commands:

npx create-next-app@latest taskflow --typescript --tailwind --app --eslint

Then install these dependencies:
- @prisma/client and prisma
- next-auth
- bcryptjs and @types/bcryptjs
- zod
- react-hook-form and @hookform/resolvers

Show me the exact commands to run.
```

### Step 2: Shadcn Setup

**Cursor Prompt:**
```
Initialize Shadcn UI for this Next.js project and add these components:
- button
- input
- label
- card
- dialog
- select
- badge
- textarea
- calendar
- form

Use the default theme. Show me the commands.
```

### Step 3: Prisma Setup

**Cursor Prompt:**
```
Initialize Prisma with PostgreSQL. Create the schema.prisma file with:

1. User model:
   - id (UUID, primary key)
   - email (unique string)
   - password_hash (string)
   - name (optional string)
   - tasks (relation to Task[])
   - created_at, updated_at (timestamps)
   - Index on email

2. Task model:
   - id (UUID, primary key)
   - user_id (UUID, foreign key to User with cascade delete)
   - title (string, required)
   - description (optional text)
   - status (enum: todo, in_progress, done) default todo
   - priority (enum: low, medium, high, urgent) default medium
   - due_date (optional timestamp)
   - completed_at (optional timestamp)
   - created_at, updated_at (timestamps)
   - Indexes on: user_id, status, due_date

Include the TaskStatus and TaskPriority enums.

Then show me the migration command.
```

### Step 4: Environment Setup

**Cursor Prompt:**
```
Create .env.local and .env.example files with these variables:

DATABASE_URL (PostgreSQL connection string)
NEXTAUTH_SECRET (random 32-char string)
NEXTAUTH_URL (http://localhost:3000)

Also update .gitignore to exclude .env.local
```

---

## 🔐 Authentication Phase (Days 3-4)

### Step 5: NextAuth Configuration

**Cursor Prompt:**
```
Create the NextAuth.js configuration in app/api/auth/[...nextauth]/route.ts

Requirements:
- Use Credentials provider
- Compare passwords with bcrypt
- Look up users from Prisma
- Return user session with id, email, name
- Use JWT strategy
- Include both signin and signup handlers
- Handle errors gracefully

Use TypeScript with proper types for everything.
```

### Step 6: Auth Helper Functions

**Cursor Prompt:**
```
Create lib/auth/session.ts with these helper functions:

1. getServerSession() - Returns current session or null
2. requireAuth() - Throws error if not authenticated  
3. withAuth(handler) - Higher-order function to wrap API routes with auth check

All functions should use NextAuth's getServerSession internally.
Include proper TypeScript types.
```

### Step 7: Registration Page

**Cursor Prompt:**
```
Create app/(auth)/register/page.tsx with a registration form.

Requirements:
- Use Shadcn form components (Input, Label, Button)
- Use react-hook-form with Zod validation
- Validate: email (valid format), password (min 8 chars), name (optional)
- Hash password with bcrypt before sending to API
- POST to /api/auth/signup
- Show loading state during submission
- Display validation errors inline
- Redirect to /tasks after successful registration
- Include "Already have account? Login" link

Use TypeScript. Make it responsive.
```

### Step 8: Login Page

**Cursor Prompt:**
```
Create app/(auth)/login/page.tsx with a login form.

Requirements:
- Use Shadcn form components
- Use react-hook-form with Zod validation
- Validate: email (required), password (required)
- Call NextAuth signIn on submit
- Show loading state during submission
- Display error message if credentials invalid
- Redirect to /tasks after successful login
- Include "Don't have account? Register" link

Use TypeScript. Make it responsive.
```

### Step 9: Auth Middleware

**Cursor Prompt:**
```
Create middleware.ts in the root to protect routes.

Requirements:
- Use NextAuth middleware
- Protect these routes: /dashboard/:path*, /api/tasks/:path*
- Don't protect: /api/auth/:path*
- Redirect to /login if not authenticated

Include proper TypeScript types.
```

---

## 📝 Task CRUD Backend (Days 5-6)

### Step 10: Database Query Functions

**Cursor Prompt:**
```
Create lib/db/queries.ts with these functions:

1. getUserTasks(userId: string, filters?: TaskFilters)
   - Returns all tasks for user
   - Accepts optional filters: status, priority, search
   - Filters on server side
   - Orders by created_at descending

2. createTask(userId: string, data: CreateTaskInput)
   - Creates new task with user_id
   - Returns created task

3. updateTask(taskId: string, userId: string, data: UpdateTaskInput)
   - Updates task only if belongs to user
   - Returns updated task
   - Throws error if not found or not owned

4. deleteTask(taskId: string, userId: string)
   - Deletes task only if belongs to user
   - Returns success message
   - Throws error if not found or not owned

5. getTaskById(taskId: string, userId: string)
   - Returns single task only if belongs to user
   - Throws error if not found or not owned

All functions must filter by user_id for security!
Include proper TypeScript types and error handling.
```

### Step 11: Task Types

**Cursor Prompt:**
```
Create types/task.ts with:

1. TaskStatus enum (todo, in_progress, done)
2. TaskPriority enum (low, medium, high, urgent)
3. Task interface (all fields from Prisma model)
4. CreateTaskInput type (required fields for creation)
5. UpdateTaskInput type (all fields optional for partial update)
6. TaskFilters type (optional status, priority, search)

Also create types/api.ts with:
1. ApiResponse<T> - success response format
2. ApiError - error response format  
3. ApiResult<T> - union type

Use TypeScript strict mode.
```

### Step 12: Zod Validation Schemas

**Cursor Prompt:**
```
Create lib/validation/schemas.ts with Zod schemas:

1. TaskSchema - for validating task input
   - title: required string, min 1, max 200 chars
   - description: optional string
   - status: enum (todo, in_progress, done)
   - priority: enum (low, medium, high, urgent)
   - due_date: optional datetime string

2. TaskFiltersSchema - for validating query params
   - status: optional enum
   - priority: optional enum
   - search: optional string

Use the TaskStatus and TaskPriority enums from types/task.ts
```

### Step 13: Tasks API - List & Create

**Cursor Prompt:**
```
Create app/api/tasks/route.ts with GET and POST handlers.

GET /api/tasks:
- Get user from session (requireAuth)
- Parse query params with TaskFiltersSchema
- Call getUserTasks(userId, filters)
- Return ApiResponse format

POST /api/tasks:
- Get user from session (requireAuth)
- Parse body with TaskSchema
- Call createTask(userId, data)
- Return 201 with ApiResponse format

Both handlers need:
- Proper error handling (try/catch)
- Return ApiError format on failure
- TypeScript types
- Consistent response format

Import types from types/task.ts and types/api.ts
```

### Step 14: Tasks API - Single Task Operations

**Cursor Prompt:**
```
Create app/api/tasks/[id]/route.ts with GET, PUT, DELETE handlers.

All three handlers:
- Extract task ID from params
- Get user from session (requireAuth)
- Include try/catch error handling
- Return ApiResponse or ApiError

GET:
- Call getTaskById(taskId, userId)
- Return 200 with task data

PUT:
- Parse body with TaskSchema (all fields optional)
- Call updateTask(taskId, userId, data)
- Return 200 with updated task

DELETE:
- Call deleteTask(taskId, userId)
- Return 200 with success message

Use TypeScript with proper types.
```

---

## 🎨 Task CRUD Frontend (Day 7)

### Step 15: Task Card Component

**Cursor Prompt:**
```
Create components/tasks/TaskCard.tsx

Display a single task with:
- Shadcn Card component
- Status badge (color-coded: gray/blue/green)
- Priority badge (color-coded: gray/yellow/orange/red)
- Title (bold, truncate if too long)
- Description (gray text, 2 lines max)
- Due date (formatted, red if overdue)
- Edit button (pencil icon)
- Delete button (trash icon, red)

Props: task (Task type), onEdit, onDelete callbacks

Make it responsive. Use Tailwind for styling.
Include proper TypeScript types.
```

### Step 16: Task Form Component

**Cursor Prompt:**
```
Create components/tasks/TaskForm.tsx

Reusable form for creating or editing tasks:
- Use Shadcn form components
- Use react-hook-form with Zod validation (TaskSchema)
- Fields: title, description (textarea), status (select), priority (select), due_date (calendar)
- Submit button (changes text based on mode)
- Cancel button
- Show validation errors inline
- Show loading state during submission

Props: task (optional, for edit mode), onSubmit callback, onCancel callback

If task provided: pre-fill form (edit mode)
If no task: empty form (create mode)

Use TypeScript. Make it responsive.
```

### Step 17: Task List Component

**Cursor Prompt:**
```
Create components/tasks/TaskList.tsx

Display grid of task cards:
- Use TaskCard component for each task
- Responsive grid: 1 col mobile, 2 cols tablet, 3 cols desktop
- Empty state if no tasks ("No tasks yet. Create your first task!")
- Loading state (skeleton cards)
- Handle edit: open task form in modal
- Handle delete: show confirmation dialog, then call API

Props: tasks array, loading boolean, onTaskUpdate callback

Use Shadcn Dialog for modals.
Include proper TypeScript types.
```

### Step 18: Tasks Page

**Cursor Prompt:**
```
Create app/(dashboard)/tasks/page.tsx

Main task list page with:
1. Header with "Add Task" button
2. TaskList component
3. Fetch tasks on mount (GET /api/tasks)
4. Handle create: open TaskForm in modal
5. Handle edit: open TaskForm in modal with task data
6. Handle delete: confirm then call DELETE /api/tasks/[id]
7. Refresh list after any mutation
8. Show loading state while fetching
9. Show error message if fetch fails

Use useState for tasks data and loading state.
Use Shadcn Dialog for create/edit modals.
Include proper TypeScript types and error handling.
```

### Step 19: Dashboard Layout

**Cursor Prompt:**
```
Create app/(dashboard)/layout.tsx

Layout with:
- Header component (top nav bar)
- User email displayed (from session)
- Logout button
- Main content area (children)
- Responsive design

Use getServerSession to get user data.
Make header sticky at top.
Use Tailwind for styling.
```

### Step 20: Header Component

**Cursor Prompt:**
```
Create components/layout/Header.tsx

Top navigation bar with:
- Logo/title ("TaskFlow") on left
- User info on right (email + avatar initials)
- Logout button
- Responsive: hamburger menu on mobile
- Use Shadcn Button component

Include signOut from NextAuth for logout.
Use Tailwind for styling.
TypeScript types for all props.
```

---

## 🔍 Filtering & Search (Days 8-9)

### Step 21: Task Filters Component

**Cursor Prompt:**
```
Create components/tasks/TaskFilters.tsx

Filter bar with:
- Status filter (dropdown: All, Todo, In Progress, Done)
- Priority filter (dropdown: All, Low, Medium, High, Urgent)
- Clear filters button
- Use Shadcn Select components
- Emit onChange callback with selected filters

Props: initialFilters, onChange callback

Use TypeScript. Make it responsive (stack on mobile).
```

### Step 22: Task Search Component

**Cursor Prompt:**
```
Create components/tasks/TaskSearch.tsx

Search input with:
- Shadcn Input component
- Search icon
- Placeholder "Search tasks..."
- Debounce input (300ms delay)
- Emit onChange callback with search term
- Clear button (X icon) when text present

Props: initialSearch, onChange callback

Use useDebounce hook or implement debouncing.
TypeScript types for all props.
```

### Step 23: Update Tasks Page with Filters

**Cursor Prompt:**
```
Update app/(dashboard)/tasks/page.tsx to include filtering and search:

1. Add TaskFilters component above TaskList
2. Add TaskSearch component above TaskList
3. Store filters and search in state
4. Update fetch to include query params: ?status=X&priority=Y&search=Z
5. Refetch when filters or search changes
6. Show "No tasks match your filters" if empty result with active filters

Keep existing create/edit/delete functionality.
Use TypeScript. Handle all edge cases.
```

---

## ✨ Polish Phase (Day 10)

### Step 24: Loading States

**Cursor Prompt:**
```
Add loading states throughout the app:

1. TaskCard skeleton component (gray animated placeholder)
2. TaskList loading state (show 6 skeleton cards)
3. Button loading state (spinner + disabled)
4. Page loading spinner (center of screen)

Use Shadcn Skeleton component if available, otherwise create custom.
Apply to all async operations (fetch, create, update, delete).
```

### Step 25: Error States

**Cursor Prompt:**
```
Add error handling throughout the app:

1. Error boundary component (app/error.tsx)
2. API error display (toast notifications or inline messages)
3. Form validation errors (red text under fields)
4. Network error handling (retry button)
5. 404 page for not found tasks

Use react-hot-toast or Shadcn toast for notifications.
Show user-friendly messages, not technical errors.
```

### Step 26: Empty States

**Cursor Prompt:**
```
Add empty states:

1. No tasks yet (illustration + "Create your first task" CTA)
2. No results from search/filter (different message + clear filters button)
3. No tasks due today (in future feature)

Make them visually appealing and actionable.
Use icons or simple illustrations.
```

### Step 27: Responsive Testing

**Cursor Prompt:**
```
Verify and fix responsive design:

1. Test on mobile (375px): single column, readable text, touch targets 44px+
2. Test on tablet (768px): two columns, adequate spacing
3. Test on desktop (1024px+): three columns, optimal layout
4. Fix any overflow issues
5. Ensure forms are usable on mobile (large enough inputs)
6. Test navigation on mobile (hamburger menu)

Use Tailwind responsive utilities (sm:, md:, lg:, xl:).
Test in browser DevTools responsive mode.
```

---

## 🚀 Deployment Phase (Days 12-13)

### Step 28: Pre-deployment Checklist

**Cursor Prompt:**
```
Prepare for deployment:

1. Verify all environment variables are in .env.example
2. Add production DATABASE_URL format to .env.example
3. Create comprehensive README.md with:
   - Project description
   - Tech stack
   - Setup instructions
   - Environment variables
   - Development commands
   - Deployment instructions
4. Test production build locally: npm run build && npm start
5. Fix any build errors or warnings
6. Ensure TypeScript strict mode passes: npm run type-check
```

### Step 29: Database Migration

**Cursor Prompt:**
```
Create production database:

1. Create Supabase project
2. Get connection string from Supabase dashboard
3. Run migrations on production database:
   - Set DATABASE_URL to production
   - Run: npx prisma migrate deploy
   - Verify tables created in Supabase dashboard
4. Generate Prisma client for production
5. Test connection with Prisma Studio

Document these steps in README.md
```

### Step 30: Vercel Deployment

**Cursor Prompt:**
```
Deploy to Vercel:

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard:
   - DATABASE_URL (from Supabase)
   - NEXTAUTH_SECRET (generate new one for production)
   - NEXTAUTH_URL (your vercel app URL)
4. Set build command: npx prisma generate && next build
5. Deploy
6. Test production deployment
7. Fix any issues

Document deployment URL and any issues encountered.
```

---

## 🧪 Testing Checklist

### Manual Testing Script

**Before considering MVP complete, test:**

**Authentication:**
- [ ] Can register new user
- [ ] Cannot register with existing email
- [ ] Cannot register with weak password
- [ ] Can login with valid credentials
- [ ] Cannot login with invalid credentials
- [ ] Can logout
- [ ] Redirected to /login when accessing /tasks without auth
- [ ] Session persists on page refresh

**Task CRUD:**
- [ ] Can create task with all fields
- [ ] Can create task with only title
- [ ] Cannot create task with empty title
- [ ] Can view list of tasks
- [ ] Only see own tasks (test with 2 accounts)
- [ ] Can edit task
- [ ] Can delete task with confirmation
- [ ] Task list updates after create/edit/delete

**Filters & Search:**
- [ ] Can filter by status (todo, in_progress, done)
- [ ] Can filter by priority
- [ ] Can search by title
- [ ] Can search by description
- [ ] Can combine filters and search
- [ ] Can clear filters
- [ ] "No results" shows when filters match nothing

**UI/UX:**
- [ ] Mobile layout works (test on 375px)
- [ ] Tablet layout works (test on 768px)
- [ ] Desktop layout works (test on 1024px+)
- [ ] Loading states show during async operations
- [ ] Error messages are clear and helpful
- [ ] Empty state shows when no tasks
- [ ] Forms validate before submission
- [ ] Success feedback after actions

**Security:**
- [ ] Cannot access other users' tasks
- [ ] API returns 401 when not authenticated
- [ ] Cannot update/delete tasks that aren't yours
- [ ] Passwords are hashed (check in database)
- [ ] Session cookies are HTTP-only
- [ ] CSRF protection works

---

## 🎓 Pro Tips for Cursor

### When Building Each Feature:

1. **Read the spec carefully** - Don't skip requirements
2. **Start with types** - Define interfaces before implementation
3. **Build incrementally** - One small piece at a time
4. **Test as you go** - Don't wait until the end
5. **Follow conventions** - Use existing patterns in codebase
6. **Ask clarifying questions** - Better to confirm than guess

### Common Mistakes to Avoid:

❌ Forgetting user_id filter in queries
❌ Not validating input on both client and server
❌ Using `any` type instead of proper TypeScript
❌ Inconsistent error response formats
❌ Not handling loading/error states
❌ Skipping mobile responsive design
❌ Not testing authentication flow

### Code Quality Checklist:

Before considering any feature "done":
- [ ] TypeScript compiles without errors
- [ ] No `any` types (use proper types)
- [ ] Includes error handling (try/catch)
- [ ] Includes loading states
- [ ] Includes error states
- [ ] Works on mobile
- [ ] Follows existing code patterns
- [ ] Has proper security checks
- [ ] Tested manually

---

## 📚 Quick Reference

### File Structure Reminder:
```
app/
├── (auth)/         # Login/register pages
├── (dashboard)/    # Protected pages
└── api/            # API endpoints

components/
├── ui/             # Shadcn components
├── tasks/          # Task components
└── layout/         # Layout components

lib/
├── db/             # Database queries
├── auth/           # Auth helpers
└── utils.ts        # Shared utilities

prisma/
└── schema.prisma   # Database schema

types/
├── task.ts         # Task types
├── user.ts         # User types
└── api.ts          # API types
```

### Key Commands:
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run type-check   # Check TypeScript
npx prisma studio    # Open database GUI
npx prisma migrate dev  # Create migration
npx prisma generate  # Generate Prisma client
```

### Environment Variables:
```
DATABASE_URL         # PostgreSQL connection
NEXTAUTH_SECRET      # Auth secret (32+ chars)
NEXTAUTH_URL         # App URL
```

---

## 🎯 Success Criteria

You're done when:

✅ All manual tests pass
✅ TypeScript compiles cleanly
✅ App deployed to production
✅ No critical bugs
✅ Code is documented
✅ README is complete
✅ Alex can demo to employers

**Remember:** This is Alex's career transition project. Quality matters. Build it right. 🚀
