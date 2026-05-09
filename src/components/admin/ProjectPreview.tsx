import { useMemo } from "react";
import { ProjectDetailView } from "#/components/projects/ProjectDetailView";
import type { ProjectFormState } from "#/types/project-form";
import { formToProject } from "#/lib/formToProject";

interface ProjectPreviewProps {
  form: ProjectFormState;
  locale: "bg" | "en";
}

export function ProjectPreview({ form, locale }: ProjectPreviewProps) {
  const project = useMemo(() => formToProject(form, locale), [form, locale]);

  return (
    <div className="w-[166%] scale-[0.6] origin-top-left">
      <ProjectDetailView project={project} locale={locale} showOtherProjects={false} showPageHeader={false} />
    </div>
  );
}