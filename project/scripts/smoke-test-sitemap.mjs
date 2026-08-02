import { createClient } from "@supabase/supabase-js";

const siteUrl = process.env.SITE_URL || "https://www.pharmos.in";
const sitemapUrl = `${siteUrl}/sitemap.xml`;
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

const latestResponse = await fetch(sitemapUrl);

if (!latestResponse.ok) {
  console.error(`Sitemap check failed: expected HTTP 200 from ${sitemapUrl}, received ${latestResponse.status}.`);
  process.exit(1);
}

const sitemapXml = await latestResponse.text();

const { data, error } = await supabase
  .from("blogs")
  .select("slug, updated_at")
  .eq("status", "published")
  .order("updated_at", { ascending: false, nullsLast: true })
  .limit(1);

if (error) {
  console.error(`Supabase query failed: ${error.message}`);
  process.exit(1);
}

if (!data || data.length === 0) {
  console.error("No published blogs found in Supabase. Nothing to verify.");
  process.exit(1);
}

const newestBlog = data[0];
const blogUrl = `${siteUrl}/blog/${encodeURIComponent(newestBlog.slug)}`;
const existsInSitemap = sitemapXml.includes(`<loc>${blogUrl}</loc>`);

if (!existsInSitemap) {
  console.error(`Smoke test failed: ${blogUrl} is missing from ${sitemapUrl}.`);
  process.exit(1);
}

console.log(`Smoke test passed: ${sitemapUrl} returned 200 and includes ${blogUrl}.`);
