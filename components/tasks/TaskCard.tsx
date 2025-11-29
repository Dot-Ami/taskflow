"use client";

import { Task } from "@/types";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
}

const priorityColors = {
    low: "bg-slate-500",
    medium: "bg-blue-500",
    high: "bg-orange-500",
    urgent: "bg-red-500",
};

const statusColors = {
    todo: "secondary",
    in_progress: "default",
    done: "outline",
} as const;

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <CardTitle className="text-lg font-semibold leading-none tracking-tight">
                            {task.title}
                        </CardTitle>
                        <div className="flex gap-2 mt-2">
                            <Badge variant={statusColors[task.status]}>
                                {task.status.replace("_", " ")}
                            </Badge>
                            <Badge className={priorityColors[task.priority]}>
                                {task.priority}
                            </Badge>
                            {task.category && (
                                <Badge variant="outline" style={{ borderColor: task.category.color, color: task.category.color }}>
                                    {task.category.name}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {task.description || "No description provided."}
                </p>
                {task.due_date && (
                    <div className="flex items-center gap-1 mt-4 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(task.due_date), "PPP")}</span>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
                    <Pencil className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => onDelete(task)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
