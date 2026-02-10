import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
    onUploadComplete: (url: string) => void;
}

export function ImageUploader({ onUploadComplete }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("You must select an image to upload.");
            }

            const file = event.target.files[0];
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({ message: "Upload failed" }));
                throw new Error(body.message || "Upload failed");
            }

            const data = await res.json();
            if (data.url) {
                onUploadComplete(data.url);
                toast({ title: "Image uploaded successfully" });
            }
        } catch (error: any) {
            toast({
                title: "Error uploading image",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setUploading(false);
            event.target.value = "";
        }
    };

    return (
        <div className="flex items-center gap-4">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
                {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                <span>{uploading ? "Uploading..." : "Upload Image"}</span>
                <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={uploading}
                />
            </label>
            <p className="text-xs text-muted-foreground hidden sm:block">
                Upload images for blog posts
            </p>
        </div>
    );
}
