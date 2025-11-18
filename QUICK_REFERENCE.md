# TaskFlow Quick Reference

## 🚀 Essential Commands

### Development
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
```

### Database (Prisma)
```bash
npx prisma studio              # Open database GUI
npx prisma generate            # Generate Prisma Client
npx prisma migrate dev         # Create & apply migration
npx prisma migrate deploy      # Deploy migrations (production)
npx prisma db push             # Push schema changes (dev only)
npx prisma db pull             # Pull schema from database
```

### Git
```bash
git status                     # Check status
git add .                      # Stage all changes
git commit -m "message"        # Commit with message
git push origin main           # Push to GitHub
```

---

## 📂 File Location Quick Guide

### Adding New Features

**Creating a new page:**
- Auth pages: `app/(auth)/[page-name]/page.tsx`
- Dashboard pages: `app/(dashboard)/[page-name]/page.tsx`
- Public pages: `app/[page-name]/page.tsx`

**Creating API endpoints:**
- `app/api/[endpoint]/route.ts` - List & Create (GET, POST)
- `app/api/[endpoint]/[id]/route.ts` - Single item (GET, PUT, DELETE)

**Creating components:**
- UI components: `components/ui/[component].tsx`
- Task components: `components/tasks/[component].tsx`
- Layout components: `components/layout/[component].tsx`

**Database queries:**
- `lib/db/queries.ts` - All Prisma database queries

**Type definitions:**
- `types/task.ts` - Task-related types
- `types/user.ts` - User-related types
- `types/api.ts` - API response types

**Validation schemas:**
- `lib/validation/schemas.ts` - Zod validation schemas

---

## 🔐 Environment Variables

Located in `.env.local` (not committed to git):

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
```

**Generate secure secret:**
```bash
openssl rand -base64 32
```

---

## 🎨 Shadcn UI Components Available

### Forms
- `Button` - All button variants
- `Input` - Text inputs
- `Label` - Form labels
- `Textarea` - Multi-line text
- `Select` - Dropdowns

### Display
- `Card` - Content containers
- `Badge` - Status indicators
- `Dialog` - Modals

### Usage Example
```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

<Button variant="destructive">Delete</Button>
<Input type="email" placeholder="Email" />
```

---

## 📊 Database Schema Quick Reference

### User
- `id` - UUID
- `email` - Unique
- `password_hash` - Bcrypt hashed
- `name` - Optional
- `tasks` - Relation to Task[]

### Task
- `id` - UUID  
- `user_id` - FK to User
- `title` - Required string
- `description` - Optional text
- `status` - Enum: todo | in_progress | done
- `priority` - Enum: low | medium | high | urgent
- `due_date` - Optional timestamp
- `completed_at` - Optional timestamp

---

## 🛣️ Route Structure

### Public Routes
- `/` - Homepage
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (require auth)
- `/dashboard/tasks` - Task list
- `/api/tasks` - Task API endpoints

### API Routes
- `POST /api/auth/signin` - Login
- `POST /api/auth/signup` - Register
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/[id]` - Get task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

---

## 🎯 Common Tasks

### Add a new Shadcn component
```bash
npx shadcn-ui@latest add [component-name]
```

### Update database schema
1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name [migration-name]`
3. Run `npx prisma generate`

### Create a new page
1. Create file in `app/[route]/page.tsx`
2. Export default function
3. Add to navigation if needed

### Create a new API endpoint
1. Create `app/api/[endpoint]/route.ts`
2. Export GET, POST, PUT, or DELETE functions
3. Add auth check with `requireAuth()`
4. Return `ApiResponse` or `ApiError`

---

## 🔍 Debugging Tips

### Database Issues
```bash
# View database in GUI
npx prisma studio

# Reset database (CAREFUL! Deletes all data)
npx prisma migrate reset
```

### TypeScript Errors
```bash
# Check all type errors
npm run type-check

# Or check specific file
npx tsc --noEmit [file-path]
```

### Build Errors
```bash
# Test production build locally
npm run build
npm run start
```

### Clear Next.js Cache
```bash
# Delete .next folder
rm -rf .next

# On Windows PowerShell
Remove-Item -Recurse -Force .next
```

---

## 📚 Key Documentation

**In This Project:**
- `README.md` - Main documentation
- `SETUP_GUIDE.md` - Setup instructions
- `MCP_SETUP_GUIDE.md` - MCP configuration
- `docs/CURSOR_CHECKLIST.md` - Daily tasks
- `docs/CURSOR_HANDOFF.md` - Complete specs

**External:**
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org)
- [Shadcn UI](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zod Docs](https://zod.dev)

---

## 🧪 Testing Checklist

Before moving to next phase:
- [ ] TypeScript compiles: `npm run type-check`
- [ ] No console errors in browser
- [ ] Feature works in dev mode
- [ ] Database operations work
- [ ] Auth is enforced on protected routes
- [ ] Mobile responsive (test in DevTools)
- [ ] No linter errors: `npm run lint`

---

## 🎨 Tailwind Utilities Cheat Sheet

### Layout
```tsx
className="flex items-center justify-center"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
className="container mx-auto px-4"
```

### Spacing
```tsx
className="p-4 m-2"          // padding, margin
className="mt-4 mb-8"        // margin top/bottom
className="space-y-4"        // vertical space between children
```

### Responsive
```tsx
className="text-sm md:text-base lg:text-lg"
className="hidden md:block"  // hide on mobile, show on desktop
```

### Colors (using CSS variables)
```tsx
className="bg-primary text-primary-foreground"
className="bg-destructive text-destructive-foreground"
className="bg-card text-card-foreground"
```

---

## 💡 Code Snippets

### API Route Template
```typescript
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function GET(request: Request) {
  const session = await getServerSession()
  
  if (!session) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
      { status: 401 }
    )
  }

  try {
    // Your logic here
    return NextResponse.json({ success: true, data: {} })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } },
      { status: 500 }
    )
  }
}
```

### Component Template
```typescript
import { Button } from '@/components/ui/button'

interface MyComponentProps {
  title: string
  onAction: () => void
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div className="p-4">
      <h2>{title}</h2>
      <Button onClick={onAction}>Action</Button>
    </div>
  )
}
```

---

## 🚀 Productivity Tips

1. **Use Cursor shortcuts:**
   - `Ctrl+K` - Command palette
   - `Ctrl+P` - Quick file open
   - `Ctrl+Shift+P` - Command palette

2. **Keep terminals organized:**
   - Terminal 1: `npm run dev`
   - Terminal 2: `npx prisma studio`
   - Terminal 3: Commands

3. **Bookmark these URLs:**
   - http://localhost:3000 - App
   - http://localhost:5555 - Prisma Studio

4. **Use TypeScript autocomplete:**
   - Type `prisma.` and let IntelliSense guide you
   - Hover over functions to see types

---

## 📞 When Stuck

1. Check the error message carefully
2. Look at `docs/CURSOR_HANDOFF.md` for specs
3. Check `docs/CURSOR_IMPLEMENTATION_GUIDE.md` for prompts
4. Search the specific error online
5. Ask for help with the exact error message

---

**Keep this file open for quick reference throughout development!**

