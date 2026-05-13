import { createFileRoute } from "@tanstack/react-router";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL as string;

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const host = `${url.protocol}//${url.host}`;

        const staticPaths = [
          "/",
          "/projects",
          "/blog",
          "/services/architecture",
          "/services/engineering",
          "/services/consulting",
          "/services/3d",
          "/services/urban",
          "/services/projects",
          "/privacy",
          "/terms",
        ];

        const convex = new ConvexHttpClient(CONVEX_URL);
        const projects = await convex.query(api.projects.list, {});
        const posts = await convex.query(api.posts.listPublished, {});

        const projectPaths = projects.map(
          (p: { slug: string }) => `/projects/${p.slug}`,
        );
        const postPaths = posts.map(
          (p: { slug: string }) => `/blog/${p.slug}`,
        );

        const allPaths = [...staticPaths, ...projectPaths, ...postPaths];

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPaths
  .map(
    (path) =>
      `  <url>\n    <loc>${host}${path}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${path === "/" ? "1.0" : "0.7"}</priority>\n  </url>`,
  )
  .join("\n")}
</urlset>`;

        return new Response(sitemap, {
          headers: {
            "Content-Type": "application/xml",
          },
        });
      },
    },
  },
});
