"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldGroup, FieldError } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(1, { message: "World name is required" }).max(255, { message: "World name must be less than 255 characters" }),
  description: z.string().max(255, { message: "Description must be less than 255 characters" }).optional().or(z.literal("")),
});

type CreateWorldFormProps = {
  coverImageId?: string;
  onSubmit: (data: { name: string; description?: string; coverImageId?: string }) => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

export default function CreateWorldForm({ coverImageId, onSubmit, isLoading, error }: CreateWorldFormProps) {
  const router = useRouter();

  type FormData = {
    name: string;
    description?: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    await onSubmit({
      name: data.name,
      description: data.description || undefined,
      coverImageId: coverImageId || undefined,
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-medium">
          Create New World
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel>World Name *</FieldLabel>
              <Input
                type="text"
                placeholder="My Amazing Campaign"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>
            <Field data-invalid={!!errors.description}>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                placeholder="A brief description of your world..."
                aria-invalid={!!errors.description}
                {...register("description")}
                rows={3}
              />
              {errors.description && <FieldError>{errors.description.message}</FieldError>}
            </Field>
          </FieldGroup>
          {error && (
            <div className="text-destructive text-sm text-center">{error}</div>
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create World"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


