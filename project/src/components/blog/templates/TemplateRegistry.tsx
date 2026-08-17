import type { ComponentType } from "react";
import type { BlogTemplateData, BlogTemplateMeta, TemplateId } from "../../../types/blogTemplate";
import ClassicTemplate from "./Classic";
import EditorialTemplate from "./Editorial";
import HeroMagazineTemplate from "./HeroMagazine";
import MagazineTemplate from "./Magazine";
import MinimalTemplate from "./Minimal";
import ModernTemplate from "./Modern";
import NewspaperTemplate from "./Newspaper";
import PremiumTemplate from "./Premium";
import StoryTemplate from "./Story";
import TravelTemplate from "./Travel";

export interface TemplateDefinition {
  meta: BlogTemplateMeta;
  component: ComponentType<{ data: BlogTemplateData }>;
}

export const TEMPLATE_DEFINITIONS: TemplateDefinition[] = [
  {
    meta: {
      id: "classic",
      name: "Classic",
      description: "The default blog layout used by existing posts.",
      accent: "bg-slate-900",
      previewBg: "bg-white",
      previewText: "text-slate-900",
      previewAccent: "text-slate-900",
    },
    component: ClassicTemplate,
  },
  {
    meta: {
      id: "hero-magazine",
      name: "Hero Magazine",
      description: "Full hero image with large editorial heading for long-form reading.",
      accent: "bg-sky-900",
      previewBg: "bg-white",
      previewText: "text-slate-900",
      previewAccent: "text-sky-900",
    },
    component: HeroMagazineTemplate,
  },
  {
    meta: {
      id: "magazine",
      name: "Magazine",
      description: "Image/text sections with pull quotes and editorial typography.",
      accent: "bg-rose-900",
      previewBg: "bg-amber-50",
      previewText: "text-slate-900",
      previewAccent: "text-rose-900",
    },
    component: MagazineTemplate,
  },
  {
    meta: {
      id: "newspaper",
      name: "Newspaper",
      description: "Multi-column desktop layout, single-column on mobile.",
      accent: "bg-stone-900",
      previewBg: "bg-stone-50",
      previewText: "text-stone-900",
      previewAccent: "text-stone-900",
    },
    component: NewspaperTemplate,
  },
  {
    meta: {
      id: "editorial",
      name: "Editorial",
      description: "Premium typography with generous whitespace and large images.",
      accent: "bg-emerald-900",
      previewBg: "bg-white",
      previewText: "text-slate-900",
      previewAccent: "text-emerald-900",
    },
    component: EditorialTemplate,
  },
  {
    meta: {
      id: "modern",
      name: "Modern",
      description: "Clean layout with large type, cards, and modern spacing.",
      accent: "bg-indigo-700",
      previewBg: "bg-slate-50",
      previewText: "text-slate-900",
      previewAccent: "text-indigo-700",
    },
    component: ModernTemplate,
  },
  {
    meta: {
      id: "story",
      name: "Story",
      description: "Immersive, image-heavy visual storytelling.",
      accent: "bg-fuchsia-900",
      previewBg: "bg-neutral-950",
      previewText: "text-white",
      previewAccent: "text-amber-400",
    },
    component: StoryTemplate,
  },
  {
    meta: {
      id: "minimal",
      name: "Minimal",
      description: "Simple, whitespace-focused design for highly readable articles.",
      accent: "bg-zinc-800",
      previewBg: "bg-white",
      previewText: "text-zinc-900",
      previewAccent: "text-zinc-800",
    },
    component: MinimalTemplate,
  },
  {
    meta: {
      id: "travel",
      name: "Travel",
      description: "Photography-focused layout with location styling.",
      accent: "bg-teal-800",
      previewBg: "bg-teal-50",
      previewText: "text-slate-900",
      previewAccent: "text-teal-800",
    },
    component: TravelTemplate,
  },
  {
    meta: {
      id: "premium",
      name: "Premium",
      description: "Luxury editorial/magazine appearance for premium content.",
      accent: "bg-amber-900",
      previewBg: "bg-amber-50",
      previewText: "text-amber-950",
      previewAccent: "text-amber-900",
    },
    component: PremiumTemplate,
  },
];

const templateMap = new Map<string, TemplateDefinition>(
  TEMPLATE_DEFINITIONS.map((definition) => [definition.meta.id, definition]),
);

export function getTemplateDefinition(id: TemplateId | string | null | undefined): TemplateDefinition {
  return templateMap.get(id ?? "") ?? TEMPLATE_DEFINITIONS[0];
}
