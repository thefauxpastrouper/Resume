/**
 * /api/posts – GET (list) and POST (create) blog posts
 */

interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
    const url = new URL(request.url);
    const published = url.searchParams.get("published");

    let query: string;
    let params: any[] = [];
    if (published === "true") {
        query = "SELECT * FROM blog_posts WHERE published = 1 ORDER BY created_at DESC";
    } else if (published === "false") {
        query = "SELECT * FROM blog_posts WHERE published = 0 ORDER BY created_at DESC";
    } else {
        query = "SELECT * FROM blog_posts ORDER BY created_at DESC";
    }

    const { results } = await env.DB.prepare(query).bind(...params).all();
    // Parse tags JSON string back to array
    const posts = (results || []).map((post: any) => ({
        ...post,
        tags: post.tags ? JSON.parse(post.tags) : null,
    }));
    return Response.json(posts);
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
    const body = await request.json() as any;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await env.DB.prepare(
        `INSERT INTO blog_posts (id, title, slug, excerpt, content, cover_image, tags, read_time, published, author_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
        id,
        body.title,
        body.slug,
        body.excerpt || null,
        body.content,
        body.cover_image || null,
        body.tags ? JSON.stringify(body.tags) : null,
        body.read_time || 5,
        body.published ? 1 : 0,
        body.author_id,
        now,
        now
    ).run();

    return Response.json({ id, ...body, created_at: now, updated_at: now }, { status: 201 });
};
