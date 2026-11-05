import { ArrowRight, Eye, GraduationCap, Target } from "lucide-react";
import { Link } from "react-router-dom";

import aboutImage from "../../assets/images/innovar2.jpg";

export default function AboutPreview() {
  return (
    <section id="about" className="bg-white px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
            Welcome to Innovar
          </p>

          <h2 className="text-3xl font-extrabold tracking-tight text-[#101A44] sm:text-4xl lg:text-5xl">
            Inspiring Minds.
            <span className="text-[#542080]"> Shaping Futures.</span>
          </h2>

          <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-[#F5BE20]" />
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-[45%_55%] lg:gap-14">
          {/* Left: school photograph */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl bg-[#F0E9FA] shadow-[0_18px_45px_rgba(25,25,65,0.12)]">
              <img
                src={aboutImage}
                alt="Innovar students participating in practical learning"
                loading="lazy"
                className="h-[340px] w-full object-cover sm:h-[420px] lg:h-[440px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#101A44]/25 via-transparent to-transparent" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-xl border border-[#542080]/15 bg-white px-5 py-4 shadow-xl sm:left-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0E9FA]">
                <GraduationCap size={27} className="text-[#542080]" />
              </div>

              <div>
                <p className="text-sm font-extrabold text-[#101A44]">
                  Innovar International School
                </p>
                <p className="text-xs font-medium text-slate-500">
                  Established in 2026
                </p>
              </div>
            </div>
          </div>

          {/* Right: introduction, mission and vision */}
          <div className="pt-8 lg:pt-0">
            <p className="mb-7 text-sm leading-8 text-slate-600 sm:text-base">
              Innovar International School is a day and boarding institution in
              Kakamega, Kenya, offering international education for learners
              aged 3 to 19. With Cambridge and Pearson Edexcel pathways, we
              support academic growth, character development and preparation for
              further education.
            </p>

            <div className="grid gap-8 sm:grid-cols-2">
              {/* Mission */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F0E9FA]">
                    <Target size={25} className="text-[#542080]" />
                  </div>

                  <h3 className="text-xl font-extrabold text-[#101A44]">
                    Our Mission
                  </h3>
                </div>

                <p className="text-sm leading-7 text-slate-600">
                  To nurture confident, knowledgeable and responsible learners
                  through quality international education, practical learning
                  and holistic development.
                </p>
              </div>

              {/* Vision */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F0E9FA]">
                    <Eye size={25} className="text-[#542080]" />
                  </div>

                  <h3 className="text-xl font-extrabold text-[#101A44]">
                    Our Vision
                  </h3>
                </div>

                <p className="text-sm leading-7 text-slate-600">
                  To inspire learners to achieve their full potential and pursue
                  meaningful opportunities in Kenya and around the world.
                </p>
              </div>
            </div>

            {/* Bottom divider */}
            <div className="my-8 h-px w-full bg-slate-200" />

            {/* Learn more link */}
            <Link
              to="/about"
              className="group inline-flex items-center gap-3 text-sm font-bold text-[#542080] transition-colors hover:text-[#B8860B]"
            >
              Discover More About Innovar
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
