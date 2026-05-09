import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { ProjectEditor } from "#/components/admin/ProjectEditor";

export const Route = createFileRoute("/admin/projects/$projectId/edit")({
  component: EditProjectPage,
});

function EditProjectPage() {
  const { projectId } = Route.useParams();
  const project = useQuery(api.projects.getById, { id: projectId as any });

  if (project === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-900" />
      </div>
    );
  }

  if (project === null) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <p className="text-stone-500 mt-2">
          The project you are looking for does not exist or has been deleted.
        </p>
      </div>
    );
  }

  return <ProjectEditor initialData={project} projectId={project._id} />;
}