import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  ExternalLink,
  Globe2,
  ImageIcon,
  Laptop,
  Lightbulb,

  Monitor,
  Network,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";

import PageHeader from "../components/common/PageHeader";
import { supabase } from "../services/supabase";

type Programme = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  duration: string | null;
  image_url: string | null;
};

const trainingAreas = [
  {
    icon: Monitor,
    title: "Information Technology",
    description:
      "Explore computer systems, digital applications and essential technology concepts.",
  },
  {
    icon: Code2,
    title: "Computer Programming",
    description:
      "Develop problem-solving abilities through programming and software development.",
  },
  {
    icon: Globe2,
    title: "Web Development",
    description:
      "Learn about designing and building websites and modern web applications.",
  },
  {
    icon: Network,
    title: "Computer Networking",
    description:
      "Explore how computers communicate and how digital networks are configured and managed.",
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity",
    description:
      "Understand digital security principles and approaches to protecting systems and information.",
  },
];

const benefits = [
  {
    icon: Laptop,
    title: "Technology-Focused Learning",
    description:
      "Explore digital tools and technical concepts relevant to today's connected world.",
  },
  {
    icon: Wrench,
    title: "Practical Skills",
    description:
      "Connect theoretical knowledge with exercises, projects and applied learning.",
  },
  {
    icon: Lightbulb,
    title: "Problem-Solving",
    description:
      "Develop analytical thinking, creativity and confidence when approaching technical challenges.",
  },
  {
    icon: Users,
    title: "Personal Development",
    description:
      "Strengthen communication, collaboration and independent learning abilities.",
  },
];

const enquirySteps = [
  {
    number: "01",
    title: "Explore",
    description: "Review the training areas and published programmes.",
  },
  {
    number: "02",
    title: "Enquire",
    description:
      "Contact Innovar to confirm course details, fees and entry requirements.",
  },
  {
    number: "03",
    title: "Apply",
    description:
      "Follow the relevant admissions process once your preferred programme is confirmed.",
  },
];

