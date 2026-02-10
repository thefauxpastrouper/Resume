/**
 * Central API helper for all D1-backed endpoints.
 * Replaces direct Supabase client calls.
 */

const BASE = import.meta.env.VITE_API_URL || "";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        ...options,
        credentials: "include", // send session cookie
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(body.message || body.error || res.statusText);
    }
    return res.json();
}

// ─── Blog Posts ───────────────────────────────────────────────
export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    cover_image: string | null;
    tags: string | null; // stored as JSON string in D1
    read_time: number | null;
    published: number; // 0 or 1 in SQLite
    author_id: string;
    created_at: string;
    updated_at: string;
}

export const blogApi = {
    list: (published?: boolean) =>
        request<BlogPost[]>(`/api/posts${published !== undefined ? `?published=${published}` : ""}`),

    get: (slug: string) =>
        request<BlogPost>(`/api/posts/${slug}`),

    create: (post: Omit<BlogPost, "id" | "created_at" | "updated_at">) =>
        request<BlogPost>("/api/posts", { method: "POST", body: JSON.stringify(post) }),

    update: (id: string, post: Partial<BlogPost>) =>
        request<BlogPost>(`/api/posts/${id}`, { method: "PUT", body: JSON.stringify(post) }),

    delete: (id: string) =>
        request<void>(`/api/posts/${id}`, { method: "DELETE" }),
};

// ─── Comments ────────────────────────────────────────────────
export interface Comment {
    id: string;
    content: string;
    post_id: string;
    user_id: string;
    user_name: string | null;
    created_at: string;
}

export const commentsApi = {
    list: (postId: string) =>
        request<Comment[]>(`/api/comments?post_id=${postId}`),

    create: (comment: { content: string; post_id: string }) =>
        request<Comment>("/api/comments", { method: "POST", body: JSON.stringify(comment) }),

    delete: (id: string) =>
        request<void>(`/api/comments/${id}`, { method: "DELETE" }),
};
