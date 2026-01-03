'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useGetWorldsQuery } from '@/lib/store/slices/worldsApi';
import { useAuth } from '@/lib/hooks/useAuth';
import WorldCard from './worldCard';

export default function UserCampaigns() {
    const { isAuthenticated } = useAuth();
    
    const { data: worldsData, isLoading, error } = useGetWorldsQuery(
        {
            page: 1,
            limit: 10,
            sortBy: 'createdAt',
            sortOrder: 'desc',
        },
        {
            skip: !isAuthenticated,
        }
    );

    const worlds = worldsData?.worlds || [];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <h2 className="text-base sm:text-lg font-bold col-span-full">Your Campaigns</h2>
                <div className="col-span-full text-muted-foreground">Loading worlds...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <h2 className="text-base sm:text-lg font-bold col-span-full">Your Campaigns</h2>
                <div className="col-span-full text-destructive">Error loading worlds. Please try again.</div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <h2 className="text-base sm:text-lg font-bold col-span-full">Your Campaigns</h2>
            {worlds.map((world) => (
                <WorldCard key={world.id} world={world} />
            ))}
            <Card className="aspect-video flex items-center justify-center">
                <CardContent className="flex items-center justify-center p-0">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/home/create-new-world">
                            <Plus className="w-4 h-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
