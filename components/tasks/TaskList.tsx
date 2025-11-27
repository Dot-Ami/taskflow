"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Task } from "@/types";
import { TaskCard } from "./TaskCard";
import { EditTaskDialog } from "./EditTaskDialog";
import { DeleteTaskAlert } from "./DeleteTaskAlert";

interface TaskListProps {
    tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
    const router = useRouter();
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [deletingTask, setDeletingTask] = useState<Task | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deletingTask) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/tasks/${deletingTask.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete task");
            }

            setDeletingTask(null);
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="rounded-full bg-muted p-6 mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground"
                    >
                        <path d="M9 11l3 3L22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
                <p className="text-muted-foreground max-w-sm">
                    Get started by creating your first task. Click the &quot;New Task&quot; button above to begin organizing your work.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={setEditingTask}
                        onDelete={setDeletingTask}
                    />
                ))}
            </div>

            <EditTaskDialog
                task={editingTask}
                open={!!editingTask}
                onOpenChange={(open) => !open && setEditingTask(null)}
            />

            <DeleteTaskAlert
                open={!!deletingTask}
                onOpenChange={(open) => !open && setDeletingTask(null)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
            />
        </>
    );
}
