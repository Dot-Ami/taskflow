import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateTaskSchema } from "@/lib/validation/tasks";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as z from "zod";

const routeContextSchema = z.object({
    params: z.object({
        taskId: z.string(),
    }),
});

export async function GET(
    req: Request,
    context: z.infer<typeof routeContextSchema>
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const { params } = routeContextSchema.parse(context);

        const task = await db.task.findUnique({
            where: {
                id: params.taskId,
                user_id: session.user.id,
            },
        });

        if (!task) {
            return new NextResponse("Not Found", { status: 404 });
        }

        return NextResponse.json(task);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    context: z.infer<typeof routeContextSchema>
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const { params } = routeContextSchema.parse(context);

        const task = await db.task.findUnique({
            where: {
                id: params.taskId,
                user_id: session.user.id,
            },
        });

        if (!task) {
            return new NextResponse("Not Found", { status: 404 });
        }

        await db.task.delete({
            where: {
                id: params.taskId,
            },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    context: z.infer<typeof routeContextSchema>
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const { params } = routeContextSchema.parse(context);

        const task = await db.task.findUnique({
            where: {
                id: params.taskId,
                user_id: session.user.id,
            },
        });

        if (!task) {
            return new NextResponse("Not Found", { status: 404 });
        }

        const json = await req.json();
        const body = updateTaskSchema.parse(json);

        const updatedTask = await db.task.update({
            where: {
                id: params.taskId,
            },
            data: {
                title: body.title,
                description: body.description,
                status: body.status,
                priority: body.priority,
                due_date: body.due_date ? new Date(body.due_date) : undefined,
            },
        });

        return NextResponse.json(updatedTask);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 422 });
        }

        return new NextResponse("Internal Error", { status: 500 });
    }
}
