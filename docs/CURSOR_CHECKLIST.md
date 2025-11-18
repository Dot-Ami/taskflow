# TaskFlow - Cursor Quick Start Checklist

## 📋 Day-by-Day Implementation Checklist

Use this as your roadmap. Check off each item as you complete it.

---

## 🛠️ Setup Phase (Days 1-2)

### Day 1: Project Foundation

- [ ] **Initialize Next.js Project**
  - Create Next.js 14 app with TypeScript, Tailwind, App Router
  - Verify dev server runs (`npm run dev`)

- [ ] **Install Dependencies**
  - Install: @prisma/client, prisma, next-auth, bcryptjs, @types/bcryptjs, zod, react-hook-form, @hookform/resolvers
  - Verify all packages in package.json

- [ ] **Setup Shadcn UI**
  - Initialize shadcn
  - Install components: button, input, label, card, dialog, select, badge, textarea, calendar, form
  - Verify components in components/ui/

- [ ] **Create Folder Structure**
  ```
  app/
    (auth)/
    (dashboard)/
    api/
  components/
    ui/
    tasks/
    layout/
  lib/
    db/
    auth/
  prisma/
  types/
  ```

### Day 2: Database Setup

- [ ] **Initialize Prisma**
  - Run `npx prisma init`
  - Verify prisma/ folder created

- [ ] **Create Database Schema**
  - Define User model (id, email, password_hash, name, created_at, updated_at)
  - Define Task model (id, user_id, title, description, status, priority, due_date, completed_at, created_at, updated_at)
  - Define TaskStatus enum (todo, in_progress, done)
  - Define TaskPriority enum (low, medium, high, urgent)
  - Add indexes (user_id, status, due_date, email)

- [ ] **Create Migration**
  - Set DATABASE_URL in .env.local
  - Run `npx prisma migrate dev --name init`
  - Verify migration created in prisma/migrations/

- [ ] **Generate Prisma Client**
  - Run `npx prisma generate`
  - Verify @prisma/client generated

- [ ] **Environment Setup**
  - Create .env.local with DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
  - Create .env.example (template without real values)
  - Update .gitignore to exclude .env.local

**Day 1-2 Done When:** Project structure exists, database schema defined, migrations created, dev server runs.

---

## 🔐 Authentication Phase (Days 3-4)

### Day 3: Auth Backend

- [ ] **Create Auth Types**
  - types/user.ts: User interface, Session interface

- [ ] **Configure NextAuth**
  - app/api/auth/[...nextauth]/route.ts
  - Credentials provider with email/password
  - JWT strategy
  - Custom signup endpoint
  - Session callback returning user data
  - Error handling

- [ ] **Create Auth Helpers**
  - lib/auth/session.ts:
    - getServerSession()
    - requireAuth()
    - withAuth(handler)

