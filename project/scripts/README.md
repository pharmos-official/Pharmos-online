# Sitemap smoke test

This script is a standalone verification helper for the Blog CMS sitemap.

## What it checks

- `/sitemap.xml` is reachable over HTTP
- the response status is `200`
- the newest published blog URL exists in the sitemap XML

## How to run locally

From the repo root:

```bash
cd project
SITE_URL=https://www.pharmos.in \
SUPABASE_URL=https://<your-project>.supabase.co \
SUPABASE_ANON_KEY=<your-anon-key> \
node scripts/smoke-test-sitemap.mjs
```

## What this test is for

Use it right after publishing a new blog post. If the sitemap request fails or the new blog URL is not present, the script exits with a non-zero status.
