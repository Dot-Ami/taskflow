"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { createCategory, deleteCategory, getCategories } from "@/actions/categories";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

interface Category {
    id: string;
    name: string;
    color: string;
}

export function CategoryManager() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const fetchCategories = async () => {
        const data = await getCategories();
        setCategories(data);
    };

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    const handleCreate = async () => {
        if (!newCategoryName.trim()) return;

        setIsLoading(true);
        const result = await createCategory({ name: newCategoryName, color: "blue" }); // Default color for now
        setIsLoading(false);

        if (result.error) {
            toast({
                title: "Error",
                description: result.error,
                variant: "destructive",
            });
        } else {
            setNewCategoryName("");
            fetchCategories();
            toast({
                title: "Success",
                description: "Category created",
            });
        }
    };

    const handleDelete = async (id: string) => {
        const result = await deleteCategory(id);
        if (result.error) {
            toast({
                title: "Error",
                description: result.error,
                variant: "destructive",
            });
        } else {
            fetchCategories();
            toast({
                title: "Success",
                description: "Category deleted",
            });
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed">
                    <Tag className="mr-2 h-4 w-4" />
                    Manage Categories
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="space-y-4">
                    <h4 className="font-medium leading-none">Categories</h4>
                    <p className="text-sm text-muted-foreground">
                        Create and manage your task categories.
                    </p>
                    <div className="flex gap-2">
                        <Input
                            placeholder="New category..."
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleCreate();
                            }}
                        />
                        <Button size="icon" onClick={handleCreate} disabled={isLoading}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <Separator />
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {categories.length === 0 ? (
                            <p className="text-sm text-center text-muted-foreground py-4">
                                No categories yet.
                            </p>
                        ) : (
                            categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="flex items-center justify-between group"
                                >
                                    <Badge variant="secondary">{category.name}</Badge>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleDelete(category.id)}
                                    >
                                        <Trash2 className="h-3 w-3 text-destructive" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
