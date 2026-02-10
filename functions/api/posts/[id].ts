/**
 * /api/posts/:id – GET (by slug), PUT (update), DELETE
 */

interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
    const slug = params.id as string;
    const post = await env.DB.prepare(
        "SELECT * FROM blog_posts WHERE slug = ? AND published = 1"
    ).bind(slug).first();

    if (!post) {
        return Response.json({ message: "Post not found" }, { status: 404 });
    }

    return Response.json({
        ...post,
        tags: (post as any).tags ? JSON.parse((post as any).tags) : null,
    });
};

export const onRequestPut: PagesFunction<Env> = async ({ params, request, env }) => {
    const id = params.id as string;
    const body = await request.json() as any;
    const now = new Date().toISOString();

    await env.DB.prepare(
        `UPDATE blog_posts SET title = ?, slug = ?, excerpt = ?, content = ?, cover_image = ?, tags = ?, read_time = ?, published = ?, updated_at = ? WHERE id = ?`
    ).bind(
        body.title,
        body.slug,
        body.excerpt || null,
        body.content,
        body.cover_image || null,
        body.tags ? JSON.stringify(body.tags) : null,
        body.read_time || 5,
        body.published ? 1 : 0,
        now,
        id
    ).run();

    return Response.json({ success: true });
};

export const onRequestDelete: PagesFunction<Env> = async ({ params, env }) => {
    const id = params.id as string;
    await env.DB.prepare("DELETE FROM blog_posts WHERE id = ?").bind(id).run();
    return Response.json({ success: true });
};
