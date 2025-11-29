"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import * as z from "zod";

const profileSchema = z.object({
    name: z.string().min(2).optional(),
    image: z.string().url().optional().or(z.literal("")),
});

export const updateProfile = async (values: z.infer<typeof profileSchema>) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return { error: "Unauthorized" };
    }

    const validatedFields = profileSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { name, image } = validatedFields.data;

    try {
        await db.user.update({
            where: { id: session.user.id },
            data: {
                name,
                image,
            },
        });

        revalidatePath("/settings");
        revalidatePath("/dashboard"); // Update dashboard header
        return { success: "Profile updated!" };
    } catch (error) {
        return { error: "Something went wrong!" };
    }
};
