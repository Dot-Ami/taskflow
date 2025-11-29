"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getCategories } from "@/actions/categories";

export function TaskFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

    const status = searchParams.get("status") || "all";
    const priority = searchParams.get("priority") || "all";
    const category = searchParams.get("category") || "all";
    const sort = searchParams.get("sort") || "created_desc";

    useEffect(() => {
        const loadCategories = async () => {
            const data = await getCategories();
            setCategories(data);
        };
        loadCategories();
    }, []);

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "all") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex flex-wrap gap-4">
            <div className="w-[150px]">
                <Select
                    value={status}
                    onValueChange={(value) => updateFilter("status", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="todo">Todo</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-[150px]">
                <Select
                    value={priority}
                    onValueChange={(value) => updateFilter("priority", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-[150px]">
                <Select
                    value={category}
                    onValueChange={(value) => updateFilter("category", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="w-[180px]">
                <Select
                    value={sort}
                    onValueChange={(value) => updateFilter("sort", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="created_desc">Newest First</SelectItem>
                        <SelectItem value="created_asc">Oldest First</SelectItem>
                        <SelectItem value="priority_desc">Priority (High-Low)</SelectItem>
                        <SelectItem value="priority_asc">Priority (Low-High)</SelectItem>
                        <SelectItem value="due_date_asc">Due Date (Soonest)</SelectItem>
                        <SelectItem value="due_date_desc">Due Date (Latest)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
