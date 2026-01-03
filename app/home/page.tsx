'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import UserCampaigns from './components/userCampaigns';

export default function HomePage() {
    const { user, isLoading: isAuthLoading } = useAuth();

    // Show loading state while auth is initializing
    // Middleware handles redirects, so if we reach here, user is authenticated
    if (isAuthLoading) {
        return (
            <div className="flex flex-col h-full w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            <h1 className="text-xl sm:text-2xl font-bold">Welcome back, {user?.displayName}!</h1>
            <UserCampaigns />
        </div>
    );
}
