/**
 * /api/images/:name – GET serve an image from R2
 */

interface Env {
    blog_images: R2Bucket;
}

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
    const name = params.name as string;
    const object = await env.blog_images.get(name);

    if (!object) {
        return new Response("Image not found", { status: 404 });
    }

    const headers = new Headers();
    headers.set("Content-Type", object.httpMetadata?.contentType || "image/png");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new Response(object.body, { headers });
};
