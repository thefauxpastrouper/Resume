import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Loader2 } from "lucide-react";
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
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("blog-images")
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from("blog-images").getPublicUrl(filePath);

            if (data) {
                onUploadComplete(data.publicUrl);
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
            // Reset input
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
                Uploads to 'blog-images' bucket
            </p>
        </div>
    );
}
