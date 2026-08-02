import { createClient } from "@supabase/supabase-js";

function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildUrlItem(loc: string, lastmod?: string) {
  const lastmodXml = lastmod ? `<lastmod>${xmlEscape(lastmod)}</lastmod>` : "";
  return `  <url>\n    <loc>${xmlEscape(loc)}</loc>\n${lastmodXml}  </url>`;
}

function normalizeSiteUrl(url: string) {
  return url.replace(/\/$/, "");
}

export async function onRequest(context: { env: Record<string, string | undefined> }) {
  const siteUrl = normalizeSiteUrl(context.env.SITE_URL || context.env.CF_PAGES_URL || "https://www.pharmos.in");
  const supabaseUrl = context.env.SUPABASE_URL || context.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = context.env.SUPABASE_ANON_KEY || context.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response(
      `Missing Supabase environment configuration for sitemap generation.`,
      {
        status: 500,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const { data, error } = await supabase
    .from("blogs")
    .select("slug, updated_at")
    .eq("status", "published")
    .order("updated_at", { ascending: false, nullsFirst: false });

  if (error) {

    return new Response(error.message, {
      status: 500,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  const publishedPosts = (data ?? []) as Array<{ slug: string; updated_at?: string | null }>;

  const urlEntries = [
    buildUrlItem(`${siteUrl}/`),
    buildUrlItem(`${siteUrl}/blog`),
    ...publishedPosts.map((post) => {
      const lastmod = post.updated_at ?? undefined;
      return buildUrlItem(`${siteUrl}/blog/${encodeURIComponent(post.slug)}`, lastmod);
    }),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries.join("\n")}\n</urlset>\n`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
