-- Add template_id column to blogs table for template selection
-- Old blogs without template_id will fall back to the "classic" template in the frontend.

alter table public.blogs
  add column if not exists template_id text;

create index if not exists idx_blogs_template_id on public.blogs(template_id);