"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function getAnalyticsData() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return null;
    }

    const userId = session.user.id;

    const [
        totalTasks,
        completedTasks,
        activeTasks,
        overdueTasks,
        tasksByCategory,
        tasksByPriority,
    ] = await Promise.all([
        // Total Tasks
        db.task.count({
            where: { user_id: userId },
        }),
        // Completed Tasks
        db.task.count({
            where: { user_id: userId, status: "done" },
        }),
        // Active Tasks (Todo + In Progress)
        db.task.count({
            where: {
                user_id: userId,
                status: { in: ["todo", "in_progress"] },
            },
        }),
        // Overdue Tasks
        db.task.count({
            where: {
                user_id: userId,
                status: { not: "done" },
                due_date: { lt: new Date() },
            },
        }),
        // Tasks by Category
        db.category.findMany({
            where: { user_id: userId },
            include: {
                _count: {
                    select: { tasks: true },
                },
            },
        }),
        // Tasks by Priority
        db.task.groupBy({
            by: ["priority"],
            where: { user_id: userId },
            _count: true,
        }),
    ]);

    // Format Category Data for Charts
    const categoryData = tasksByCategory.map((cat) => ({
        name: cat.name,
        value: cat._count.tasks,
        color: cat.color,
    })).filter(item => item.value > 0);

    // Add "Uncategorized" if needed
    const uncategorizedCount = await db.task.count({
        where: { user_id: userId, category_id: null },
    });

    if (uncategorizedCount > 0) {
        categoryData.push({
            name: "Uncategorized",
            value: uncategorizedCount,
            color: "#94a3b8", // slate-400
        });
    }

    // Format Priority Data for Charts
    const priorityMap: Record<string, number> = {
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0,
    };

    tasksByPriority.forEach((item) => {
        priorityMap[item.priority] = item._count;
    });

    const priorityData = [
        { name: "Low", value: priorityMap.low, fill: "#64748b" }, // slate-500
        { name: "Medium", value: priorityMap.medium, fill: "#3b82f6" }, // blue-500
        { name: "High", value: priorityMap.high, fill: "#f97316" }, // orange-500
        { name: "Urgent", value: priorityMap.urgent, fill: "#ef4444" }, // red-500
    ];

    return {
        counts: {
            total: totalTasks,
            completed: completedTasks,
            active: activeTasks,
            overdue: overdueTasks,
        },
        charts: {
            category: categoryData,
            priority: priorityData,
        },
    };
}
