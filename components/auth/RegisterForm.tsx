"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { userRegisterSchema } from "@/lib/validation/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { SocialAuth } from "./SocialAuth";

type FormData = z.infer<typeof userRegisterSchema>;

export function RegisterForm() {
    const router = useRouter();
    const [passwordStrength, setPasswordStrength] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const calculateStrength = (password: string) => {
        let strength = 0;
        if (password.length > 5) strength += 20;
        if (password.length > 7) strength += 20;
        if (/[A-Z]/.test(password)) strength += 20;
        if (/[0-9]/.test(password)) strength += 20;
        if (/[^A-Za-z0-9]/.test(password)) strength += 20;
        return strength;
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(userRegisterSchema),
    });

    const password = watch("password", "");

    // Update strength when password changes
    if (password && calculateStrength(password) !== passwordStrength) {
        setPasswordStrength(calculateStrength(password));
    } else if (!password && passwordStrength !== 0) {
        setPasswordStrength(0);
    }

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            let result;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                result = await response.json();
            } else {
                // If not JSON, it's likely a server error page (HTML)
                const text = await response.text();
                console.error("Non-JSON response:", text);
                throw new Error("Server error. Please try again later.");
            }

            if (!response.ok) {
                if (response.status === 409) {
                    throw new Error("This email is already registered. Please login instead.");
                }
                throw new Error(result.message || "Something went wrong");
            }

            router.push("/login?registered=true");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getStrengthColor = (strength: number) => {
        if (strength <= 20) return "bg-red-500";
        if (strength <= 40) return "bg-orange-500";
        if (strength <= 60) return "bg-yellow-500";
        if (strength <= 80) return "bg-blue-500";
        return "bg-green-500";
    };

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                    Enter your email below to create your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid w-full items-center gap-4">
                        {error && (
                            <div className="p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive bg-destructive/15">
                                <AlertCircle className="h-4 w-4" />
                                <p>{error}</p>
                            </div>
                        )}
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                {...register("name")}
                                disabled={isLoading}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                {...register("email")}
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                {...register("password")}
                                disabled={isLoading}
                            />
                            {password && (
                                <div className="w-full h-2 bg-secondary rounded-full mt-2 overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${getStrengthColor(
                                            passwordStrength
                                        )}`}
                                        style={{ width: `${passwordStrength}%` }}
                                    />
                                </div>
                            )}
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>
                    </div>
                    <Button className="w-full mt-6" type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </form>
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>
                <SocialAuth />
            </CardContent>
            <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline">
                        Login
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
