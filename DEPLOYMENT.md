# Deployment Guide

## GitHub Secrets Setup

### Required Secret Names (EXACT MATCH REQUIRED)

When adding secrets in GitHub, the names must match **exactly** (case-sensitive):

1. `VITE_SUPABASE_URL`
2. `VITE_SUPABASE_PUBLISHABLE_KEY`

### How to Add Secrets

1. Go to: `https://github.com/movinamubarak-byte/movinamubarak-byte.github.io/settings/secrets/actions`
2. Click **"New repository secret"**
3. For each secret:
   - **Name**: Must be exactly `VITE_SUPABASE_URL` (no spaces, exact case)
   - **Secret**: Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
   - Click **"Add secret"**
4. Repeat for `VITE_SUPABASE_PUBLISHABLE_KEY`

### Common Mistakes

❌ **Wrong**: `VITE_SUPABASE_URL ` (trailing space)  
❌ **Wrong**: `vite_supabase_url` (wrong case)  
❌ **Wrong**: `VITE_SUPABASE_URLS` (wrong name)  
✅ **Correct**: `VITE_SUPABASE_URL` (exact match)

### Verify Secrets Are Set

After adding secrets, the workflow will verify them. Check the Actions tab:
- If verification passes: ✅ "Environment variables are set"
- If verification fails: ❌ Error message showing which secret is missing

### Troubleshooting

If the deployment still shows the configuration error:

1. **Check the workflow logs**: Go to Actions → Latest workflow run → "Verify environment variables" step
2. **Verify secret names**: Make sure they match exactly (case-sensitive)
3. **Check secret values**: Make sure they're not empty and don't have extra spaces
4. **Re-run the workflow**: After fixing secrets, go to Actions → "Run workflow"

