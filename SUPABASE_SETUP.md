# Setting Up Supabase

This guide explains how to create your own Supabase project and replace the existing credentials.

## 1. Create a Supabase Project

1.  Go to [database.new](https://database.new) and sign in with GitHub.
2.  Create a new organization (if you don't have one).
3.  Create a new project:
    - **Name**: Give it a name (e.g., "Resume App").
    - **Database Password**: Generate a strong password and save it safely.
    - **Region**: Choose a region close to your users.
    - **Plan**: Select the **Free** plan ($0/month).

## 2. Get Your Credentials

Once your project is created (it may take a minute):

1.  Go to **Project Settings** (the cog icon at the bottom of the left sidebar).
2.  Select **API** from the list.
3.  Look for the **Project URL** and **Project API keys** section.
4.  Copy the following values:
    - **Project URL** (e.g., `https://xyz.supabase.co`) -> This corresponds to `VITE_SUPABASE_URL`.
    - **anon** / **public** key -> This corresponds to `VITE_SUPABASE_ANON_KEY` (and `VITE_SUPABASE_PUBLISHABLE_KEY` in some contexts).
    - **Project ID** (optional, but good to know): It's the subdomain of your URL (e.g., `xyz`).

## 3. Update Your Environment Variables

1.  In your project root, open (or create) the `.env` file.
2.  Replace the existing values with your new credentials:

```env
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key-here"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key-here" # Usually the same as ANON_KEY for client-side usage
VITE_SUPABASE_PROJECT_ID="your-project-id"
```

## 4. Secure Your Data

- The `anon` key is safe to expose in the browser (client-side), but you should configure **Row Level Security (RLS)** in Supabase to restrict access to your data.
- Never expose the `service_role` key in your client-side code.

### Why use the Anon Key?

You might be wondering why we use the `anon` (public) key in the frontend code.
- **Client-Side Security Model**: Supabase is designed to be accessed directly from the client (browser). The `anon` key identifies the user as an anonymous API user.
- **RLS is the Firewall**: Security is NOT enforced by hiding the key (since anyone inspecting the network tab can see it). Instead, security is enforced by **Postgres Row Level Security (RLS)** policies on your database tables.
- **Service Role is for Admin**: The `service_role` key bypasses all RLS policies. It essentially gives "root" access. This should **ONLY** be used in secure backend environments (like Cloudflare Workers, Node.js servers, or GitHub Actions) and **NEVER** in the `.env` file that gets built into your frontend application.


## 5. Deployment

Remember to add these same environment variables to your Cloudflare Pages project settings (Production and Preview environments) so your deployed app works correctly.
