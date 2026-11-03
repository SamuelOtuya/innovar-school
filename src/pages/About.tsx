import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  CheckCircle2,
  Eye,
  GraduationCap,
  HeartHandshake,
  Laptop,
  MapPin,
  Sparkles,
  Target,
  Users,
  ExternalLink,
} from "lucide-react";

import PageHeader from "../components/common/PageHeader";

// Replace with verified Innovar school photographs.
import schoolImage from "../assets/images/about-preview.jpg";

const values = [
  {
    icon: BookOpenCheck,
    title: "Excellence",
    text: "Encouraging academic achievement, continuous improvement and a commitment to quality learning.",
  },
  {
    icon: HeartHandshake,
    title: "Integrity",
    text: "Promoting honesty, responsibility, respect and strong character in our learning community.",
  },
  {
    icon: Sparkles,
    title: "Innovation",
    text: "Encouraging creativity, problem-solving and the meaningful use of modern technologies.",
  },
  {
    icon: Users,
    title: "Holistic Growth",
    text: "Supporting intellectual, social, physical and personal development beyond the classroom.",
  },
];

const schoolHighlights = [
  "Cambridge International Education",
  "Pearson Edexcel pathways",
  "Kindergarten and Primary Education",
  "Secondary Education and IGCSE",
  "Day and Boarding Options",
];

const instituteHighlights = [
  "Information Technology",
  "Computer Programming",
  "Web Development",
  "Networking",
  "Cybersecurity",
];

