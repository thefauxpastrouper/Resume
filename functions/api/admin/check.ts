/**
 * /api/admin/check – GET check if user is admin
 */

interface Env {
    DB: D1Database;
}

const ADMIN_EMAILS = ["work.adityaswaroop@gmail.com"];

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get("user_id");

    if (!userId) {
        return Response.json({ isAdmin: false });
    }

    // Check by email in the user table
    const user = await env.DB.prepare(
        "SELECT email FROM user WHERE id = ?"
    ).bind(userId).first();

    if (user && ADMIN_EMAILS.includes((user as any).email)) {
        return Response.json({ isAdmin: true });
    }

    // Fallback: check user_roles table
    const role = await env.DB.prepare(
        "SELECT role FROM user_roles WHERE user_id = ? AND role = 'admin'"
    ).bind(userId).first();

    return Response.json({ isAdmin: !!role });
};
