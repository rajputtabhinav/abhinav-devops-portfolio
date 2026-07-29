import type { MetadataRoute } from "next";
import { projects } from "@/lib/portfolio-data";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [""];
  const projectRoutes = projects.map((project) => `/portfolio/${project.slug}`);

  return [...staticRoutes, ...projectRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}
