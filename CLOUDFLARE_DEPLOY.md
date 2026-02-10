# Deploying to Cloudflare Pages

This guide outlines how to deploy your Resume application to Cloudflare Pages using the **Free Tier**.

## Prerequisites

- A Cloudflare account.
- A GitHub repository containing your project code.

## Why Cloudflare Pages Free Tier?

The Free Tier is excellent for personal projects and includes:
- **Unlimited sites**
- **Unlimited requests**
- **Unlimited bandwidth**
- **500 builds per month** (more than enough for most personal workflows)

## Deployment Steps via GitHub Integration (Recommended)

1.  **Log in to the Cloudflare Dashboard.**
2.  Go to **Workers & Pages** > **Create application**.
    - If you see a "Ship something new" card with "Looking to deploy Pages? Get started" at the bottom, click that **"Get started"** link.
    - Otherwise, select the **Pages** tab and click **Connect to Git**.
3.  Select your GitHub repository.
4.  **Configure builds**:
    - **Framework preset**: `Vite`
    - **Build command**: `bun run build`
    - **Output directory**: `dist`
5.  **Environment Variables**:
    - Add any necessary environment variables (e.g., `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in the **Settings** > **Environment variables** section of your Pages project.
6.  Click **Save and Deploy**.

## Deployment via GitHub Actions (Custom CI/CD)

If you prefer more control or want to use the workflow included in this repo (`.github/workflows/deploy.yml`), you need to set up secrets in your GitHub repository.

1.  **Create Project in Cloudflare**:
    - Go to **Workers & Pages** > **Create application** > **Pages** > **Create using Direct Upload**.
    - Enter the project name as `resume` (must match `projectName` in `.github/workflows/deploy.yml`).
    - Click **Create project**.

2.  **Get Cloudflare Credentials**:
    - **Account ID**: Found in the Cloudflare Dashboard URL or sidebar.
    - **API Token**: Go to **My Profile** > **API Tokens** > **Create Token**. Use the "Edit Cloudflare Workers" template or create a custom token with "Pages:Edit" permissions.

3.  **Add Secrets to GitHub**:
    - Go to your GitHub Repo > **Settings** > **Secrets and variables** > **Actions**.
    - Add `CLOUDFLARE_ACCOUNT_ID`.
    - Add `CLOUDFLARE_API_TOKEN`.

4.  **Push to `main`**: The workflow will automatically build and deploy your site.

## Cost Management

To ensure you stay within the Free Tier:
- Monitor your build usage in the Cloudflare Dashboard.
- The 500 builds/month limit is generous, but if you push extremely frequently, keep an eye on it.
- Bandwidth and requests are unlimited, so traffic won't cost you anything.
