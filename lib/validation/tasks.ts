import * as z from "zod";

export const createTaskSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required.",
    }),
    description: z.string().optional(),
    status: z.enum(["todo", "in_progress", "done"]).optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    due_date: z.string().optional().nullable(), // Expecting ISO string from frontend
    category_id: z.string().optional().nullable(),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required.",
    }).optional(),
    description: z.string().optional(),
    status: z.enum(["todo", "in_progress", "done"]).optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    due_date: z.string().optional().nullable(),
    category_id: z.string().optional().nullable(),
});
