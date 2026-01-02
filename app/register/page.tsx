import Image from "next/image";
import Cover from '@/public/cover.png';

import RegisterForm from './register-form';

export default function RegisterPage() {
    return (
        <div className="flex h-[calc(100vh-57px)]">
            {/* Form */}
            <div className="w-1/2 flex items-center justify-center">
                <RegisterForm />
            </div>
            {/* Image */}
            <div className="w-1/2 relative overflow-hidden border-l border-border">
                <Image 
                    src={Cover} 
                    alt="Register" 
                    fill
                    className="object-cover"
                    priority
                />
            </div>
        </div>
    )
}