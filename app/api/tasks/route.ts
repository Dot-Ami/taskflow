import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { createTaskSchema } from "@/lib/validation/tasks";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as z from "zod";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const priority = searchParams.get("priority");
        const search = searchParams.get("search");

        const whereClause: any = {
            user_id: session.user.id,
        };

        if (status && status !== "all") {
            whereClause.status = status;
        }

        if (priority && priority !== "all") {
            whereClause.priority = priority;
        }

        if (search) {
            whereClause.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }

        const tasks = await db.task.findMany({
            where: whereClause,
            orderBy: {
                created_at: "desc",
            },
        });

        return NextResponse.json(tasks);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const json = await req.json();
        const body = createTaskSchema.parse(json);

        const task = await db.task.create({
            data: {
                title: body.title,
                description: body.description,
                status: body.status || "todo",
                priority: body.priority || "medium",
                due_date: body.due_date ? new Date(body.due_date) : null,
                user_id: session.user.id,
            },
        });

        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 422 });
        }

        return new NextResponse("Internal Error", { status: 500 });
    }
}
