"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import * as z from "zod";

const categorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    color: z.string().default("blue"),
});

export async function getCategories() {
    const session = await getServerSession(authOptions);
    if (!session) return [];

    try {
        const categories = await db.category.findMany({
            where: { user_id: session.user.id },
            orderBy: { created_at: "desc" },
        });
        return categories;
    } catch (error) {
        return [];
    }
}

export async function createCategory(values: z.infer<typeof categorySchema>) {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Unauthorized" };

    const validatedFields = categorySchema.safeParse(values);
    if (!validatedFields.success) return { error: "Invalid fields" };

    try {
        await db.category.create({
            data: {
                ...validatedFields.data,
                user_id: session.user.id,
            },
        });
        revalidatePath("/dashboard");
        return { success: "Category created" };
    } catch (error) {
        return { error: "Failed to create category" };
    }
}

export async function deleteCategory(id: string) {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Unauthorized" };

    try {
        await db.category.delete({
            where: {
                id,
                user_id: session.user.id,
            },
        });
        revalidatePath("/dashboard");
        return { success: "Category deleted" };
    } catch (error) {
        return { error: "Failed to delete category" };
    }
}
