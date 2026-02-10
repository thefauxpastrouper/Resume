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

## Custom Domain Setup (Namecheap)

To connect your custom domain (e.g., `yourname.com`) registered on Namecheap to your Cloudflare Pages site:

### Step 1: Add Domain to Cloudflare Pages
1.  Go to your **Pages project** in the Cloudflare Dashboard.
2.  Click on the **Custom domains** tab.
3.  Click **Set up a custom domain**.
4.  Enter your domain name (e.g., `yourname.com`) and click **Continue**.

### Step 2: Configure DNS (The "Full Setup" Method)
Cloudflare will likely ask you to update your nameservers. This is the recommended method as it gives you Cloudflare's full security and performance benefits.

1.  Cloudflare will show you two nameservers (e.g., `bob.ns.cloudflare.com` and `alice.ns.cloudflare.com`). **Copy these.**
2.  **Log in to Namecheap**.
3.  Go to your **Domain List** and click **Manage** next to your domain.
4.  Find the **Nameservers** section.
5.  Select **Custom DNS** from the dropdown.
6.  Enter the two Cloudflare nameservers you copied in Step 1.
7.  Click the green checkmark to save.

### Step 3: Verification
1.  Go back to Cloudflare and click **Check nameservers**.
2.  It may take anywhere from a few minutes to 24 hours for the DNS to propagate, but it's usually quite fast.
3.  Once active, Cloudflare will automatically provision an SSL certificate for you.

### Alternative: CNAME Setup
If you cannot change nameservers, you can use a CNAME record.
1.  In Cloudflare Pages custom domain setup, if it offers a CNAME option, copy the target (e.g., `resume.pages.dev`).
2.  In Namecheap, keep "Namecheap BasicDNS".
3.  Go to **Advanced DNS**.
4.  Add a **CNAME Record**:
    - **Host**: `@` (or `www`)
    - **Value**: `resume.pages.dev` (or your project URL)
    - **TTL**: Automatic

## Cost Management

To ensure you stay within the Free Tier:
- Monitor your build usage in the Cloudflare Dashboard.
- The 500 builds/month limit is generous, but if you push extremely frequently, keep an eye on it.
- Bandwidth and requests are unlimited, so traffic won't cost you anything.
