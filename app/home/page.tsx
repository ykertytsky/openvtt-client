'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/hooks/useAuth';
import { Plus } from 'lucide-react';
import { redirect } from 'next/navigation';

export default function HomePage() {
    const { user, isAuthenticated } = useAuth();

    // TODO: Guard against unauthorized access
    if (!isAuthenticated) {
        redirect('/login');
    }

    return (
        <div className="flex flex-col h-full mx-auto max-w-7xl my-8">
            <h1 className="text-2xl font-bold">Welcome back, {user?.displayName}!</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <h2 className="text-lg font-bold col-span-3">Your Campaigns</h2>
                {/* Cards for the user's campaigns */}

                {/* Special card to create a new campaign */}
                <Card className="aspect-video flex items-center justify-center">
                    <CardContent className="flex items-center justify-center p-0">
                        <Button variant="outline" size="icon">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}