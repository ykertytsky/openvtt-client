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

    const handleFileUpload = async (file: File) => {
        console.log('[UPLOAD] Starting file upload:', { name: file.name, size: file.size, type: file.type });
        setCoverImageFile(file);
        setError(null);
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setCoverImagePreview(base64String);
        };
        reader.readAsDataURL(file);

        // Upload to backend
        try {
            console.log('[UPLOAD] Calling uploadAsset mutation...');
            const result = await uploadAsset({
                file,
                folder: 'worlds/temp',
            }).unwrap();
            
            console.log('[UPLOAD] Upload successful:', result);
            setCoverImageAssetId(result.assetId);
            // Update preview with presigned URL
            setCoverImagePreview(result.presignedUrl);
        } catch (err) {
            console.error('[UPLOAD] Upload failed:', err);
            setError("Failed to upload image. Please try again.");
            setCoverImageFile(null);
            setCoverImagePreview(null);
        }
    };

    const handleDrop = (acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
        console.log('[DROPZONE] onDrop called:', { 
            acceptedCount: acceptedFiles.length, 
            rejectedCount: fileRejections.length,
            rejections: fileRejections.map(r => ({ file: r.file.name, errors: r.errors }))
        });
        
        if (fileRejections.length > 0) {
            const errorMessage = fileRejections[0]?.errors[0]?.message || "File rejected";
            console.error('[DROPZONE] File rejected:', errorMessage);
            setError(`File rejected: ${errorMessage}`);
            return;
        }
        if (acceptedFiles.length > 0) {
            console.log('[DROPZONE] File accepted, starting upload:', acceptedFiles[0].name);
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
            const worldData = {
                name: data.name,
                description: data.description || undefined,
                coverImageId: data.coverImageId || undefined,
            };

            const result = await createWorld(worldData).unwrap();
            router.push(`/world/${result.world.id}`);
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
            <div className="w-1/2 relative overflow-hidden border-l border-border flex flex-col items-center justify-center p-4">
                {coverImagePreview ? (
                    <div className="relative w-full h-full max-w-2xl aspect-video rounded-none border border-border overflow-hidden">
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
                            className="absolute top-2 right-2"
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
                                console.error('[DROPZONE] Error:', err);
                                setError(err.message || "Error with file upload");
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
                    </div>
                )}
            </div>
        </div>
    );
}
