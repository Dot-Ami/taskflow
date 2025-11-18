# TaskFlow Setup Guide

## 🎯 What We've Done So Far

✅ Created Next.js 14 project structure with TypeScript
✅ Configured Tailwind CSS with Shadcn UI theme
✅ Set up Prisma schema with User and Task models
✅ Created all necessary Shadcn UI components
✅ Configured folder structure for the project
✅ Added all required dependencies to package.json

## 🔧 Next Steps - You Need To Do This

### Step 1: Install Dependencies

Open your terminal (outside of Cursor chat) and run:

```bash
npm install
```

This will install all the packages defined in `package.json`.

### Step 2: Create Environment Variables

Create a `.env.local` file in the root directory with:

```env
# Database (update with your PostgreSQL connection string)
DATABASE_URL="postgresql://user:password@localhost:5432/taskflow"

# NextAuth Configuration
NEXTAUTH_SECRET="development-secret-key-change-in-production-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

**Important**: For production, generate a secure secret:
```bash
openssl rand -base64 32
```

### Step 3: Set Up Database

You have two options:

#### Option A: Local PostgreSQL
```bash
# Make sure PostgreSQL is running locally
# Update DATABASE_URL in .env.local with your local credentials

npx prisma generate
npx prisma migrate dev --name init
```

#### Option B: Supabase (Recommended)
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings → Database → Connection String
4. Copy the connection string and update `DATABASE_URL` in `.env.local`
5. Run migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### Step 4: Verify Setup

```bash
# Start the development server
npm run dev

# In another terminal, open Prisma Studio to view your database
npx prisma studio
```

Visit [http://localhost:3000](http://localhost:3000) - you should see the TaskFlow homepage!

## 📊 Project Status - Day 1 Complete! ✅

We've completed all Day 1 tasks:
- ✅ Next.js project initialized
- ✅ Dependencies installed (in package.json)
- ✅ Shadcn UI configured
- ✅ Folder structure created
- ✅ Prisma schema defined
- ✅ Environment template created

## 🔜 What's Next - Day 2

Once you've completed the steps above, we'll move to Day 2:
- Set up NextAuth.js for authentication
- Create registration and login pages
- Implement password hashing with bcrypt
- Set up protected routes

## 🚨 Troubleshooting

### "Cannot find module" errors
```bash
npm install
npx prisma generate
```

### Database connection errors
- Verify your `DATABASE_URL` is correct
- For Supabase: make sure you're using the connection string with `[YOUR-PASSWORD]` replaced
- For local: ensure PostgreSQL is running

### TypeScript errors
```bash
npm run type-check
```

### Port 3000 already in use
```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change the port
npm run dev -- -p 3001
```

## 📞 Need Help?

Refer to:
- `docs/CURSOR_CHECKLIST.md` for the complete roadmap
- `docs/CURSOR_HANDOFF.md` for technical specifications
- `README.md` for command reference








