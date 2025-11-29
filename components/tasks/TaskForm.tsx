"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createTaskSchema } from "@/lib/validation/tasks";
import { getCategories } from "@/actions/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Task } from "@/types";

type FormData = z.infer<typeof createTaskSchema>;

interface TaskFormProps {
    task?: Task;
    onSubmit: (data: FormData) => Promise<void>;
    isSubmitting?: boolean;
}

export function TaskForm({ task, onSubmit, isSubmitting }: TaskFormProps) {
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            title: task?.title || "",
            description: task?.description || "",
            status: task?.status || "todo",
            priority: task?.priority || "medium",
            due_date: task?.due_date ? new Date(task.due_date).toISOString().split("T")[0] : "",
            category_id: task?.category_id || "",
        },
    });

    const status = watch("status");
    const priority = watch("priority");
    const category_id = watch("category_id");

    useEffect(() => {
        const loadCategories = async () => {
            const data = await getCategories();
            setCategories(data);
        };
        loadCategories();
    }, []);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    placeholder="Task title"
                    {...register("title")}
                    disabled={isSubmitting}
                />
                {errors.title && (
                    <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    placeholder="Task description"
                    {...register("description")}
                    disabled={isSubmitting}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                        disabled={isSubmitting}
                        onValueChange={(value: any) => setValue("status", value)}
                        defaultValue={status}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todo">Todo</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                        disabled={isSubmitting}
                        onValueChange={(value: any) => setValue("priority", value)}
                        defaultValue={priority}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                    disabled={isSubmitting}
                    onValueChange={(value) => setValue("category_id", value === "none" ? null : value)}
                    defaultValue={category_id || "none"}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">No Category</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                    id="due_date"
                    type="date"
                    {...register("due_date")}
                    disabled={isSubmitting}
                />
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {task ? "Update Task" : "Create Task"}
                </Button>
            </div>
        </form>
    );
}
