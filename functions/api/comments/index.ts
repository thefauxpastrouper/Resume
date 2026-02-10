/**
 * /api/comments – GET (list by post_id) and POST (create)
 */
import { betterAuth } from "better-auth";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";

interface Env {
    DB: D1Database;
    BETTER_AUTH_SECRET?: string;
}

function getAuth(env: Env) {
    const db = new Kysely<any>({ dialect: new D1Dialect({ database: env.DB }) });
    return betterAuth({
        database: { db, type: "sqlite" },
        secret: env.BETTER_AUTH_SECRET || "dev-secret-change-me",
        emailAndPassword: { enabled: true },
    });
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
    const url = new URL(request.url);
    const postId = url.searchParams.get("post_id");
    if (!postId) {
        return Response.json({ message: "post_id is required" }, { status: 400 });
    }

    const { results } = await env.DB.prepare(
        `SELECT c.id, c.content, c.post_id, c.user_id, c.created_at, u.name as user_name
         FROM comments c
         LEFT JOIN user u ON c.user_id = u.id
         WHERE c.post_id = ?
         ORDER BY c.created_at ASC`
    ).bind(postId).all();

    return Response.json(results || []);
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
    const auth = getAuth(env);
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json() as any;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await env.DB.prepare(
        "INSERT INTO comments (id, content, post_id, user_id, created_at) VALUES (?, ?, ?, ?, ?)"
    ).bind(id, body.content, body.post_id, session.user.id, now).run();

    return Response.json({
        id,
        content: body.content,
        post_id: body.post_id,
        user_id: session.user.id,
        user_name: session.user.name,
        created_at: now,
    }, { status: 201 });
};
