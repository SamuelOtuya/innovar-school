import { useEffect, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Loader2,
  Mail,
  Sparkles,
  Users,
} from "lucide-react";

import { supabase } from "../../services/supabase";
import ProgrammeCard from "../../components/programmes/ProgrammeCard";

type Programme = {
  id: string;
  slug: string;
  title: string;
  institution: string | null;
  category: string | null;
  level: string | null;
  duration: string | null;
  intake: string[] | null;
  study_mode: string | null;
  image_url: string | null;
  featured: boolean | null;
  short_description: string | null;
  overview: string | null;
  requirements: string[] | null;
  learning_outcomes: string[] | null;
  career_opportunities: string[] | null;
  fees: string | null;
  status: string | null;
};

function institutionName(value: string | null) {
  if (value === "school") {
    return "Innovar International School";
  }

  if (value === "institute") {
    return "Innovar Institute";
  }

  return "Innovar";
}

function cleanItems(items: string[] | null | undefined) {
  return (items ?? []).filter(
    (item) => typeof item === "string" && item.trim(),
  );
}

export default function ProgrammeDetails() {
  const { slug } = useParams<{ slug: string }>();

  const [programme, setProgramme] = useState<Programme | null>(null);
  const [relatedProgrammes, setRelatedProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchProgramme() {
      setLoading(true);
      setError("");
      setProgramme(null);
      setRelatedProgrammes([]);
      setImageFailed(false);

      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        const { data, error: programmeError } = await supabase
          .from("programmes")
          .select(
            `id,
             slug,
             title,
             institution,
             category,
             level,
             duration,
             intake,
             study_mode,
             image_url,
             featured,
             short_description,
             overview,
             requirements,
             learning_outcomes,
             career_opportunities,
             fees,
             status`,
          )
          .eq("slug", slug)
          .eq("status", "published")
          .maybeSingle();

        if (programmeError) throw programmeError;

        if (!active) return;

        if (!data) {
          setProgramme(null);
          return;
        }

        const current = data as Programme;
        setProgramme(current);

        // Related programmes must belong to the same institution.
        if (!current.institution) return;

        let relatedQuery = supabase
          .from("programmes")
          .select(
            `id,
             slug,
             title,
             institution,
             category,
             level,
             duration,
             intake,
             study_mode,
             image_url,
             featured,
             short_description,
             overview,
             requirements,
             learning_outcomes,
             career_opportunities,
             fees,
             status`,
          )
          .eq("status", "published")
          .eq("institution", current.institution)
          .neq("id", current.id);

        if (current.category) {
          relatedQuery = relatedQuery.eq("category", current.category);
        }

        const { data: related, error: relatedError } =
          await relatedQuery.limit(3);

        if (relatedError) {
          console.error("Unable to load related programmes:", relatedError);
        } else if (active) {
          setRelatedProgrammes((related ?? []) as Programme[]);
        }
      } catch (err) {
        console.error("Unable to load programme:", err);

        if (active) {
          setError("We couldn't load this programme. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void fetchProgramme();

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <section
        role="status"
        className="flex min-h-[65vh] flex-col items-center justify-center bg-[#F8F9FE] px-6 text-center"
      >
        <Loader2 size={42} className="mb-5 animate-spin text-[#542080]" />
        <h1 className="text-2xl font-extrabold text-[#101A44]">
          Loading Programme
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Retrieving programme information...
        </p>
      </section>
    );
  }

  if (error || !programme) {
    return (
      <section className="flex min-h-[65vh] flex-col items-center justify-center bg-[#F8F9FE] px-6 py-20 text-center">
        <BookOpen size={50} className="mb-6 text-[#542080]" />

        <h1 className="text-3xl font-extrabold text-[#101A44]">
          {error ? "Unable to Load Programme" : "Programme Not Found"}
        </h1>

        <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600">
          {error ||
            "This programme may be unavailable, unpublished or no longer listed."}
        </p>

        {error && (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl border border-[#542080] px-6 py-3 font-bold text-[#542080] hover:bg-purple-50"
          >
            Try Again
          </button>
        )}

        <Link
          to="/programmes"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#F5BE20] px-7 py-3.5 font-bold text-[#101A44]"
        >
          <ArrowLeft size={18} />
          Back to Programmes
        </Link>
      </section>
    );
  }

  const isSchool = programme.institution === "school";
  const institution = institutionName(programme.institution);

  const primaryAction = {
    label: isSchool ? "Apply for Admission" : "Apply for Programme",
    to: `/apply?programme=${encodeURIComponent(programme.slug)}`,
  };

  const requirements = cleanItems(programme.requirements);
  const outcomes = cleanItems(programme.learning_outcomes);
  const careers = cleanItems(programme.career_opportunities);
  const intakes = cleanItems(programme.intake);

  const quickFacts = [
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
      value: intakes.length ? intakes.join(", ") : null,
    },
    {
      icon: Users,
      label: "Study Mode",
      value: programme.study_mode,
    },
  ].filter(
    (fact) => typeof fact.value === "string" && fact.value.trim().length > 0,
  );

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#101A44] px-5 py-20 text-white sm:px-8 lg:px-16 lg:py-28">
        {programme.image_url && !imageFailed && (
          <img
            src={programme.image_url}
            alt=""
            onError={() => setImageFailed(true)}
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-40"
          />
        )}

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#101A44] via-[#101A44]/95 to-[#542080]/75" />

        <div className="relative mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-10 flex flex-wrap items-center gap-2 text-sm text-white/70"
          >
            <Link to="/" className="hover:text-[#F5BE20]">
              Home
            </Link>

            <span>/</span>

            <Link to="/programmes" className="hover:text-[#F5BE20]">
              Programmes
            </Link>

            <span>/</span>

            <span className="text-white">{programme.title}</span>
          </nav>

          <div className="max-w-4xl">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-bold backdrop-blur-sm">
                {isSchool ? (
                  <GraduationCap size={16} />
                ) : (
                  <BookOpen size={16} />
                )}
                {institution}
              </span>

              {programme.featured && (
                <span className="inline-flex items-center gap-2 rounded-full bg-[#F5BE20] px-4 py-2 text-xs font-extrabold text-[#101A44]">
                  <Sparkles size={15} />
                  Featured Programme
                </span>
              )}
            </div>

            {programme.category && (
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#F5BE20]">
                {programme.category}
              </p>
            )}

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {programme.title}
            </h1>

            {programme.short_description && (
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
                {programme.short_description}
              </p>
            )}

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to={primaryAction.to}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F5BE20] px-7 py-4 text-sm font-extrabold text-[#101A44] transition hover:bg-[#E5AB10]"
              >
                {primaryAction.label}
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/programmes"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <ArrowLeft size={18} />
                All Programmes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick facts */}
      {quickFacts.length > 0 && (
        <section className="border-b border-slate-100 bg-white px-5 py-12 sm:px-8 lg:px-16">
          <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {quickFacts.map((fact) => {
              const Icon = fact.icon;

              return (
                <QuickFact
                  key={fact.label}
                  icon={<Icon size={23} />}
                  label={fact.label}
                  value={fact.value!}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Main content */}
      <section className="bg-[#F8F9FE] px-5 py-16 sm:px-8 lg:px-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <div className="space-y-8">
            <ContentBlock title="Programme Overview">
              <p className="whitespace-pre-line">
                {programme.overview?.trim() ||
                  programme.short_description?.trim() ||
                  "Further information about this programme will be provided soon."}
              </p>
            </ContentBlock>

            {requirements.length > 0 && (
              <ContentBlock title="Entry Requirements">
                <ItemList items={requirements} />
              </ContentBlock>
            )}

            {outcomes.length > 0 && (
              <ContentBlock
                title={isSchool ? "Learning Objectives" : "What You Will Learn"}
              >
                <ItemList items={outcomes} />
              </ContentBlock>
            )}

            {careers.length > 0 && (
              <ContentBlock title="Career Opportunities">
                <ItemList items={careers} />
              </ContentBlock>
            )}
          </div>

          {/* Sidebar */}
          <aside className="h-fit space-y-6 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl bg-[#101A44] p-7 text-white shadow-lg sm:p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-[#F5BE20]">
                <GraduationCap size={25} />
              </div>

              <h2 className="text-2xl font-extrabold">
                Interested in This Programme?
              </h2>

              <p className="mt-4 text-sm leading-7 text-white/75">
                Contact {institution} for guidance on programme requirements,
                availability and the next steps.
              </p>

              {programme.fees?.trim() && (
                <div className="mt-6 rounded-xl border border-white/15 bg-white/10 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/60">
                    Programme Fees
                  </p>

                  <p className="mt-2 break-words text-lg font-extrabold text-[#F5BE20]">
                    {programme.fees}
                  </p>
                </div>
              )}

              <Link
                to={primaryAction.to}
                className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-[#F5BE20] px-6 py-4 text-center text-sm font-extrabold text-[#101A44] transition hover:bg-[#E5AB10]"
              >
                {primaryAction.label}
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/contact"
                className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <Mail size={17} />
                Contact Us
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6">
              <h3 className="font-extrabold text-[#101A44]">
                About {institution}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {isSchool
                  ? "Explore the academic pathways and learning opportunities offered at Innovar International School."
                  : "Discover practical learning and skills development opportunities offered at Innovar Institute."}
              </p>

              <Link
                to={isSchool ? "/academics" : "/institute"}
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#542080] hover:underline"
              >
                Learn More
                <ArrowRight size={16} />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Related programmes */}
      {relatedProgrammes.length > 0 && (
        <section className="bg-white px-5 py-16 sm:px-8 lg:px-16 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
                  Continue Exploring
                </p>

                <h2 className="text-3xl font-extrabold text-[#101A44]">
                  Related Programmes
                </h2>

                <p className="mt-3 text-sm text-slate-500">
                  Discover more learning opportunities at {institution}.
                </p>
              </div>

              <Link
                to="/programmes"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#542080] hover:underline"
              >
                View All Programmes
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {relatedProgrammes.map((item) => (
                <ProgrammeCard
                  key={item.id}
                  programme={{
                    ...item,
                    category: item.category ?? "",
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Closing CTA */}
      <section className="bg-[#542080] px-5 py-16 text-white sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#F5BE20]">
              Aspire. Actualize. Inspire.
            </p>

            <h2 className="text-3xl font-extrabold">
              Take the Next Step with Innovar
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-white/75">
              Explore our learning opportunities and contact our team for
              further information.
            </p>
          </div>

          <Link
            to={primaryAction.to}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#F5BE20] px-7 py-4 text-sm font-extrabold text-[#101A44] transition hover:bg-[#E5AB10]"
          >
            {primaryAction.label}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}

function QuickFact({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-[#F8F9FE] p-6">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5BE20]/20 text-[#542080]">
        {icon}
      </div>

      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-words text-base font-extrabold text-[#101A44]">
        {value}
      </p>
    </div>
  );
}

function ContentBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm sm:p-9">
      <div className="mb-6 flex items-center gap-3">
        <span className="h-8 w-1 rounded-full bg-[#F5BE20]" />

        <h2 className="text-2xl font-extrabold text-[#101A44]">{title}</h2>
      </div>

      <div className="text-sm leading-8 text-slate-600 sm:text-base">
        {children}
      </div>
    </div>
  );
}

function ItemList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item, index) => (
        <li key={`${index}-${item}`} className="flex gap-3">
          <CheckCircle2 size={20} className="mt-1 shrink-0 text-[#542080]" />

          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
