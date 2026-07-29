import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegacyShell, PortfolioDetailsContent } from "@/components/legacy-site";
import { brandingName, getProjectBySlug, projects } from "@/lib/portfolio-data";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: `Project Not Found | ${brandingName}`,
    };
  }

  return {
    title: `${project.name} Case Study | ${brandingName}`,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <LegacyShell bodyClassName="portfolio-details-page">
      <PortfolioDetailsContent project={project} />
    </LegacyShell>
  );
}
