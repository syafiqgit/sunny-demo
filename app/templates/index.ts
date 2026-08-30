import { sunny } from "./sunny";
import type { TemplateConfig } from "@/app/lib/content";

/**
 * Daftar tema. Urutannya = urutan kartu di landing page.
 *
 * Satu-satunya tempat yang perlu disentuh saat menambah tema: impor
 * berkasnya, taruh di sini, selesai. Landing page, route /preview/[slug], dan
 * daftar halaman yang di-prerender semuanya membaca dari sini, jadi ketiganya
 * tidak bisa saling ketinggalan.
 */
export const TEMPLATES: TemplateConfig[] = [sunny];

const BY_SLUG = new Map(TEMPLATES.map((template) => [template.slug, template]));

export function getTemplate(slug: string): TemplateConfig | undefined {
  return BY_SLUG.get(slug);
}

export type { TemplateConfig };
