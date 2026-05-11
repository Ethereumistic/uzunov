import { createFileRoute } from "@tanstack/react-router";
import { BlogEditor } from "#/components/admin/BlogEditor";

export const Route = createFileRoute("/admin/blog/new")({
  component: NewBlogPostPage,
});

function NewBlogPostPage() {
  return <BlogEditor />;
}