"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

export function SocialAuth() {
    const onClick = (provider: "google") => {
        signIn(provider, {
            callbackUrl: "/dashboard",
        });
    };

    return (
        <div className="flex items-center w-full gap-x-2">
            <Button
                size="lg"
                className="w-full"
                variant="outline"
                onClick={() => onClick("google")}
            >
                <Icons.google className="h-5 w-5 mr-2" />
                Continue with Google
            </Button>
        </div>
    );
}
