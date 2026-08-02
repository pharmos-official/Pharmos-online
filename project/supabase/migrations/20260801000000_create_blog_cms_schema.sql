-- Blog CMS schema migration for Supabase
-- Creates the core tables for blogs, categories, tags, blog_tag relationships, and blog images.
-- Row Level Security is enabled and policies are added for authenticated write access.

create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  featured_image_url text,
  seo_title text,
  seo_description text,
  seo_keywords text,
  canonical_url text,
  og_title text,
  og_description text,
  twitter_card text,
  breadcrumb_schema text,
  faq_schema text,
  article_schema text,
  reading_time integer,
  author_id uuid,
  category_id uuid,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blogs_category_fk foreign key (category_id) references public.categories(id) on delete set null,
  constraint blogs_author_fk foreign key (author_id) references auth.users(id) on delete set null
);

create table if not exists public.blog_tag (
  blog_id uuid not null,
  tag_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (blog_id, tag_id),
  constraint blog_tag_blog_fk foreign key (blog_id) references public.blogs(id) on delete cascade,
  constraint blog_tag_tag_fk foreign key (tag_id) references public.tags(id) on delete cascade
);

create table if not exists public.blog_images (
  id uuid primary key default gen_random_uuid(),
  blog_id uuid not null,
  image_url text not null,
  alt_text text,
  caption text,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  constraint blog_images_blog_fk foreign key (blog_id) references public.blogs(id) on delete cascade
);

create index if not exists idx_blogs_slug on public.blogs(slug);
create index if not exists idx_blogs_status_published_at on public.blogs(status, published_at desc);
create index if not exists idx_blogs_category_id on public.blogs(category_id);
create index if not exists idx_blogs_author_id on public.blogs(author_id);
create index if not exists idx_blog_tag_tag_id on public.blog_tag(tag_id);
create index if not exists idx_blog_images_blog_id on public.blog_images(blog_id);
create index if not exists idx_blog_images_featured on public.blog_images(blog_id, is_featured);
create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_tags_slug on public.tags(slug);

alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.blogs enable row level security;
alter table public.blog_tag enable row level security;
alter table public.blog_images enable row level security;

create policy "Categories are viewable by everyone"
on public.categories
for select
using (true);

create policy "Categories are editable by authenticated users"
on public.categories
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Tags are viewable by everyone"
on public.tags
for select
using (true);

create policy "Tags are editable by authenticated users"
on public.tags
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Blogs are viewable by everyone"
on public.blogs
for select
using (true);

create policy "Blogs are editable by authenticated users"
on public.blogs
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Blog tag relationships are viewable by everyone"
on public.blog_tag
for select
using (true);

create policy "Blog tag relationships are editable by authenticated users"
on public.blog_tag
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Blog images are viewable by everyone"
on public.blog_images
for select
using (true);

create policy "Blog images are editable by authenticated users"
on public.blog_images
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');
