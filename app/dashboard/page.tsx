import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { TaskList } from "@/components/tasks/TaskList";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskSearch } from "@/components/tasks/TaskSearch";
import { UserMenu } from "@/components/layout/UserMenu";
import { ThemeToggle } from "@/components/theme-toggle";
import { CategoryManager } from "@/components/categories/CategoryManager";
import { Task } from "@/types";

interface DashboardProps {
    searchParams: {
        status?: string;
        priority?: string;
        search?: string;
        category?: string;
        sort?: string;
    };
}

async function getTasks(
    userId: string,
    params: DashboardProps["searchParams"]
): Promise<Task[]> {
    const whereClause: any = {
        user_id: userId,
    };

    if (params.status && params.status !== "all") {
        whereClause.status = params.status;
    }

    if (params.priority && params.priority !== "all") {
        whereClause.priority = params.priority;
    }

    if (params.search) {
        whereClause.OR = [
            { title: { contains: params.search, mode: "insensitive" } },
            { description: { contains: params.search, mode: "insensitive" } },
        ];
    }

    if (params.category && params.category !== "all") {
        whereClause.category_id = params.category;
    }

    let orderBy: any = { created_at: "desc" };

    if (params.sort) {
        switch (params.sort) {
            case "created_asc":
                orderBy = { created_at: "asc" };
                break;
            case "created_desc":
                orderBy = { created_at: "desc" };
                break;
            case "priority_asc":
                orderBy = { priority: "asc" };
                break;
            case "priority_desc":
                orderBy = { priority: "desc" };
                break;
            case "due_date_asc":
                orderBy = { due_date: "asc" };
                break;
            case "due_date_desc":
                orderBy = { due_date: "desc" };
                break;
        }
    }

    const tasks = await db.task.findMany({
        where: whereClause,
        include: {
            category: true,
        },
        orderBy: orderBy,
    });

    return tasks.map((task) => ({
        ...task,
        created_at: task.created_at.toISOString(),
        updated_at: task.updated_at.toISOString(),
        due_date: task.due_date ? task.due_date.toISOString() : undefined,
        completed_at: task.completed_at ? task.completed_at.toISOString() : undefined,
    })) as unknown as Task[];
}

export default async function DashboardPage({ searchParams }: DashboardProps) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const tasks = await getTasks(session.user.id, searchParams);

    return (
        <div className="container mx-auto py-10">
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
                        <p className="text-muted-foreground">
                            Manage your tasks and track progress.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <CreateTaskDialog />
                        <CategoryManager />
                        <ThemeToggle />
                        <UserMenu />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <TaskSearch />
                    <TaskFilters />
                </div>
            </div>

            <TaskList tasks={tasks} />
        </div>
    );
}
