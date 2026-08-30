import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Invitation from "@/app/components/Invitation";
import { TEMPLATES, getTemplate } from "@/app/templates";

interface PreviewPageProps {
  params: Promise<{ slug: string }>;
}

// Semua tema di registry di-prerender saat build - satu-satunya daftar yang
// perlu dijaga tetap sinkron ada di app/templates/index.ts.
export function generateStaticParams() {
  return TEMPLATES.map((template) => ({ slug: template.slug }));
}

// Katalognya tertutup: apa pun di luar generateStaticParams langsung 404.
// Tanpa ini Next merender slug asing on-demand dulu baru sampai ke notFound().
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PreviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) return {};

  const title = `The Wedding of ${template.coupleNames}`;
  const description = template.weddingDate;

  return {
    title,
    description,
    // Tautan undangan hampir selalu dibagikan lewat chat, jadi kartu preview-
    // nya memakai gambar sampul tema ini, bukan gambar situsnya.
    openGraph: {
      type: "article",
      title,
      description,
      images: [{ url: template.cardImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [template.cardImage],
    },
  };
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) notFound();

  return <Invitation template={template} />;
}
