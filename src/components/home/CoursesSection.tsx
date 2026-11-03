import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Clock,
  GraduationCap,
  ImageIcon,
  Laptop,
  School,
} from "lucide-react";

import { supabase } from "../../services/supabase";

type Programme = {
  id: string;
  slug: string;
  title: string;
  category: string;
  duration: string | null;
  image_url: string | null;
};

const academicPathways = [
  {
    title: "Kindergarten",
    subtitle: "Nursery & Reception",
    years: "Early Years",
    description:
      "A nurturing foundation for curiosity, confidence and early learning.",
    icon: School,
  },
  {
    title: "Primary Education",
    subtitle: "Years 1–6",
    years: "Primary",
    description:
      "Building strong academic foundations through an engaging international curriculum.",
    icon: BookOpen,
  },
  {
    title: "Lower Secondary",
    subtitle: "Years 7–9",
    years: "Secondary",
    description:
      "Developing knowledge, critical thinking and preparation for further study.",
    icon: GraduationCap,
  },
  {
    title: "IGCSE",
    subtitle: "Years 10–11",
    years: "Cambridge & Pearson",
    description:
      "International examination pathways supporting academic progression and future ambitions.",
    icon: Laptop,
  },
];

export default function CoursesSection() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchFeaturedProgrammes() {
      const { data, error: fetchError } = await supabase
        .from("programmes")
        .select("id,slug,title,category,duration,image_url")
        .eq("status", "published")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(6);

      if (!active) return;

      if (fetchError) {
        console.error("Failed to load programmes:", fetchError);
        setError(true);
      } else {
        setProgrammes(data || []);
      }

      setLoading(false);
    }

    fetchFeaturedProgrammes();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="programmes"
      className="bg-[#F8F9FE] px-5 py-20 sm:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Main heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
            Our Learning Pathways
          </p>

          <h2 className="text-3xl font-extrabold text-[#101A44] sm:text-4xl lg:text-5xl">
            Discover Your Path
            <span className="text-[#542080]"> at Innovar</span>
          </h2>

          <div className="mx-auto my-5 h-1 w-14 rounded-full bg-[#F5BE20]" />

          <p className="text-base leading-8 text-slate-600">
            From early childhood education to career-focused technical training,
            explore opportunities to learn, grow and achieve.
          </p>
        </div>

        {/* Cambridge education */}
        <div className="mb-20">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#B8860B]">
                Innovar International School
              </p>

              <h3 className="text-2xl font-extrabold text-[#101A44] sm:text-3xl">
                International Academic Pathways
              </h3>
            </div>

            <Link
              to="/academics"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#542080] hover:text-[#B8860B]"
            >
              Explore Academics
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {academicPathways.map((pathway) => {
              const Icon = pathway.icon;

              return (
                <article
                  key={pathway.title}
                  className="group overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:transform-none"
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0E9FA]">
                    <Icon
                      size={30}
                      strokeWidth={1.7}
                      className="text-[#542080]"
                    />
                  </div>

                  <span className="mb-3 inline-block rounded-full bg-[#F7F1FF] px-3 py-1 text-[11px] font-bold text-[#542080]">
                    {pathway.years}
                  </span>

                  <h4 className="mb-1 text-lg font-extrabold text-[#101A44]">
                    {pathway.title}
                  </h4>

                  <p className="mb-4 text-sm font-semibold text-[#B8860B]">
                    {pathway.subtitle}
                  </p>

                  <p className="text-sm leading-7 text-slate-600">
                    {pathway.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        {/* TVET section */}
        <div>
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#B8860B]">
                Innovar Institute
              </p>

              <h3 className="text-2xl font-extrabold text-[#101A44] sm:text-3xl">
                Featured Technical Programmes
              </h3>
            </div>

            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#542080] hover:text-[#B8860B]"
            >
              View All Programmes
              <ArrowRight size={17} />
            </Link>
          </div>

          {loading ? (
            <div
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              aria-label="Loading programmes"
              aria-busy="true"
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-72 animate-pulse rounded-2xl bg-slate-200"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
              Programmes could not be loaded at this time.
            </div>
          ) : programmes.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-slate-600">
                Featured programmes will be available soon.
              </p>
              <Link
                to="/contact"
                className="mt-3 inline-flex font-bold text-[#542080]"
              >
                Enquire about our courses
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {programmes.map((programme) => (
                <Link
                  key={programme.id}
                  to={`/programmes/${programme.slug}`}
                  className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:transform-none"
                >
                  <div className="relative h-48 overflow-hidden bg-[#F0E9FA]">
                    {programme.image_url ? (
                      <img
                        src={programme.image_url}
                        alt={programme.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ImageIcon size={42} className="text-[#542080]/40" />
                      </div>
                    )}

                    <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[#542080] shadow-sm">
                      {programme.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <h4 className="mb-4 text-lg font-extrabold leading-snug text-[#101A44] transition-colors group-hover:text-[#542080]">
                      {programme.title}
                    </h4>

                    {programme.duration && (
                      <div className="mb-5 flex items-center gap-2 text-sm text-slate-500">
                        <Clock size={16} className="text-[#B8860B]" />
                        {programme.duration}
                      </div>
                    )}

                    <span className="inline-flex items-center gap-2 text-sm font-bold text-[#542080]">
                      Learn More
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
