"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/new-verification";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if (success || error) return;

        if (!token) {
            setError("Missing token!");
            return;
        }

        newVerification(token)
            .then((data) => {
                setSuccess(data.success);
                setError(data.error);
            })
            .catch(() => {
                setError("Something went wrong!");
            });
    }, [token, success, error]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                <CardTitle className="text-2xl text-center">Confirming your verification</CardTitle>
                <CardDescription className="text-center">
                    We are verifying your email address.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4">
                {!success && !error && (
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                )}
                {success && (
                    <div className="p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500 bg-emerald-500/15">
                        <p>{success}</p>
                    </div>
                )}
                {error && (
                    <div className="p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive bg-destructive/15">
                        <p>{error}</p>
                    </div>
                )}
                <Button variant="link" className="font-normal w-full" asChild>
                    <Link href="/login">Back to login</Link>
                </Button>
            </CardContent>
        </Card>
    );
};
