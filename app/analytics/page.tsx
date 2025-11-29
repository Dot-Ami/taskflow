import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getAnalyticsData } from "@/actions/analytics";
import { StatsCards } from "@/components/analytics/StatsCards";
import { Charts } from "@/components/analytics/Charts";
import { UserMenu } from "@/components/layout/UserMenu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AnalyticsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const data = await getAnalyticsData();

    if (!data) {
        return (
            <div className="container mx-auto py-10">
                <p>Failed to load analytics data.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                            <p className="text-muted-foreground">
                                Insights into your productivity.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <UserMenu />
                    </div>
                </div>

                <StatsCards data={data.counts} />
                <Charts
                    categoryData={data.charts.category}
                    priorityData={data.charts.priority}
                />
            </div>
        </div>
    );
}
