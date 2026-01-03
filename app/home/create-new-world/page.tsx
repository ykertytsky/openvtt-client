'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Dropzone, DropzoneEmptyState, DropzoneContent } from "@/components/ui/shadcn-io/dropzone";
import { UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateWorldForm from './create-world-form';
import { useCreateWorldMutation } from "@/lib/store/slices/worldsApi";
import { useUploadAssetMutation } from "@/lib/store/slices/assetsApi";
import type { FileRejection, DropEvent } from "react-dropzone";

export default function CreateNewWorldPage() {
    const router = useRouter();
    const [createWorld, { isLoading: isCreatingWorld }] = useCreateWorldMutation();
    const [uploadAsset, { isLoading: isUploadingAsset }] = useUploadAssetMutation();
    const [error, setError] = useState<string | null>(null);
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
    const [coverImageAssetId, setCoverImageAssetId] = useState<string | null>(null);

    const handleFileUpload = (file: File) => {
        setCoverImageFile(file);
        setError(null);
        
        // Create preview only (don't upload yet - need worldId)
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setCoverImagePreview(base64String);
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (acceptedFiles: File[], fileRejections: FileRejection[], _event: DropEvent) => {
        
        if (fileRejections.length > 0) {
            const errorMessage = fileRejections[0]?.errors[0]?.message || "File rejected";
            setError(`File rejected: ${errorMessage}`);
            return;
        }
        if (acceptedFiles.length > 0) {
            handleFileUpload(acceptedFiles[0]);
            setError(null);
        }
    };

    const handleRemoveImage = () => {
        setCoverImageFile(null);
        setCoverImagePreview(null);
        setCoverImageAssetId(null);
    };

    const handleSubmit = async (data: { name: string; description?: string; coverImageId?: string }) => {
        setError(null);

        try {
            // Create world first (without coverImageId)
            const worldData = {
                name: data.name,
                description: data.description || undefined,
            };

            const result = await createWorld(worldData).unwrap();
            const worldId = result.world.id;

            // If there's a cover image file, upload it with the worldId
            if (coverImageFile) {
                try {
                    const uploadResult = await uploadAsset({
                        file: coverImageFile,
                        worldId,
                    }).unwrap();
                    
                    // Note: coverImageId is not set on world since we can't update it
                    // This would require an update world endpoint
                    setCoverImageAssetId(uploadResult.assetId);
                } catch (uploadErr) {
                    // Log but don't fail - world is already created
                    setError("World created but failed to upload cover image.");
                }
            }

            router.push(`/world/${worldId}`);
        } catch (err) {
            if (err && typeof err === 'object' && 'data' in err) {
                const errorData = (err as { data: { message?: string } }).data;
                setError(errorData?.message || "Failed to create world");
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
    };

    const isLoading = isCreatingWorld || isUploadingAsset;

    return (
        <div className="flex h-[calc(100vh-64px)]">
            {/* Form */}
            <div className="w-1/2 flex items-center justify-center p-4">
                <CreateWorldForm 
                    coverImageId={coverImageAssetId || undefined}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    error={error}
                />
            </div>
            {/* Cover Image Upload */}
            <div className="w-1/2 relative overflow-hidden border-l border-border flex flex-col items-center justify-center">
                {coverImagePreview ? (
                    <div className="relative w-full h-full rounded-none border border-border overflow-hidden">
                        <Image
                            src={coverImagePreview}
                            alt="Cover preview"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 z-10 backdrop-blur-sm hover:bg-background/50"
                            onClick={handleRemoveImage}
                        >
                            Remove
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-4 w-full max-w-md">
                        <Dropzone
                            onDrop={handleDrop}
                            onError={(err) => {
                                if (err.message === 'File is larger than 5242880 bytes') {
                                    setError("File is larger than 5MB. Please try again with a smaller file.");
                                } else {
                                    setError("Error with file upload. Please try again.");
                                }
                            }}
                            maxSize={5 * 1024 * 1024} // 5MB
                            accept={{
                                'image/*': ['.png', '.jpg', '.jpeg']
                            }}
                            src={coverImageFile ? [coverImageFile] : undefined}
                        >
                            <DropzoneEmptyState>
                                <UploadIcon className="w-10 h-10 text-muted-foreground" />
                                <h1 className="text-2xl font-medium">
                                    Upload your cover image
                                </h1>
                                <p className="text-xs text-muted-foreground">Drag and drop or click to upload</p>
                            </DropzoneEmptyState>
                            <DropzoneContent />
                        </Dropzone>
                        {error && <div className="text-destructive text-sm text-center">{error}</div>}
                    </div>
                )}
            </div>
        </div>
    );
}
