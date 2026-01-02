import Image from "next/image";
import Cover from '@/public/cover.png';

import LoginForm from './login-form';

export default function LoginPage() {
    return (
        <div className="flex h-[calc(100vh-57px)]">
            {/* Form */}
            <div className="w-1/2 flex items-center justify-center">
                <LoginForm />
            </div>
            {/* Image */}
            <div className="w-1/2 relative overflow-hidden border-l border-border">
                <Image 
                    src={Cover} 
                    alt="Login" 
                    fill
                    className="object-cover"
                    priority
                />
            </div>
        </div>
    )
}