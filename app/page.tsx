import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-white to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-6xl font-bold tracking-tighter sm:text-7xl">
          TaskFlow
        </h1>
        <p className="text-xl text-muted-foreground">
          Manage your tasks efficiently with our modern, intuitive dashboard.
          Stay organized, focused, and get things done.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link href="/login">
            <Button size="lg" variant="outline">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
