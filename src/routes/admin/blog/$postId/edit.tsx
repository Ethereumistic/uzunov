import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { BlogEditor } from "#/components/admin/BlogEditor";

export const Route = createFileRoute("/admin/blog/$postId/edit")({
  component: EditBlogPostPage,
});

function EditBlogPostPage() {
  const { postId } = Route.useParams();
  const post = useQuery(api.posts.getById, { id: postId as any });

  if (post === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-foreground" />
      </div>
    );
  }

  if (post === null) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <p className="text-foreground/70 mt-2">
          The blog post you are looking for does not exist or has been deleted.
        </p>
      </div>
    );
  }

  return <BlogEditor initialData={post} postId={post._id} />;
}