export default function About() {
  return (
    <>
      <PageHeader
        title="About Innovar"
        subtitle="Aspire. Actualize. Inspire. — Discover our approach to international education and practical skills development."
      />

      {/* Who we are */}
      <section className="bg-white px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          {/* Image */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(16,26,68,0.12)]">
              <img
                src={schoolImage}
                alt="Innovar learning environment"
                className="h-[350px] w-full object-cover sm:h-[460px]"
              />
            </div>

            <div className="absolute -bottom-6 left-5 rounded-2xl border border-slate-100 bg-white px-6 py-5 shadow-xl sm:left-8">
              <p className="text-2xl font-black text-[#542080]">2026</p>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                School Operations Began
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="pt-6 lg:pt-0">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
              Who We Are
            </p>

            <h2 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-[#101A44] sm:text-4xl lg:text-5xl">
              Welcome to
              <span className="text-[#542080]"> Innovar</span>
            </h2>

            <div className="mb-7 h-1 w-14 rounded-full bg-[#F5BE20]" />

            <p className="mb-5 text-sm leading-8 text-slate-600 sm:text-base">
              Innovar International School is a day and boarding institution
              based in Kakamega, Kenya, providing international education for
              learners aged 3 to 19. Its academic pathways include Cambridge
              International Education and Pearson Edexcel.
            </p>

            <p className="mb-5 text-sm leading-8 text-slate-600 sm:text-base">
              The school began classes on 5 January 2026 through a homeschool
              arrangement before relocating to its new campus along the
              Kisumu–Kakamega highway on 5 May 2026.
            </p>

            <p className="mb-8 text-sm leading-8 text-slate-600 sm:text-base">
              Alongside the school, Innovar Institute focuses on practical
              technical and digital skills, providing opportunities for learners
              interested in technology and career-focused training.
            </p>

            <Link
              to="/contact"
              className="inline-flex items-center gap-3 rounded-lg bg-[#542080] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#3C1461]"
            >
              Get in Touch
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* Mission and vision */}
      <section className="bg-[#F8F9FE] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
              Our Purpose
            </p>

            <h2 className="text-3xl font-extrabold text-[#101A44] sm:text-4xl">
              Our Mission & Vision
            </h2>

            <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-[#F5BE20]" />
          </div>

          <div className="grid gap-7 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm sm:p-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#F1EBFA]">
                <Target size={28} className="text-[#542080]" />
              </div>

              <h3 className="mb-4 text-2xl font-extrabold text-[#101A44]">
                Our Mission
              </h3>

              <p className="text-sm leading-8 text-slate-600 sm:text-base">
                To nurture confident, creative and responsible learners through
                quality international education, practical skills development
                and holistic learning experiences that prepare them for future
                opportunities.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm sm:p-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#FFF6DA]">
                <Eye size={28} className="text-[#B8860B]" />
              </div>

              <h3 className="mb-4 text-2xl font-extrabold text-[#101A44]">
                Our Vision
              </h3>

              <p className="text-sm leading-8 text-slate-600 sm:text-base">
                To become a learning community that inspires excellence,
                innovation and lifelong learning, empowering students to realise
                their potential and contribute meaningfully to society.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Our educational pathways */}
      <section className="bg-white px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
              Our Educational Approach
            </p>

            <h2 className="text-3xl font-extrabold text-[#101A44] sm:text-4xl lg:text-5xl">
              Discover Our
              <span className="text-[#542080]"> Learning Pathways</span>
            </h2>

            <div className="mx-auto my-5 h-1 w-14 rounded-full bg-[#F5BE20]" />

            <p className="text-sm leading-8 text-slate-600 sm:text-base">
              Innovar brings together international academic education and
              practical skills training.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* International School */}
            <article className="overflow-hidden rounded-2xl border border-slate-100 bg-[#F8F9FE]">
              <div className="bg-[#092C80] p-8 text-white">
                <GraduationCap size={36} className="mb-5 text-[#F5BE20]" />

                <h3 className="mb-3 text-2xl font-extrabold">
                  Innovar International School
                </h3>

                <p className="text-sm leading-7 text-white/75">
                  International academic pathways designed to support learning
                  from the early years through secondary education.
                </p>
              </div>

              <div className="p-8">
                <ul className="mb-8 space-y-4">
                  {schoolHighlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-slate-700"
                    >
                      <CheckCircle2
                        size={19}
                        className="mt-0.5 shrink-0 text-[#542080]"
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/academics"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#542080] hover:text-[#B8860B]"
                >
                  Explore Academics
                  <ArrowRight size={17} />
                </Link>
              </div>
            </article>

            {/* Innovar Institute */}
            <article className="overflow-hidden rounded-2xl border border-slate-100 bg-[#F8F9FE]">
              <div className="bg-[#542080] p-8 text-white">
                <Laptop size={36} className="mb-5 text-[#F5BE20]" />

                <h3 className="mb-3 text-2xl font-extrabold">
                  Innovar Institute
                </h3>

                <p className="text-sm leading-7 text-white/75">
                  Practical technical and digital skills training for learners
                  seeking to build knowledge and career-focused abilities.
                </p>
              </div>

              <div className="p-8">
                <ul className="mb-8 space-y-4">
                  {instituteHighlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-slate-700"
                    >
                      <CheckCircle2
                        size={19}
                        className="mt-0.5 shrink-0 text-[#542080]"
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#542080] hover:text-[#B8860B]"
                >
                  Explore Institute Programmes
                  <ArrowRight size={17} />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="bg-[#F8F9FE] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
              Our Core Values
            </p>

            <h2 className="text-3xl font-extrabold text-[#101A44] sm:text-4xl">
              What Guides Us
            </h2>

            <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-[#F5BE20]" />
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article
                  key={value.title}
                  className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#F1EBFA]">
                    <Icon size={27} className="text-[#542080]" />
                  </div>

                  <h3 className="mb-3 text-lg font-extrabold text-[#101A44]">
                    {value.title}
                  </h3>

                  <p className="text-sm leading-7 text-slate-600">
                    {value.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Student experience */}
      <section className="bg-white px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
              Beyond the Classroom
            </p>

            <h2 className="mb-6 text-3xl font-extrabold text-[#101A44] sm:text-4xl">
              Learning, Growth
              <span className="text-[#542080]"> & Discovery</span>
            </h2>

            <p className="mb-7 text-sm leading-8 text-slate-600 sm:text-base">
              Student development at Innovar extends beyond academic subjects.
              Learners can explore activities such as scouting, chess, sports,
              karate, skating, Model United Nations and the World Scholars
              programme.
            </p>

            <Link
              to="/student-life"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#542080] hover:text-[#B8860B]"
            >
              Discover Student Life
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="rounded-3xl bg-[#101A44] p-8 text-white sm:p-10">
            <Award size={38} className="mb-6 text-[#F5BE20]" />

            <h3 className="mb-5 text-2xl font-extrabold">
              The Innovar Experience
            </h3>

            <p className="mb-7 text-sm leading-8 text-white/75">
              Our educational approach combines academic learning with
              opportunities for creativity, teamwork, leadership and practical
              discovery.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {["Academic Learning", "Sports", "Leadership", "Creativity"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-sm font-semibold text-white">{item}</p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="bg-[#F8F9FE] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
              Find Us
            </p>

            <h2 className="text-3xl font-extrabold text-[#101A44] sm:text-4xl">
              Visit Innovar
            </h2>

            <div className="mx-auto my-5 h-1 w-14 rounded-full bg-[#F5BE20]" />

            <p className="text-sm leading-8 text-slate-600">
              Our school campus is located along the Kisumu–Kakamega highway in
              Kakamega, Kenya.
            </p>
          </div>

          <div className="mx-auto max-w-4xl rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm sm:p-12">
            <MapPin size={38} className="mx-auto mb-5 text-[#542080]" />

            <h3 className="mb-3 text-xl font-extrabold text-[#101A44]">
              Innovar International School
            </h3>

            <p className="mb-7 text-sm leading-8 text-slate-600">
              Kisumu–Kakamega Highway
              <br />
              Kakamega, Kenya
            </p>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Innovar%20International%20School%20Kakamega"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#542080] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#3C1461]"
            >
              Search on Google Maps
              <ExternalLink size={17} />
            </a>

            <p className="mt-4 text-xs text-slate-500">
              Confirm the campus pin before travelling.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#542080] px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#F5BE20]">
            Your Journey Starts Here
          </p>

          <h2 className="mb-6 text-3xl font-extrabold text-white sm:text-4xl">
            Aspire. Actualize. Inspire.
          </h2>

          <p className="mx-auto mb-9 max-w-2xl text-sm leading-8 text-white/80 sm:text-base">
            Explore the educational opportunities available at Innovar
            International School and Innovar Institute, and take the next step
            towards your learning goals.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/admissions"
              className="inline-flex items-center gap-2 rounded-lg bg-[#F5BE20] px-7 py-3.5 text-sm font-bold text-[#092C80] transition-colors hover:bg-[#FFD34D]"
            >
              Explore Admissions
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-white/60 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#542080]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
