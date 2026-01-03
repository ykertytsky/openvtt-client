'use client';

import Image from "next/image";
import Link from "next/link";
import { useDeleteWorldMutation, World } from "@/lib/store/slices/worldsApi";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ArrowRight } from "lucide-react";
import { useGetAssetUrlQuery } from "@/lib/store/slices/assetsApi";
import { toast } from "sonner";

export default function WorldCard({ world }: { world: World }) {
    const { name, coverImageId } = world;
    const { data: assetUrlData, isLoading: isLoadingImage } = useGetAssetUrlQuery(coverImageId!, {
        skip: !coverImageId,
    });
    const [deleteWorld, { isLoading: isDeletingWorld }] = useDeleteWorldMutation();

    const handleDeleteWorld = async () => {
        await deleteWorld({ id: world.id });
        toast.success("World deleted successfully");
    };

    return (
        <div className="relative aspect-[16/9] overflow-hidden rounded-none ring-1 ring-foreground/10 bg-card group/card">
            {coverImageId && assetUrlData?.presignedUrl ? (
                <Image 
                    src={assetUrlData.presignedUrl} 
                    alt={name} 
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    unoptimized
                />
            ) : (
                <div className="w-full h-full bg-muted" />
            )}
            
            {/* Blurred bottom overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent backdrop-blur-xs p-4">
                <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-medium text-white truncate flex-1 min-w-0">
                        {name}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                        <Popover>
                        <PopoverTrigger asChild>
                        <Button 
                            variant="secondary" 
                            size="sm"
                            className="text-xs"
                            
                        >
                            Edit
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <Button variant="destructive" size="sm" className="text-xs" onClick={handleDeleteWorld}>
                                {isDeletingWorld ? "Deleting..." : "Delete"}
                            </Button>
                        </PopoverContent>
                        </Popover>
                        <Button 
                            variant="default" 
                            size="sm"
                            className="text-xs"
                            asChild
                        >
                            <Link href={`/world/${world.id}`}>
                                Launch
                                <ArrowRight className="ml-1 w-3.5 h-3.5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}