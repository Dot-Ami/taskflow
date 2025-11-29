export interface Task {
    id: string;
    title: string;
    description?: string;
    status: "todo" | "in_progress" | "done";
    priority: "low" | "medium" | "high" | "urgent";
    due_date?: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    category_id?: string | null;
    category?: {
        id: string;
        name: string;
        color: string;
    } | null;
}
