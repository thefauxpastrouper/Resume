/**
 * /api/comments/:id – DELETE a comment
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

export const onRequestDelete: PagesFunction<Env> = async ({ params, request, env }) => {
    const id = params.id as string;
    const auth = getAuth(env);
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const comment = await env.DB.prepare("SELECT user_id FROM comments WHERE id = ?").bind(id).first();
    if (!comment) {
        return Response.json({ message: "Comment not found" }, { status: 404 });
    }

    if ((comment as any).user_id !== session.user.id) {
        return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    await env.DB.prepare("DELETE FROM comments WHERE id = ?").bind(id).run();
    return Response.json({ success: true });
};
