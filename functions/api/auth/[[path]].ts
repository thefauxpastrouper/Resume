import { betterAuth } from "better-auth";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";

interface Env {
    DB: D1Database;
    GITHUB_CLIENT_ID?: string;
    GITHUB_CLIENT_SECRET?: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    BETTER_AUTH_SECRET?: string;
    RESEND_API_KEY?: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const db = new Kysely<any>({
        dialect: new D1Dialect({ database: context.env.DB }),
    });

    const auth = betterAuth({
        database: {
            db,
            type: "sqlite",
        },
        secret: context.env.BETTER_AUTH_SECRET || "dev-secret-change-me",
        emailAndPassword: {
            enabled: true,
            requireEmailVerification: true,
        },
        emailVerification: {
            sendOnSignUp: true,
            sendVerificationEmail: async ({ user, url, token }, request) => {
                if (context.env.RESEND_API_KEY) {
                    try {
                        const res = await fetch("https://api.resend.com/emails", {
                            method: "POST",
                            headers: {
                                "Authorization": `Bearer ${context.env.RESEND_API_KEY}`,
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                from: 'onboarding@resend.dev',
                                to: user.email,
                                subject: 'Verify your email address',
                                html: `<p>Click <a href="${url}">here</a> to verify your email address.</p>`,
                            })
                        });

                        if (!res.ok) {
                            const errorData = await res.text();
                            console.error("Resend API failed:", res.status, errorData);
                        }
                    } catch (err) {
                        console.error("Fetch to Resend failed:", err);
                    }
                } else {
                    console.log(`[Email Verification] Provide this URL to verify ${user.email}: ${url}`);
                }
            },
        },
        socialProviders: {
            ...(context.env.GITHUB_CLIENT_ID && context.env.GITHUB_CLIENT_SECRET
                ? {
                    github: {
                        clientId: context.env.GITHUB_CLIENT_ID,
                        clientSecret: context.env.GITHUB_CLIENT_SECRET,
                    },
                }
                : {}),
            ...(context.env.GOOGLE_CLIENT_ID && context.env.GOOGLE_CLIENT_SECRET
                ? {
                    google: {
                        clientId: context.env.GOOGLE_CLIENT_ID,
                        clientSecret: context.env.GOOGLE_CLIENT_SECRET,
                    },
                }
                : {}),
        },
    });

    return auth.handler(context.request);
};