- [ ] **Create Middleware**
  - middleware.ts protecting /dashboard/* and /api/tasks/*
  - Using NextAuth middleware

- [ ] **Test Auth Backend**
  - Test signup endpoint with Postman
  - Test signin endpoint with Postman
  - Verify JWT token generated
  - Verify session works

### Day 4: Auth Frontend

- [ ] **Create Auth Layout**
  - app/(auth)/layout.tsx (centered, no navigation)

- [ ] **Create Registration Page**
  - app/(auth)/register/page.tsx
  - Form with email, password, name
  - Zod validation
  - Bcrypt password hashing
  - Call signup API
  - Redirect to /tasks on success
  - Link to login page

- [ ] **Create Login Page**
  - app/(auth)/login/page.tsx
  - Form with email, password
  - Zod validation
  - Call NextAuth signIn
  - Redirect to /tasks on success
  - Link to register page

- [ ] **Test Auth Flow**
  - Register new user
  - Verify user in database (Prisma Studio)
  - Login with credentials
  - Verify redirected to /tasks
  - Logout
  - Verify redirected to /login

**Day 3-4 Done When:** Can register, login, logout. Passwords are hashed. Protected routes redirect to login.

---

## 📝 Task CRUD Backend (Days 5-6)

### Day 5: Database & Types

- [ ] **Create Task Types**
  - types/task.ts:
    - TaskStatus enum
    - TaskPriority enum
    - Task interface
    - CreateTaskInput type
    - UpdateTaskInput type
    - TaskFilters type

- [ ] **Create API Types**
  - types/api.ts:
    - ApiResponse<T> type
    - ApiError type
    - ApiResult<T> union type

- [ ] **Create Validation Schemas**
  - lib/validation/schemas.ts:
    - TaskSchema (Zod)
    - TaskFiltersSchema (Zod)

- [ ] **Create Database Queries**
  - lib/db/prisma.ts (PrismaClient singleton)
  - lib/db/queries.ts:
    - getUserTasks(userId, filters?)
    - createTask(userId, data)
    - updateTask(taskId, userId, data)
    - deleteTask(taskId, userId)
    - getTaskById(taskId, userId)
  - All queries MUST filter by user_id!

### Day 6: API Endpoints

- [ ] **Create Tasks API - List & Create**
  - app/api/tasks/route.ts
  - GET handler: list tasks with filters
  - POST handler: create new task
  - Both use requireAuth()
  - Both return ApiResponse/ApiError format

- [ ] **Create Tasks API - Single Task**
  - app/api/tasks/[id]/route.ts
  - GET handler: get single task
  - PUT handler: update task
  - DELETE handler: delete task
  - All use requireAuth()
  - All verify task belongs to user
  - All return ApiResponse/ApiError format

- [ ] **Test Task APIs**
  - GET /api/tasks (returns empty array for new user)
  - POST /api/tasks (creates task)
  - GET /api/tasks (returns created task)
  - PUT /api/tasks/[id] (updates task)
  - DELETE /api/tasks/[id] (deletes task)
  - GET /api/tasks (returns empty array again)
  - Test with 2 users: verify can't access other user's tasks

**Day 5-6 Done When:** All CRUD operations work via API. User isolation verified. Proper error handling exists.

---

## 🎨 Task CRUD Frontend (Day 7)

### Day 7: Task Components & Page

- [ ] **Create TaskCard Component**
  - components/tasks/TaskCard.tsx
  - Displays: status badge, priority badge, title, description, due date
  - Buttons: Edit, Delete
  - Color-coded badges
  - Props: task, onEdit, onDelete

- [ ] **Create TaskForm Component**
  - components/tasks/TaskForm.tsx
  - Fields: title, description, status, priority, due_date
  - react-hook-form + Zod validation
  - Works for both create and edit modes
  - Props: task (optional), onSubmit, onCancel

- [ ] **Create TaskList Component**
  - components/tasks/TaskList.tsx
  - Responsive grid (1/2/3 columns)
  - Uses TaskCard for each task
  - Loading state (skeleton cards)
  - Empty state ("No tasks yet")
  - Edit opens modal with TaskForm
  - Delete shows confirmation dialog
  - Props: tasks, loading, onTaskUpdate

- [ ] **Create Tasks Page**
  - app/(dashboard)/tasks/page.tsx
  - Header with "Add Task" button
  - Fetches tasks on mount
  - TaskList component
  - Create: opens TaskForm modal
  - Edit: opens TaskForm modal with task data
  - Delete: confirms, calls API, refreshes list
  - Error handling

- [ ] **Create Dashboard Layout**
  - app/(dashboard)/layout.tsx
  - Header with user email and logout button
  - Main content area

- [ ] **Create Header Component**
  - components/layout/Header.tsx
  - Logo/title
  - User info (email)
  - Logout button
  - Responsive

- [ ] **Test Task CRUD Flow**
  - Navigate to /tasks
  - Create new task
  - See task appear in list
  - Edit task
  - See changes
  - Delete task
  - See task removed
  - Test on mobile, tablet, desktop

**Day 7 Done When:** Complete CRUD cycle works in UI. Can create, view, edit, delete tasks. Responsive design works.

---

## 🔍 Filtering & Search (Days 8-9)

### Day 8: Filter Components

- [ ] **Create TaskFilters Component**
  - components/tasks/TaskFilters.tsx
  - Status dropdown (All, Todo, In Progress, Done)
  - Priority dropdown (All, Low, Medium, High, Urgent)
  - Clear filters button
  - Props: filters, onChange

- [ ] **Create TaskSearch Component**
  - components/tasks/TaskSearch.tsx
  - Search input with icon
  - Debounce (300ms)
  - Clear button
  - Props: searchTerm, onChange

- [ ] **Update Tasks Page for Filtering**
  - Add TaskFilters and TaskSearch components
  - Store filters and search in state
  - Update fetch URL with query params
  - Refetch when filters/search changes
  - Show "No results" when filtered list empty

### Day 9: Filter Backend & Testing

- [ ] **Update GET /api/tasks**
  - Parse query params (status, priority, search)
  - Pass filters to getUserTasks()
  - Return filtered results

- [ ] **Update getUserTasks Query**
  - Add status filter (if provided)
  - Add priority filter (if provided)
  - Add search filter (title OR description)
  - Use case-insensitive search

- [ ] **Test Filtering**
  - Create tasks with different statuses
  - Filter by status: verify correct tasks shown
  - Filter by priority: verify correct tasks shown
  - Search by title: verify matches found
  - Search by description: verify matches found
  - Combine filters: verify all work together
  - Clear filters: verify all tasks shown again

**Day 8-9 Done When:** Can filter by status, priority, and search by title/description. All filters work together. Can clear filters.

---

## ✨ Polish Phase (Day 10)

### Day 10: Loading, Errors, Empty States

- [ ] **Add Loading States**
  - Skeleton TaskCard component
  - TaskList shows skeletons while loading
  - Button loading states (spinner + disabled)
  - Form submission loading states

- [ ] **Add Error States**
  - app/error.tsx (error boundary)
  - Toast notifications for API errors
  - Form validation error messages
  - Network error retry button
  - User-friendly error messages

- [ ] **Add Empty States**
  - No tasks yet (with CTA)
  - No search results (with clear filters button)
  - Visual improvements

- [ ] **Responsive Design Review**
  - Test mobile (375px): single column, touch targets 44px+
  - Test tablet (768px): two columns
  - Test desktop (1024px+): three columns
  - Fix any overflow or layout issues
  - Verify forms usable on mobile

- [ ] **Polish UI**
  - Consistent spacing
  - Smooth transitions
  - Hover states
  - Focus states for accessibility
  - Loading indicators
  - Success feedback

**Day 10 Done When:** App looks professional. No jarring loading jumps. Clear error messages. Works smoothly on all screen sizes.

---

## 🧪 Testing Phase (Day 11)

### Day 11: Manual Testing

- [ ] **Authentication Testing**
  - Register new user ✓
  - Cannot register with existing email ✓
  - Cannot register with weak password ✓
  - Login with valid credentials ✓
  - Cannot login with invalid credentials ✓
  - Logout ✓
  - Redirected when not authenticated ✓
  - Session persists on refresh ✓

- [ ] **Task CRUD Testing**
  - Create task with all fields ✓
  - Create task with only title ✓
  - Cannot create with empty title ✓
  - View task list ✓
  - Can only see own tasks (test with 2 accounts) ✓
  - Edit task ✓
  - Delete task ✓
  - List updates after mutations ✓

- [ ] **Filter & Search Testing**
  - Filter by each status ✓
  - Filter by each priority ✓
  - Search by title ✓
  - Search by description ✓
  - Combine filters ✓
  - Clear filters ✓
  - "No results" message ✓

- [ ] **UI/UX Testing**
  - Mobile layout (375px) ✓
  - Tablet layout (768px) ✓
  - Desktop layout (1024px+) ✓
  - Loading states ✓
  - Error messages ✓
  - Empty states ✓
  - Form validation ✓
  - Success feedback ✓

- [ ] **Security Testing**
  - Cannot access other users' tasks ✓
  - API returns 401 when not authenticated ✓
  - Cannot update/delete others' tasks ✓
  - Passwords hashed in database ✓
  - Session cookies HTTP-only ✓

- [ ] **Fix Any Bugs Found**
  - Document bugs
  - Fix high priority bugs
  - Retest after fixes

**Day 11 Done When:** All tests pass. No critical bugs. App is stable and secure.

---

## 🚀 Deployment Phase (Days 12-13)

### Day 12: Pre-Deployment

- [ ] **Code Cleanup**
  - Remove console.logs
  - Remove commented code
  - Remove unused imports
  - Remove unused files

- [ ] **TypeScript Check**
  - Run `npm run type-check`
  - Fix all TypeScript errors
  - No `any` types

- [ ] **Build Test**
  - Run `npm run build`
  - Fix any build errors
  - Test production build: `npm start`

- [ ] **Environment Variables**
  - Verify all vars in .env.example
  - Document each variable
  - Add production DB URL format

- [ ] **Create README.md**
  - Project description
  - Tech stack
  - Features list
  - Setup instructions
  - Environment variables
  - Development commands
  - Deployment instructions
  - Screenshots (optional)

### Day 13: Deploy

- [ ] **Setup Supabase**
  - Create Supabase project
  - Get DATABASE_URL from dashboard
  - Save URL securely

- [ ] **Run Production Migrations**
  - Set DATABASE_URL to production
  - Run `npx prisma migrate deploy`
  - Verify tables in Supabase dashboard
  - Run `npx prisma generate`

- [ ] **Setup Vercel**
  - Push code to GitHub
  - Create Vercel project
  - Connect GitHub repo
  - Configure environment variables:
    - DATABASE_URL (from Supabase)
    - NEXTAUTH_SECRET (new 32-char string)
    - NEXTAUTH_URL (Vercel app URL)
  - Set build command: `npx prisma generate && next build`

- [ ] **Deploy**
  - Trigger deployment
  - Monitor build logs
  - Fix any deployment errors

- [ ] **Test Production**
  - Register new user in production
  - Create tasks
  - Test all features
  - Test on mobile device
  - Test on different browsers

- [ ] **Final Checks**
  - Production URL works
  - All features functional
  - No console errors
  - Analytics working (if added)

**Day 12-13 Done When:** App deployed to production. All features work. URL is live and shareable.

---

## 📝 Documentation Phase (Day 14)

### Day 14: Documentation & Wrap-up

- [ ] **Update README**
  - Add production URL
  - Add screenshots
  - Verify setup instructions accurate
  - Add troubleshooting section

- [ ] **Create DECISIONS.md** (if not already)
  - Document major tech choices
  - Explain why Next.js, Prisma, etc.
  - List trade-offs considered

- [ ] **Portfolio Prep**
  - Take high-quality screenshots
  - Record demo video (optional)
  - Write project summary for resume
  - List key accomplishments
  - Note challenges overcome

- [ ] **Code Review**
  - Review code quality one last time
  - Ensure consistent style
  - Add missing comments
  - Ensure proper error handling everywhere

- [ ] **Final Testing**
  - One last full test of production
  - Test with fresh eyes
  - Ask someone else to test (if possible)

- [ ] **Celebrate! 🎉**
  - You built a complete full-stack app
  - It's deployed and live
  - You can demo it to employers
  - First of 11 projects complete!

**Day 14 Done When:** Documentation complete. Portfolio-ready. You're proud to show this to employers.

---

## ✅ MVP Completion Criteria

Check ALL boxes before considering TaskFlow MVP complete:

### Functionality
- [ ] User can register
- [ ] User can login
- [ ] User can logout
- [ ] User can create tasks
- [ ] User can view all their tasks
- [ ] User can edit tasks
- [ ] User can delete tasks
- [ ] User can filter tasks by status
- [ ] User can filter tasks by priority
- [ ] User can search tasks by title
- [ ] Filters and search work together
- [ ] Users only see their own tasks

### Quality
- [ ] No TypeScript errors
- [ ] No critical bugs
- [ ] Responsive on mobile, tablet, desktop
- [ ] Loading states for all async operations
- [ ] Error messages are clear
- [ ] Empty states are implemented
- [ ] Forms validate properly
- [ ] Success feedback after actions

### Security
- [ ] Passwords are hashed
- [ ] Session cookies are HTTP-only
- [ ] All queries filter by user_id
- [ ] API checks authentication
- [ ] Input is validated (client + server)
- [ ] No SQL injection vulnerabilities
- [ ] Protected routes redirect to login

### Deployment
- [ ] App deployed to Vercel
- [ ] Database on Supabase
- [ ] All features work in production
- [ ] Environment variables set correctly
- [ ] Build succeeds without errors

### Documentation
- [ ] README has setup instructions
- [ ] Environment variables documented
- [ ] API endpoints documented (optional)
- [ ] Code has necessary comments
- [ ] Git commit history is clean

---

## 🎯 You're Done When:

✅ All checkboxes above are checked
✅ You can confidently demo TaskFlow to an employer
✅ Alex understands every line of code
✅ App is live at a production URL
✅ No known critical bugs
✅ Ready to move on to Project #2

---

## 📞 Need Help?

If stuck for > 30 minutes on any task:
1. Re-read the relevant section in CURSOR_HANDOFF.md
2. Check CURSOR_IMPLEMENTATION_GUIDE.md for detailed prompts
3. Review similar code already in the project
4. Break the problem into smaller pieces
5. Test each piece in isolation
6. Ask for help with specific error messages

**Remember:** This is a learning project. Understanding > Speed. Build it right.

---

## 🚀 Let's Ship This Thing!

Start with Day 1, work through systematically. Check off items as you go. You've got this! 💪
