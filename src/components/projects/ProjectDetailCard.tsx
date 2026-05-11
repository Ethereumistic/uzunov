import {
  MapPin,
  Ruler,
  Trophy,
  Building2,
  User,
  Calendar,
} from "lucide-react";
import type { Project } from "#/types/project";
import { getCategoryLabelKey, getCategoryBulgarianLabel } from "#/types/project";
import { m } from "#/paraglide/messages";
import { getLocale } from "#/paraglide/runtime";

interface ProjectDetailCardProps {
  project: Project;
  locale?: "bg" | "en";
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 mt-0.5 text-black/35">{icon}</div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[0.6875rem] font-semibold tracking-wider uppercase text-black/35">
          {label}
        </span>
        <span className="text-sm font-medium text-[#1a1916] leading-snug wrap-break-word">
          {value}
        </span>
      </div>
    </div>
  );
}

export function ProjectDetailCard({ project, locale: propLocale }: ProjectDetailCardProps) {
  // Use prop locale if provided, otherwise detect from runtime
  const locale = propLocale ?? getLocale();
  const isBg = locale === "bg";

  const title = isBg ? project.title_bg : project.title_en;
  const description = isBg ? project.description_bg : project.description_en;
  const location = isBg ? project.location_bg : project.location_en;
  const investor = isBg ? project.investor_bg : project.investor_en;

  return (
    <div className="rounded-3xl bg-white backdrop-blur-[22px] shadow-[0_8px_32px_rgba(31,38,135,0.08)] saturate-150 p-7 flex flex-col gap-5">
      {/* Category + Awards badges */}
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center text-[0.625rem] font-semibold tracking-widest uppercase px-3 py-1 rounded-full border border-black/12 bg-black/5 text-black/60">
          {(() => {
            const key = getCategoryLabelKey(project.category)
            const msg = m[key as keyof typeof m]
            return typeof msg === "function" ? msg() : getCategoryBulgarianLabel(project.category)
          })()}
        </span>
        {project.awards.map((_, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 text-[0.625rem] font-semibold px-3 py-1 rounded-full bg-amber-400/90 text-amber-900 border border-amber-300/60"
          >
            <Trophy size={10} />
            {m["projectDetail.award"]()}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="font-display text-[1.375rem] font-bold leading-snug text-[#1a1916] m-0">
        {title}
      </h1>

      {/* Description */}
      {description && (
        <p className="text-sm text-black/55 leading-relaxed">{description}</p>
      )}

      <div className="border-t border-black/6" />

      {/* Detail rows */}
      <div className="flex flex-col gap-4">
        <DetailRow icon={<MapPin size={15} />} label={m["project.location"]()} value={location} />
        {project.area != null && (
          <DetailRow
            icon={<Ruler size={15} />}
            label={m["project.area"]()}
            value={`${project.area.toLocaleString(isBg ? "bg-BG" : "en-US")} ${m["project.areaUnit"]()}`}
          />
        )}
        <DetailRow icon={<User size={15} />} label={m["project.investor"]()} value={investor} />
        <DetailRow icon={<Building2 size={15} />} label={m["project.status.completed"]()} value={project.status === "done" ? m["project.status.completed"]() : m["project.status.inProgress"]()} />
        {project.completionDate && (
          <DetailRow
            icon={<Calendar size={15} />}
            label={m["project.year"]()}
            value={new Date(project.completionDate).getFullYear().toString()}
          />
        )}
      </div>

      {/* Sub-buildings */}
      {project.details && project.details.length > 0 && (
        <>
          <div className="border-t border-black/6" />
          <div>
            <p className="text-[0.6875rem] font-semibold tracking-widest uppercase text-black/35 mb-3">
              {m["project.buildings"]()}
            </p>
            <div className="flex flex-col gap-2">
              {project.details.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-black/60">{isBg ? d.name_bg : d.name_en}</span>
                  <span className="font-medium text-[#1a1916]">
                    {d.area.toLocaleString(isBg ? "bg-BG" : "en-US")} {m["project.areaUnit"]()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Awards */}
      {project.awards.length > 0 && (
        <>
          <div className="border-t border-black/6" />
          <div>
            <p className="text-[0.6875rem] font-semibold tracking-widest uppercase text-black/35 mb-3">
              {m["project.awards"]()}
            </p>
            <div className="flex flex-col gap-2">
              {project.awards.map((award, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Trophy size={13} className="text-amber-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-black/65 leading-snug">
                    {isBg ? award.text_bg : award.text_en}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
