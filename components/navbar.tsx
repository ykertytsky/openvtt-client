'use client';
import Logo from '@/public/logo.svg';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Separator } from './ui/separator';

export default function Navbar() {
    const { user, isLoading, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
        router.refresh();
    };

    return (
        <div className="flex justify-between items-center p-4 border-b border-border z-50">
            <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                    <Logo className="w-4 h-4 text-primary" fill="currentColor" />
                    <span className="font-medium">OpenVTT</span>
                </div>
                <div className="flex items-center gap-2">
                <Separator
                    orientation="vertical"
                    className="h-6"
                />
                <Link href="/home">Home</Link>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {isLoading ? (
                    <div className="h-9 w-20 animate-pulse bg-muted rounded" />
                ) : user ? (
                    <>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span>{user.displayName}</span>
                        </div>
                        <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="w-4 h-4" />
                            Logout
                        </Button>
                    </>
                ) : (
                    <Button variant="outline" asChild>
                        <Link href="/login">
                            <LogIn className="w-4 h-4" />
                            Login
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    )
}
