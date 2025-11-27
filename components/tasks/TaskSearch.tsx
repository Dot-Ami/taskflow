"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce";

export function TaskSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [value, setValue] = useState(searchParams.get("search") || "");
    const debouncedValue = useDebounce(value, 500);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (debouncedValue) {
            params.set("search", debouncedValue);
        } else {
            params.delete("search");
        }
        router.push(`?${params.toString()}`);
    }, [debouncedValue, router, searchParams]);

    return (
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search tasks..."
                className="pl-8"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    );
}
