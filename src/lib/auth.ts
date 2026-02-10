import { betterAuth } from "better-auth";
import { d1Adapter } from "better-auth/adapters/d1";

export const auth = betterAuth({
    database: d1Adapter({
        binding: "DB", // Must match binding in wrangler.toml
        provider: "d1",
    }),
    emailAndPassword: {
        enabled: true
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
