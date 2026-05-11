import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { PageHeader } from "#/components/layout/PageHeader";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "#/components/ui/button";
import { getLocale } from "#/paraglide/runtime";
import { m } from "#/paraglide/messages";
import { getLocalizedValue } from "#/lib/localeField";

export const Route = createFileRoute("/blog/")({
  component: BlogPage,
});

function formatDate(dateStr: string, locale: string = "bg"): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === "bg" ? "bg-BG" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function BlogPage() {
  const posts = useQuery(api.posts.listPublished);
  const locale = getLocale();

  if (posts === undefined) {
    return (
      <main className="min-h-screen flex items-center justify-center px-5 pt-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
      </main>
    );
  }

  return (
    <main className="min-h-screen p-2 md:p-5 bg-transparent">
      <PageHeader
        title={
          locale === "bg" ? (
            <>
              Нашите <em className="italic font-light">статии</em>
            </>
          ) : (
            <>
              Our <em className="italic font-light">articles</em>
            </>
          )
        }
        subtitle={m["blog.subtitle"]()}
        className="md:mb-5 mb-2"
      />

      <div className="max-w-7xl mx-auto">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4 opacity-20">📝</p>
            <h2 className="font-display text-2xl font-bold text-[#1a1916] mb-3">
              {m["blog.empty"]()}
            </h2>
            <p className="text-stone-500">
              {locale === "bg"
                ? "Все още няма съдържание. Проверете отново скоро!"
                : "No content yet. Check back soon!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function BlogCard({ post, locale }: { post: any; locale: "bg" | "en" }) {
  const title = getLocalizedValue(post, "title", locale);
  const excerpt = getLocalizedValue(post, "excerpt", locale);

  const coverUrl = useQuery(
    post.coverImage
      ? api.images.getImageUrl
      : ("skip" as any),
    post.coverImage ? { storageId: post.coverImage as Id<"_storage"> } : ("skip" as any),
  ) as string | null | undefined;

  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group block rounded-3xl overflow-hidden bg-white transition-all duration-300 hover:shadow-[0_20px_60px_rgba(31,38,135,0.12)]"
    >
      {/* Cover image */}
      <div className="aspect-video overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300 text-4xl">

          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col h-full">
        {/* Title */}
        <h3 className="font-display text-lg font-bold text-[#1a1916] mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm text-stone-500 line-clamp-2 mb-3 leading-relaxed">
            {excerpt}
          </p>
        )}

        {/* Footer: Date + Read more */}
        <div className="mt-4 flex items-end justify-between">
          <div className="flex items-center gap-1.5 text-xs text-black">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(post.displayDate, locale)}</span>
          </div>
          <Button className="flex items-center gap-1 text-sm font-medium">
            <span>{m["blog.readMore"]()}</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
