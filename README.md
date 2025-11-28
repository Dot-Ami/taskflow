# TaskFlow - Task Management Application

A full-stack CRUD task management application built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Next.js API Routes, NextAuth.js, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Validation**: Zod
- **Authentication**: NextAuth.js with JWT
- **Deployment**: Vercel + Supabase

## ✨ Features

- 🔐 User authentication (register, login, logout)
- ✅ Complete CRUD operations for tasks
- 🎯 Task properties: title, description, status, priority, due date
- 🔍 Filter tasks by status and priority
- 🔎 Search tasks by title and description
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🔒 Secure user data isolation
- ⚡ Real-time form validation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ and npm
- PostgreSQL database (local or Supabase)
- Git

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/taskflow"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here-min-32-characters"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 3. Set Up Database

Initialize Prisma and create the database:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
taskflow/
├── app/
│   ├── (auth)/              # Authentication pages (login, register)
│   ├── (dashboard)/         # Protected dashboard pages
│   ├── api/                 # API routes
│   │   ├── auth/           # NextAuth endpoints
│   │   └── tasks/          # Task CRUD endpoints
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # Shadcn UI components
│   ├── tasks/              # Task-specific components
│   └── layout/             # Layout components
├── lib/
│   ├── db/                 # Database queries
│   ├── auth/               # Authentication helpers
│   ├── validation/         # Zod schemas
│   └── utils.ts            # Utility functions
├── prisma/
│   └── schema.prisma       # Database schema
├── types/                  # TypeScript type definitions
└── docs/                   # Project documentation
```

## 🔒 Security Features

- Passwords hashed with bcrypt (10 rounds)
- HTTP-only session cookies
- All database queries filter by user_id
- Input validation on client and server (Zod)
- Protected API routes with NextAuth middleware
- CSRF protection

## 🧪 Testing

Run TypeScript type checking:
```bash
npm run type-check
```

## 🚀 Deployment

### Database (Supabase)

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your PostgreSQL connection string from the dashboard
3. Update `DATABASE_URL` in Vercel environment variables
4. Run migrations:
```bash
npx prisma migrate deploy
```

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
4. Set build command: `npx prisma generate && next build`
5. Deploy

## 📝 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Prisma commands
npx prisma studio              # Open database GUI
npx prisma migrate dev         # Create new migration
npx prisma migrate deploy      # Deploy migrations (production)
npx prisma generate            # Generate Prisma Client
npx prisma db push             # Push schema changes (development)
```

## 🎯 MVP Completion Status

- [x] Day 1-2: Setup & Database ✅
- [x] Day 3-4: Authentication ✅
- [x] Day 5-6: Task CRUD Backend ✅
- [x] Day 7: Task CRUD Frontend ✅
- [x] Day 8-9: Filters & Search ✅
- [x] Day 10: Polish & Responsive Design ✅
- [ ] Day 11: Testing
- [ ] Day 12-13: Deployment
- [ ] Day 14: Documentation

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signin` - Login
- `POST /api/auth/signup` - Register
- `POST /api/auth/signout` - Logout
- `GET /api/auth/session` - Get current session

### Tasks
- `GET /api/tasks` - List all user tasks (with filters)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/[id]` - Get single task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

## 🤝 Contributing

This is a portfolio project for learning purposes. Feel free to fork and modify for your own use!

## 📄 License

MIT License - feel free to use this project for learning or your own portfolio.

## 👤 Author

**Alex Matthews** - Career transition project (Construction → Software Development)

---

**Built with ❤️ as Project #1 of 11 for career transition portfolio**








