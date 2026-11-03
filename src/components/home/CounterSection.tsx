import {
  ArrowRight,
  Beaker,
  Laptop,
  Trophy,
  School,
  CheckCircle2,
} from "lucide-react";

import { Link } from "react-router-dom";

// Replace these with actual Innovar photographs
import scienceImage from "../../assets/images/hero11.jpg";
import technologyImage from "../../assets/images/hero23.jpg";
import sportsImage from "../../assets/images/hero13.jpg";
import boardingImage from "../../assets/images/about-preview.jpg";

const facilities = [
  {
    icon: Beaker,
    title: "Science & Discovery",
    description:
      "Encouraging curiosity, experimentation and scientific thinking through practical learning.",
    image: scienceImage,
    category: "ACADEMIC EXCELLENCE",
  },
  {
    icon: Laptop,
    title: "Technology & Innovation",
    description:
      "Building digital confidence through computing, programming and practical technical education.",
    image: technologyImage,
    category: "FUTURE-READY SKILLS",
  },
  {
    icon: Trophy,
    title: "Sports & Co-curricular",
    description:
      "Discover basketball, soccer, skating, karate, chess and other activities that support personal growth.",
    image: sportsImage,
    category: "STUDENT DEVELOPMENT",
  },
  {
    icon: School,
    title: "Day & Boarding",
    description:
      "Providing day and boarding learning options for students pursuing international education.",
    image: boardingImage,
    category: "SCHOOL EXPERIENCE",
  },
];

const highlights = [
  "International Academic Pathways",
  "Practical Learning",
  "Sports & Creative Activities",
  "Day & Boarding Options",
];

export default function CounterSection() {
  return (
    <section
      id="campus-life"
      className="overflow-hidden bg-[#F8F9FE] px-5 py-20 sm:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
            Beyond the Classroom
          </p>

          <h2 className="text-3xl font-extrabold tracking-tight text-[#101A44] sm:text-4xl lg:text-5xl">
            Discover Life at
            <span className="text-[#542080]"> Innovar</span>
          </h2>

          <div className="mx-auto my-5 h-1 w-14 rounded-full bg-[#F5BE20]" />

          <p className="text-base leading-8 text-slate-600">
            Explore an educational environment that encourages academic growth,
            practical learning, creativity and personal development.
          </p>
        </div>

        {/* Facility cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {facilities.map((facility) => {
            const Icon = facility.icon;

            return (
              <article
                key={facility.title}
                className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(25,25,65,0.12)] motion-reduce:transform-none"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={facility.image}
                    alt={facility.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#101A44]/45 via-transparent to-transparent" />

                  <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold tracking-wide text-[#542080]">
                    {facility.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0E9FA]">
                    <Icon
                      size={25}
                      strokeWidth={1.8}
                      className="text-[#542080]"
                    />
                  </div>

                  <h3 className="mb-3 text-lg font-extrabold leading-snug text-[#101A44]">
                    {facility.title}
                  </h3>

                  <p className="text-sm leading-7 text-slate-600">
                    {facility.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom feature strip */}
        <div className="relative mt-14 overflow-hidden rounded-2xl bg-[#542080] px-7 py-9 sm:px-10 lg:px-12">
          {/* Decoration */}
          <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border-[50px] border-white/5" />

          <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <h3 className="mb-3 text-2xl font-extrabold text-white sm:text-3xl">
                More Than Just Education
              </h3>

              <p className="max-w-xl text-sm leading-7 text-white/75">
                At Innovar, learning extends beyond the classroom through
                experiences that develop confidence, knowledge and practical
                abilities.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="flex items-center gap-2 text-sm font-medium text-white"
                >
                  <CheckCircle2 size={18} className="shrink-0 text-[#F5BE20]" />
                  {highlight}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery link */}
        <div className="mt-10 text-center">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 rounded-lg border border-[#542080]/20 bg-white px-7 py-3.5 text-sm font-bold text-[#542080] transition-all hover:border-[#542080] hover:bg-[#F0E9FA]"
          >
            Explore Our Gallery
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
