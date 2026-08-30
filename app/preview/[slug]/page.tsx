import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Invitation from "../../components/Invitation";
import { TEMPLATES, getTemplate } from "../../templates";

interface PreviewPageProps {
  params: Promise<{ slug: string }>;
}

// Semua tema di registry di-prerender saat build - satu-satunya daftar yang
// perlu dijaga tetap sinkron ada di app/templates/index.ts.
export function generateStaticParams() {
  return TEMPLATES.map((template) => ({ slug: template.slug }));
}

export async function generateMetadata({
  params,
}: PreviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) return {};

  return {
    title: `The Wedding of ${template.coupleNames}`,
    description: template.weddingDate,
  };
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) notFound();

  return <Invitation template={template} />;
}
