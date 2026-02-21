import { betterAuth } from "better-auth";
import { d1Adapter } from "better-auth/adapters/d1";

export const auth = betterAuth({
    database: d1Adapter({
        binding: "DB", // Must match binding in wrangler.toml
        provider: "d1",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true
    },
    emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            console.log(`[Email Verification] Provide this URL to verify ${user.email}: ${url}`);
            // In a real app, integrate Resend or Nodemailer here
        }
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || ""
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        },
    },
});
