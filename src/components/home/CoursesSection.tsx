import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, ImageIcon } from "lucide-react";

import { supabase } from "../../services/supabase";

// Academic pathway images
import kindergartenImg from "../../assets/images/kindergaten.webp";
import primaryImg from "../../assets/images/primary.webp";
import secondaryImg from "../../assets/images/secondary.webp";
import igcseImg from "../../assets/images/igcse.webp";

// Types
type Programme = {
  id: string;
  slug: string;
  title: string;
  category: string;
  duration: string | null;
  image_url: string | null;
};

type AcademicPathway = {
  title: string;
  subtitle: string;
  years: string;
  description: string;
  image: string;
};

// International Academic Pathways
const academicPathways: AcademicPathway[] = [
  {
    title: "Kindergarten",
    subtitle: "Nursery & Reception",
    years: "Early Years",
    description:
      "A nurturing foundation for curiosity, confidence and early learning.",
    image: kindergartenImg,
  },
  {
    title: "Primary Education",
    subtitle: "Years 1–6",
    years: "Primary",
    description:
      "Building strong academic foundations through an engaging international curriculum.",
    image: primaryImg,
  },
  {
    title: "Lower Secondary",
    subtitle: "Years 7–9",
    years: "Secondary",
    description:
      "Developing knowledge, critical thinking and preparation for further study.",
    image: secondaryImg,
  },
  {
    title: "IGCSE",
    subtitle: "Years 10–11",
    years: "Cambridge & Pearson",
    description:
      "International examination pathways supporting academic progression and future ambitions.",
    image: igcseImg,
  },
];

export default function CoursesSection() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch featured technical programmes from Supabase
  useEffect(() => {
    let active = true;

    async function fetchFeaturedProgrammes() {
      try {
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
          setError(false);
        }
      } catch (err) {
        if (!active) return;

        console.error("Unexpected error loading programmes:", err);
        setError(true);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
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
        {/* MAIN SECTION HEADING */}
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

        {/* INTERNATIONAL ACADEMIC PATHWAYS */}
        <div className="mb-20">
          {/* SECTION HEADING */}
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
              className="inline-flex items-center gap-2 text-sm font-bold text-[#542080] transition-colors hover:text-[#B8860B]"
            >
              Explore Academics
              <ArrowRight size={17} />
            </Link>
          </div>

          {/* FOUR ACADEMIC PATHWAY CARDS */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {academicPathways.map((pathway) => (
              <article
                key={pathway.title}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:transform-none"
              >
                {/* PATHWAY IMAGE */}
                <div className="relative h-56 overflow-hidden bg-[#F0E9FA]">
                  <img
                    src={pathway.image}
                    alt={`${pathway.title} learning at Innovar International School`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
                  />

                  {/* IMAGE GRADIENT */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101A44]/20 via-transparent to-transparent" />
                </div>

                {/* CARD CONTENT */}
                <div className="flex flex-1 flex-col p-6">
                  {/* YEAR BADGE */}
                  <span className="mb-3 inline-block w-fit rounded-full bg-[#F7F1FF] px-3 py-1 text-[11px] font-bold text-[#542080]">
                    {pathway.years}
                  </span>

                  {/* TITLE */}
                  <h4 className="mb-1 text-lg font-extrabold text-[#101A44] transition-colors duration-300 group-hover:text-[#542080]">
                    {pathway.title}
                  </h4>

                  {/* SUBTITLE */}
                  <p className="mb-4 text-sm font-semibold text-[#B8860B]">
                    {pathway.subtitle}
                  </p>

                  {/* DESCRIPTION */}
                  <p className="text-sm leading-7 text-slate-600">
                    {pathway.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* INNOVAR INSTITUTE SECTION */}
        <div>
          {/* SECTION HEADING */}
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
              className="inline-flex items-center gap-2 text-sm font-bold text-[#542080] transition-colors hover:text-[#B8860B]"
            >
              View All Programmes
              <ArrowRight size={17} />
            </Link>
          </div>

          {/* LOADING STATE */}
          {loading ? (
            <div
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              aria-label="Loading programmes"
              aria-busy="true"
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-72 animate-pulse rounded-2xl bg-slate-200 motion-reduce:animate-none"
                />
              ))}
            </div>
          ) : error ? (
            /* ERROR STATE */
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
              Programmes could not be loaded at this time.
            </div>
          ) : programmes.length === 0 ? (
            /* EMPTY STATE */
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-slate-600">
                Featured programmes will be available soon.
              </p>

              <Link
                to="/contact"
                className="mt-3 inline-flex font-bold text-[#542080] hover:text-[#B8860B]"
              >
                Enquire about our courses
              </Link>
            </div>
          ) : (
            /* FEATURED TECHNICAL PROGRAMMES */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {programmes.map((programme) => (
                <Link
                  key={programme.id}
                  to={`/programmes/${programme.slug}`}
                  className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:transform-none"
                >
                  {/* PROGRAMME IMAGE */}
                  <div className="relative h-48 overflow-hidden bg-[#F0E9FA]">
                    {programme.image_url ? (
                      <img
                        src={programme.image_url}
                        alt={programme.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ImageIcon size={42} className="text-[#542080]/40" />
                      </div>
                    )}

                    {/* CATEGORY BADGE */}
                    <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[#542080] shadow-sm">
                      {programme.category}
                    </span>
                  </div>

                  {/* PROGRAMME CONTENT */}
                  <div className="p-6">
                    <h4 className="mb-4 text-lg font-extrabold leading-snug text-[#101A44] transition-colors group-hover:text-[#542080]">
                      {programme.title}
                    </h4>

                    {/* DURATION */}
                    {programme.duration && (
                      <div className="mb-5 flex items-center gap-2 text-sm text-slate-500">
                        <Clock size={16} className="text-[#B8860B]" />
                        {programme.duration}
                      </div>
                    )}

                    {/* LEARN MORE */}
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-[#542080]">
                      Learn More
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
                      />
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