export default function InnovarInstitute() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchProgrammes() {
      try {
        const { data, error: fetchError } = await supabase
          .from("programmes")
          .select("id,slug,title,category,duration,image_url")
          .eq("status", "published")
          .eq("featured", true)
          .order("created_at", { ascending: false })
          .limit(6);

        if (!active) return;

        if (fetchError) throw fetchError;

        setProgrammes(data ?? []);
        setError(false);
      } catch (fetchError) {
        if (!active) return;

        console.error(
          "Failed to load Innovar Institute programmes:",
          fetchError,
        );
        setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchProgrammes();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PageHeader
        title="Innovar Institute"
        subtitle="Developing practical technical and digital skills for future opportunities."
      />

      {/* Introduction */}
      <section className="bg-white px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#542080]">
              Welcome to Innovar Institute
            </p>

            <h2 className="mb-6 text-3xl font-extrabold leading-tight text-[#101A44] sm:text-4xl lg:text-5xl">
              Practical Skills.
              <span className="block text-[#542080]">
                Future Opportunities.
              </span>
            </h2>

            <div className="mb-7 h-1 w-14 rounded-full bg-[#F5BE20]" />

            <p className="mb-5 text-base leading-8 text-slate-600">
              Innovar Institute is the technical and skills training arm of
              Innovar, with a focus on technology, digital competencies and
              career-oriented learning.
            </p>

            <p className="mb-8 text-sm leading-8 text-slate-600">
              Our areas of interest include information technology, computer
              programming, web development, networking and cybersecurity.
              Explore our published programmes or contact the institute to
              discuss suitable learning opportunities.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#featured-programmes"
                className="inline-flex items-center gap-2 rounded-lg bg-[#542080] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#3C1461]"
              >
                Explore Programmes
                <ArrowRight size={17} />
              </a>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-[#542080] px-6 py-3.5 text-sm font-bold text-[#542080] transition-colors hover:bg-[#F1EBFA]"
              >
                Enquire Now
              </Link>
            </div>
          </div>

          {/* Visual */}
          <div className="relative overflow-hidden rounded-3xl bg-[#101A44] p-8 text-white shadow-xl sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#542080]/50 blur-3xl" />

            <div className="relative">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                <Code2 size={34} className="text-[#F5BE20]" />
              </div>

              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#F5BE20]">
                Learn. Create. Innovate.
              </p>

              <h3 className="mb-6 text-3xl font-extrabold leading-tight">
                Develop Skills for a Digital World
              </h3>

              <p className="mb-8 text-sm leading-8 text-white/75">
                Explore technology-focused learning areas and discover
                opportunities to strengthen your technical knowledge.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  "Technology",
                  "Programming",
                  "Networking",
                  "Digital Security",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <CheckCircle2
                      size={17}
                      className="shrink-0 text-[#F5BE20]"
                    />
                    <span className="text-xs font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training areas */}
      <section className="bg-[#F8F9FE] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
              Areas of Learning
            </p>

            <h2 className="text-3xl font-extrabold text-[#101A44] sm:text-4xl">
              Explore Our
              <span className="text-[#542080]"> Training Areas</span>
            </h2>

            <div className="mx-auto my-5 h-1 w-14 rounded-full bg-[#F5BE20]" />

            <p className="text-sm leading-8 text-slate-600">
              Discover technology and digital skills areas. Contact the
              institute to confirm which courses are currently open for
              enrolment.
            </p>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {trainingAreas.map((area) => {
              const Icon = area.icon;

              return (
                <article
                  key={area.title}
                  className="group rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none"
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F1EBFA] transition-colors group-hover:bg-[#542080]">
                    <Icon
                      size={30}
                      className="text-[#542080] transition-colors group-hover:text-white"
                    />
                  </div>

                  <h3 className="mb-3 text-xl font-extrabold text-[#101A44]">
                    {area.title}
                  </h3>

                  <p className="mb-6 text-sm leading-7 text-slate-600">
                    {area.description}
                  </p>

                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#542080] hover:text-[#B8860B]"
                  >
                    Enquire About Training
                    <ArrowRight size={16} />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dynamic programmes */}
      <section
        id="featured-programmes"
        className="scroll-mt-28 bg-white px-5 py-20 sm:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
                Discover Your Next Step
              </p>

              <h2 className="text-3xl font-extrabold text-[#101A44] sm:text-4xl">
                Featured Programmes
              </h2>

              <div className="mt-5 h-1 w-14 rounded-full bg-[#F5BE20]" />
            </div>

            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#542080] hover:text-[#B8860B]"
            >
              View All Programmes
              <ArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div
              className="grid gap-7 md:grid-cols-2 lg:grid-cols-3"
              aria-busy="true"
              aria-label="Loading programmes"
            >
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-slate-100"
                >
                  <div className="h-48 animate-pulse bg-slate-200 motion-reduce:animate-none" />
                  <div className="space-y-4 p-6">
                    <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-[#F8F9FE] p-10 text-center">
              <BookOpen size={36} className="mx-auto mb-4 text-[#542080]" />

              <h3 className="mb-2 text-lg font-bold text-[#101A44]">
                Programmes temporarily unavailable
              </h3>

              <p className="text-sm text-slate-600">
                Please contact Innovar Institute for programme information.
              </p>
            </div>
          ) : programmes.length === 0 ? (
            <div className="rounded-2xl bg-[#F8F9FE] p-10 text-center">
              <BookOpen size={36} className="mx-auto mb-4 text-[#542080]" />

              <h3 className="mb-2 text-lg font-bold text-[#101A44]">
                Programme Information
              </h3>

              <p className="mx-auto max-w-xl text-sm leading-7 text-slate-600">
                Featured programmes will appear here when published. Contact the
                institute to enquire about available training.
              </p>
            </div>
          ) : (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {programmes.map((programme) => (
                <article
                  key={programme.id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:transform-none"
                >
                  <Link
                    to={`/programmes/${programme.slug}`}
                    className="block"
                    aria-label={`View ${programme.title}`}
                  >
                    <div className="flex h-52 items-center justify-center overflow-hidden bg-[#F1EBFA]">
                      {programme.image_url ? (
                        <img
                          src={programme.image_url}
                          alt={programme.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
                        />
                      ) : (
                        <ImageIcon size={42} className="text-[#542080]/40" />
                      )}
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col p-6">
                    <span className="mb-4 self-start rounded-full bg-[#F1EBFA] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-[#542080]">
                      {programme.category || "Training"}
                    </span>

                    <h3 className="mb-3 text-lg font-extrabold text-[#101A44]">
                      {programme.title}
                    </h3>

                    {programme.duration && (
                      <p className="mb-5 text-sm text-slate-600">
                        Duration: {programme.duration}
                      </p>
                    )}

                    <Link
                      to={`/programmes/${programme.slug}`}
                      className="mt-auto inline-flex items-center gap-2 border-t border-slate-100 pt-4 text-sm font-bold text-[#542080] hover:text-[#B8860B]"
                    >
                      View Programme
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/courses"
              className="inline-flex items-center gap-3 rounded-lg bg-[#542080] px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-[#3C1461]"
            >
              Browse All Programmes
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-[#F8F9FE] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
              The Learning Experience
            </p>

            <h2 className="text-3xl font-extrabold text-[#101A44] sm:text-4xl">
              Learning That Builds Capability
            </h2>

            <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-[#F5BE20]" />
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <article
                  key={benefit.title}
                  className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#F1EBFA]">
                    <Icon size={27} className="text-[#542080]" />
                  </div>

                  <h3 className="mb-3 text-lg font-extrabold text-[#101A44]">
                    {benefit.title}
                  </h3>

                  <p className="text-sm leading-7 text-slate-600">
                    {benefit.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enquiry process */}
      <section className="bg-white px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
              Getting Started
            </p>

            <h2 className="text-3xl font-extrabold text-[#101A44] sm:text-4xl">
              How to Get Started
            </h2>

            <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-[#F5BE20]" />
          </div>

          <div className="grid gap-7 md:grid-cols-3">
            {enquirySteps.map((step) => (
              <article
                key={step.number}
                className="rounded-2xl border border-slate-100 bg-[#F8F9FE] p-8"
              >
                <span className="mb-6 block text-4xl font-black text-[#542080]/25">
                  {step.number}
                </span>

                <h3 className="mb-3 text-xl font-extrabold text-[#101A44]">
                  {step.title}
                </h3>

                <p className="text-sm leading-7 text-slate-600">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#542080] px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#F5BE20]">
            Innovar Institute
          </p>

          <h2 className="mb-6 text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Develop Your Skills?
          </h2>

          <p className="mx-auto mb-9 max-w-2xl text-sm leading-8 text-white/80 sm:text-base">
            Contact Innovar Institute to learn more about available programmes,
            entry requirements, training arrangements and admissions.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-[#F5BE20] px-7 py-3.5 text-sm font-bold text-[#092C80] transition-colors hover:bg-[#FFD34D]"
            >
              Enquire Now
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-lg border border-white/60 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#542080]"
            >
              View Programmes
              <ExternalLink size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

