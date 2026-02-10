/**
 * /api/upload – POST upload an image to R2
 */

interface Env {
    blog_images: R2Bucket;
    PUBLIC_URL?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return Response.json({ message: "No file provided" }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            return Response.json({ message: "Only image files are allowed" }, { status: 400 });
        }

        // Generate unique filename
        const ext = file.name.split(".").pop() || "png";
        const fileName = `${crypto.randomUUID()}.${ext}`;

        // Upload to R2
        await env.blog_images.put(fileName, file.stream(), {
            httpMetadata: {
                contentType: file.type,
            },
        });

        const origin = new URL(request.url).origin;
        const url = `${origin}/api/images/${fileName}`;

        return Response.json({ url }, { status: 201 });
    } catch (error: any) {
        return Response.json({ message: error.message || "Upload failed" }, { status: 500 });
    }
};
