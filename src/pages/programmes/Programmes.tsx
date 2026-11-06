import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Loader2,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import ProgrammeCard from "../../components/programmes/ProgrammeCard";
import { supabase } from "../../services/supabase";

type Programme = {
  id: string;
  slug: string;
  title: string;
  institution: string | null;
  category: string;
  level: string;
  duration: string;
  intake: string[];
  study_mode: string;
  image_url: string;
  featured: boolean;
  short_description: string;
};

type InstitutionFilter = "all" | "school" | "institute";

export default function Programmes() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [activeInstitution, setActiveInstitution] =
    useState<InstitutionFilter>("all");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    let active = true;

    async function fetchProgrammes() {
      setLoading(true);
      setError("");

      try {
        const { data, error: fetchError } = await supabase
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
             short_description`,
          )
          .eq("status", "published")
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;

        if (active) {
          setProgrammes(
            (data ?? []).map((item) => ({
              id: item.id,
              slug: item.slug ?? "",
              title: item.title ?? "",
              institution: item.institution ?? null,
              category: item.category ?? "",
              level: item.level ?? "",
              duration: item.duration ?? "",
              intake: Array.isArray(item.intake) ? item.intake : [],
              study_mode: item.study_mode ?? "",
              image_url: item.image_url ?? "",
              featured: Boolean(item.featured),
              short_description: item.short_description ?? "",
            })),
          );
        }
      } catch (err) {
        console.error("Unable to fetch programmes:", err);

        if (active) {
          setError("We couldn't load the programmes. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void fetchProgrammes();

    return () => {
      active = false;
    };
  }, []);

  const institutionOptions = [
    {
      value: "all" as const,
      label: "All Programmes",
      icon: BookOpen,
    },
    {
      value: "school" as const,
      label: "International School",
      icon: GraduationCap,
    },
    {
      value: "institute" as const,
      label: "Innovar Institute",
      icon: BookOpen,
    },
  ];

  const institutionProgrammes = useMemo(() => {
    if (activeInstitution === "all") {
      return programmes;
    }

    return programmes.filter(
      (programme) => programme.institution === activeInstitution,
    );
  }, [programmes, activeInstitution]);

  const categories = useMemo(() => {
    const values = institutionProgrammes
      .map((programme) => programme.category)
      .filter(Boolean);

    return ["All", ...Array.from(new Set(values)).sort()];
  }, [institutionProgrammes]);

  const filteredProgrammes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return institutionProgrammes.filter((programme) => {
      const searchableText = [
        programme.title,
        programme.category,
        programme.level,
        programme.short_description,
        programme.study_mode,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      const matchesCategory =
        activeCategory === "All" || programme.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [institutionProgrammes, search, activeCategory]);

  const featuredProgrammes = useMemo(
    () => filteredProgrammes.filter((item) => item.featured),
    [filteredProgrammes],
  );

  const regularProgrammes = useMemo(
    () => filteredProgrammes.filter((item) => !item.featured),
    [filteredProgrammes],
  );

  const hasFilters =
    search.trim() !== "" ||
    activeInstitution !== "all" ||
    activeCategory !== "All";

  function changeInstitution(value: InstitutionFilter) {
    setActiveInstitution(value);
    setActiveCategory("All");
  }

  function clearFilters() {
    setSearch("");
    setActiveInstitution("all");
    setActiveCategory("All");
  }

  return (
    <>
      <PageHeader
        title="Our Programmes"
        subtitle="Explore international school pathways and practical skills training at Innovar International School and Innovar Institute."
      />

      {/* Introduction */}
      <section className="bg-white px-5 pb-10 pt-16 sm:px-8 lg:px-16 lg:pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#F5BE20]/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#542080]">
              <Sparkles size={15} />
              Explore Innovar
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#101A44] sm:text-4xl lg:text-5xl">
              Discover Your Learning Pathway
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              From international school education to practical technology and
              professional skills, explore the learning opportunities available
              across our two institutions.
            </p>
          </div>

          {/* Institution selection */}
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {institutionOptions.map((option) => {
              const Icon = option.icon;
              const selected = activeInstitution === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => changeInstitution(option.value)}
                  aria-pressed={selected}
                  className={`group flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
                    selected
                      ? "border-[#542080] bg-[#542080] text-white shadow-lg shadow-purple-900/10"
                      : "border-slate-200 bg-white text-[#101A44] hover:border-[#542080]/40 hover:shadow-md"
                  }`}
                >
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      selected
                        ? "bg-white/15 text-[#F5BE20]"
                        : "bg-purple-50 text-[#542080]"
                    }`}
                  >
                    <Icon size={24} />
                  </span>

                  <span className="flex-1">
                    <span className="block text-sm font-extrabold sm:text-base">
                      {option.label}
                    </span>

                    <span
                      className={`mt-1 block text-xs ${
                        selected ? "text-white/75" : "text-slate-500"
                      }`}
                    >
                      {option.value === "all"
                        ? "Explore all available pathways"
                        : option.value === "school"
                          ? "International academic education"
                          : "Technical and digital skills"}
                    </span>
                  </span>

                  <ArrowRight
                    size={18}
                    className={selected ? "text-[#F5BE20]" : "text-slate-400"}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Programme catalogue */}
      <section className="bg-[#F8F9FE] px-5 py-16 sm:px-8 lg:px-16 lg:py-20">
        <div className="mx-auto max-w-7xl">
          {/* Search and filters */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-[#542080]">
                <SlidersHorizontal size={20} />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-[#101A44]">
                  Find a Programme
                </h3>

                <p className="text-xs text-slate-500">
                  Search or filter available learning options.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_260px]">
              <div className="relative">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by programme, subject or level..."
                  aria-label="Search programmes"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-[#101A44] outline-none transition focus:border-[#542080] focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <select
                value={activeCategory}
                onChange={(event) => setActiveCategory(event.target.value)}
                aria-label="Filter programmes by category"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-[#101A44] outline-none transition focus:border-[#542080] focus:ring-2 focus:ring-purple-100"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "All" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-500">
                {loading
                  ? "Loading programmes..."
                  : `Showing ${filteredProgrammes.length} programme${
                      filteredProgrammes.length !== 1 ? "s" : ""
                    }`}
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#542080] hover:underline"
                >
                  <X size={16} />
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div
              role="status"
              className="mt-10 flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-20 text-center"
            >
              <Loader2 size={38} className="mb-5 animate-spin text-[#542080]" />

              <h3 className="text-lg font-bold text-[#101A44]">
                Loading Programmes
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Please wait while we retrieve our programme catalogue.
              </p>
            </div>
          ) : error ? (
            <div
              role="alert"
              className="mt-10 rounded-2xl border border-red-100 bg-white px-6 py-16 text-center"
            >
              <h3 className="text-xl font-extrabold text-[#101A44]">
                Unable to Load Programmes
              </h3>

              <p className="mt-3 text-sm text-slate-600">{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#542080] px-6 py-3 text-sm font-bold text-white hover:bg-[#43206A]"
              >
                <RefreshCw size={17} />
                Try Again
              </button>
            </div>
          ) : filteredProgrammes.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-slate-100 bg-white px-6 py-16 text-center">
              <BookOpen size={46} className="mx-auto mb-5 text-[#542080]" />

              <h3 className="text-xl font-extrabold text-[#101A44]">
                No Programmes Found
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
                {hasFilters
                  ? "No programmes match your current search or filters."
                  : "There are currently no published programmes in this catalogue. Please check back for updates."}
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 rounded-xl bg-[#542080] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#43206A]"
                >
                  View All Programmes
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Featured programmes */}
              {featuredProgrammes.length > 0 && (
                <div className="mt-14">
                  <div className="mb-7 flex flex-wrap items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5BE20]/20 text-[#A87500]">
                      <Sparkles size={22} />
                    </span>

                    <div>
                      <h3 className="text-2xl font-extrabold text-[#101A44]">
                        Featured Programmes
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Highlighted learning opportunities
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                    {featuredProgrammes.map((programme) => (
                      <ProgrammeCard key={programme.id} programme={programme} />
                    ))}
                  </div>
                </div>
              )}

              {/* Other programmes */}
              {regularProgrammes.length > 0 && (
                <div className="mt-14">
                  <div className="mb-7">
                    <h3 className="text-2xl font-extrabold text-[#101A44]">
                      {featuredProgrammes.length > 0
                        ? "More Programmes"
                        : "Available Programmes"}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Explore the full range of learning opportunities.
                    </p>
                  </div>

                  <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                    {regularProgrammes.map((programme) => (
                      <ProgrammeCard key={programme.id} programme={programme} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Enquiry CTA */}
      <section className="bg-[#101A44] px-5 py-16 text-white sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#F5BE20]">
              Your Next Step
            </p>

            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Need Help Choosing a Programme?
            </h2>

            <p className="mt-4 leading-8 text-white/75">
              Contact our team for guidance on available pathways, programme
              information and enquiries.
            </p>
          </div>

          <Link
            to="/contact"
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-[#F5BE20] px-7 py-4 text-sm font-extrabold text-[#101A44] transition hover:bg-[#E5AB10]"
          >
            Contact Innovar
            <ArrowRight size={19} />
          </Link>
        </div>
      </section>
    </>
  );
}
