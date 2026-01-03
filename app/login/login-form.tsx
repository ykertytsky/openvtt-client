"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup, FieldError } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/lib/hooks/useAuth";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormData = z.infer<typeof schema>;

export default function LoginForm() {
  const router = useRouter();
  const { login, isLoginLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);

    try {
      await login(data.email, data.password);
      router.push("/home");
      router.refresh();
    } catch (err) {
      if (err && typeof err === 'object' && 'data' in err) {
        const errorData = (err as { data: { message?: string } }).data;
        setError(errorData?.message || "Invalid email or password");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-medium">
          Get back to adventures
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!errors.email}>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>
            <Field data-invalid={!!errors.password}>
              <FieldLabel>Password</FieldLabel>
              <Input
                type="password"
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <FieldError>{errors.password.message}</FieldError>
              )}
            </Field>
          </FieldGroup>
          {error && (
            <div className="text-destructive text-sm text-center">{error}</div>
          )}
          <Button type="submit" className="w-full" disabled={isLoginLoading}>
            {isLoginLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <div className="mt-2">
          <Link
            href="/register"
            className="text-sm text-muted-foreground w-full flex justify-center"
          >
            Don&apos;t have an account? Register
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
