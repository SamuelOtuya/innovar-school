import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Clock3,
  GraduationCap,
  ImageOff,
  Sparkles,
  Users,
} from "lucide-react";
import { useState } from "react";

type ProgrammeCardData = {
  id: string;
  slug: string;
  title: string;
  institution?: string | null;
  category: string;
  level?: string | null;
  duration?: string | null;
  intake?: string[] | null;
  study_mode?: string | null;
  image_url?: string | null;
  featured?: boolean | null;
  short_description?: string | null;
};

interface ProgrammeCardProps {
  programme: ProgrammeCardData;
}

export default function ProgrammeCard({ programme }: ProgrammeCardProps) {
  const [imageError, setImageError] = useState(false);

  const isSchool = programme.institution === "school";
  const isInstitute = programme.institution === "institute";

  const institutionName = isSchool
    ? "Innovar International School"
    : isInstitute
      ? "Innovar Institute"
      : "Innovar";

  const institutionShortName = isSchool
    ? "International School"
    : isInstitute
      ? "Innovar Institute"
      : "Innovar Programme";

  const description =
    programme.short_description?.trim() ||
    "Explore this learning opportunity at Innovar and discover how to take the next step.";

  const detailsUrl = `/programmes/${encodeURIComponent(programme.slug)}`;

  const hasImage = Boolean(programme.image_url) && !imageError;

  const details = [
    {
      icon: GraduationCap,
      label: "Level",
      value: programme.level,
    },
    {
      icon: Clock3,
      label: "Duration",
      value: programme.duration,
    },
    {
      icon: CalendarDays,
      label: "Intake",
      value: programme.intake?.length ? programme.intake.join(", ") : null,
    },
    {
      icon: Users,
      label: "Study Mode",
      value: programme.study_mode,
    },
  ].filter((detail) => Boolean(detail.value?.trim()));

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_6px_28px_rgba(16,26,68,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#542080]/20 hover:shadow-[0_20px_45px_rgba(16,26,68,0.12)] motion-reduce:transform-none">
      {/* Programme image */}
      <div className="relative overflow-hidden bg-[#F1EBFA]">
        <Link
          to={detailsUrl}
          aria-label={`View details for ${programme.title}`}
          className="block"
        >
          <div className="relative h-56 overflow-hidden sm:h-60">
            {hasImage ? (
              <img
                src={programme.image_url!}
                alt={programme.title}
                loading="lazy"
                decoding="async"
                onError={() => setImageError(true)}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#101A44] via-[#542080] to-[#71359D] px-6 text-center">
                <ImageOff
                  size={32}
                  className="text-white/50"
                  aria-hidden="true"
                />

                <span className="text-sm font-bold tracking-wide text-white/80">
                  {institutionName}
                </span>
              </div>
            )}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#101A44]/45 to-transparent" />
          </div>
        </Link>

        {/* Institution badge */}
        <div className="absolute left-4 top-4 pointer-events-none">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[10px] font-extrabold uppercase tracking-wide shadow-sm ${
              isSchool
                ? "bg-[#101A44] text-white"
                : isInstitute
                  ? "bg-[#542080] text-white"
                  : "bg-white text-[#101A44]"
            }`}
          >
            {isSchool ? <GraduationCap size={14} /> : <BookOpen size={14} />}
            {institutionShortName}
          </span>
        </div>

        {/* Featured badge */}
        {programme.featured && (
          <div className="pointer-events-none absolute bottom-4 right-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5BE20] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-[#101A44] shadow-md">
              <Sparkles size={13} />
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Programme content */}
      <div className="flex flex-1 flex-col p-6">
        {programme.category && (
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.12em] text-[#542080]">
            {programme.category}
          </p>
        )}

        <h3 className="mb-3 text-xl font-extrabold leading-snug tracking-tight text-[#101A44] transition-colors group-hover:text-[#542080]">
          <Link to={detailsUrl} className="hover:underline">
            {programme.title}
          </Link>
        </h3>

        <p className="mb-5 line-clamp-3 text-sm leading-7 text-slate-600">
          {description}
        </p>

        {/* Programme details */}
        {details.length > 0 && (
          <div className="mb-6 space-y-3 border-t border-slate-100 pt-5">
            {details.map((detail) => {
              const Icon = detail.icon;

              return (
                <div
                  key={detail.label}
                  className="flex items-start gap-3 text-sm"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F5BE20]/15 text-[#A87500]">
                    <Icon size={15} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <span className="block text-[11px] font-medium text-slate-400">
                      {detail.label}
                    </span>

                    <span className="block break-words font-semibold text-[#101A44]">
                      {detail.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
          <Link
            to={detailsUrl}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#542080] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#3E1763] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#542080]"
          >
            View Details
            <ArrowUpRight size={17} />
          </Link>

          <Link
            to={`/apply?programme=${encodeURIComponent(programme.slug)}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#542080] px-5 py-3.5 text-sm font-bold text-[#542080] transition-colors hover:bg-[#F1EBFA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#542080]"
          >
            {isSchool ? "Admissions" : "Enquire"}
          </Link>
        </div>
      </div>
    </article>
  );
}
