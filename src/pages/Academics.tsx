import { Link } from "react-router-dom";
import {
  ArrowRight,
  Baby,

  BookOpenCheck,
  Brain,
  CheckCircle2,
  ChevronRight,
  FlaskConical,
  Globe2,
  GraduationCap,
  HeartHandshake,
  Laptop,
  Lightbulb,
  Palette,
  School,
  ShieldCheck,

  Trophy,
  Users,
} from "lucide-react";

import PageHeader from "../components/common/PageHeader";

const pathways = [
  {
    id: "kindergarten",
    stage: "Early Years",
    title: "Kindergarten",
    years: "Nursery & Reception",
    description:
      "A supportive introduction to learning through exploration, creativity, communication and age-appropriate activities.",
    icon: Baby,
    subjects: [
      "Early Literacy",
      "Early Numeracy",
      "Creative Activities",
      "Social Development",
    ],
    background: "bg-[#F4EAFB]",
    iconColor: "text-[#542080]",
    badge: "bg-[#542080]",
  },
  {
    id: "primary",
    stage: "Primary Education",
    title: "Primary School",
    years: "Years 1â€“6",
    description:
      "Building strong academic foundations, curiosity, confidence and independent learning through international primary education.",
    icon: BookOpenCheck,
    subjects: ["English", "Mathematics", "Science", "Digital Learning"],
    background: "bg-[#EAF1FF]",
    iconColor: "text-[#092C80]",
    badge: "bg-[#092C80]",
  },
  {
    id: "lower-secondary",
    stage: "Secondary Education",
    title: "Lower Secondary",
    years: "Years 7â€“9",
    description:
      "Strengthening subject knowledge, analytical thinking, problem-solving and readiness for further international study.",
    icon: FlaskConical,
    subjects: ["Languages", "Mathematics", "Sciences", "Humanities"],
    background: "bg-[#FFF5DC]",
    iconColor: "text-[#B8860B]",
    badge: "bg-[#B8860B]",
  },
  {
    id: "igcse",
    stage: "International Qualifications",
    title: "IGCSE",
    years: "Years 10â€“11",
    description:
      "Supporting learners as they work towards internationally recognised secondary qualifications through structured academic preparation.",
    icon: GraduationCap,
    subjects: [
      "Subject Specialisation",
      "Academic Preparation",
      "Critical Thinking",
      "Examination Readiness",
    ],
    background: "bg-[#EAF7F3]",
    iconColor: "text-[#087F69]",
    badge: "bg-[#087F69]",
  },
];

const approaches = [
  {
    icon: Brain,
    title: "Critical Thinking",
    description:
      "Encouraging learners to analyse, question, reason and solve problems independently.",
  },
  {
    icon: FlaskConical,
    title: "Practical Discovery",
    description:
      "Connecting classroom knowledge with experiments, exploration and real-world applications.",
  },
  {
    icon: Laptop,
    title: "Digital Learning",
    description:
      "Integrating technology to support research, creativity and modern learning experiences.",
  },
  {
    icon: Users,
    title: "Collaborative Learning",
    description:
      "Developing communication, teamwork and leadership through shared activities.",
  },
  {
    icon: Palette,
    title: "Creativity",
    description:
      "Providing opportunities for artistic expression, imagination and innovative thinking.",
  },
  {
    icon: HeartHandshake,
    title: "Personal Development",
    description:
      "Supporting character, confidence, responsibility and positive relationships.",
  },
];

const experiences = [
  {
    icon: Trophy,
    title: "Sports & Activities",
    text: "Opportunities for soccer, basketball, karate, skating and other activities.",
  },
  {
    icon: Globe2,
    title: "Global Awareness",
    text: "Activities such as Model United Nations and World Scholars support international perspectives.",
  },
  {
    icon: Lightbulb,
    title: "Innovation & Discovery",
    text: "Science, technology and problem-solving activities support practical learning.",
  },
  {
    icon: ShieldCheck,
    title: "Day & Boarding",
    text: "Learning arrangements designed to support both day scholars and boarding students.",
  },
];

export default function Academics() {
  return (
    <>
      <PageHeader
        title="Our Academics"
        subtitle="Explore the international academic pathways at Innovar International School."
      />

      {/* Introduction */}
      <section className="bg-white px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
              Academic Excellence
            </p>

            <h2 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-[#101A44] sm:text-4xl lg:text-5xl">
              Inspiring Learning
              <span className="block text-[#542080]">At Every Stage</span>
            </h2>

            <div className="mb-7 h-1 w-14 rounded-full bg-[#F5BE20]" />

            <p className="mb-5 text-sm leading-8 text-slate-600 sm:text-base">
              Innovar International School provides international academic
              education in Kakamega, Kenya, serving learners from the early
              years through secondary school.
            </p>

            <p className="mb-7 text-sm leading-8 text-slate-600 sm:text-base">
              Our academic pathways include Cambridge International Education
              and Pearson Edexcel, with opportunities for learners to develop
              subject knowledge, practical abilities, creativity and confidence.
            </p>

            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#F1EBFA] px-4 py-2 text-xs font-bold text-[#542080]">
                <CheckCircle2 size={15} />
                Cambridge Pathways
              </span>

              <span className="inline-flex items-center gap-2 rounded-full bg-[#EAF1FF] px-4 py-2 text-xs font-bold text-[#092C80]">
                <CheckCircle2 size={15} />
                Pearson Edexcel
              </span>
            </div>
          </div>

          {/* Academic journey illustration */}
          <div className="rounded-3xl bg-[#101A44] p-8 text-white shadow-xl sm:p-10">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <School size={26} className="text-[#F5BE20]" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#F5BE20]">
                  The Innovar Journey
                </p>

                <h3 className="text-xl font-extrabold">Academic Progression</h3>
              </div>
            </div>

            <div className="space-y-0">
              {pathways.map((pathway, index) => {
                const Icon = pathway.icon;

                return (
                  <div key={pathway.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#F5BE20]/50 bg-white/10">
                        <Icon size={21} className="text-[#F5BE20]" />
                      </div>

                      {index < pathways.length - 1 && (
                        <div className="min-h-8 w-px flex-1 bg-white/20" />
                      )}
                    </div>

                    <div className="pb-8">
                      <p className="text-base font-bold text-white">
                        {pathway.title}
                      </p>

                      <p className="mt-1 text-xs text-white/60">
                        {pathway.years}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Academic pathways */}
      <section
        id="academic-pathways"
        className="bg-[#F8F9FE] px-5 py-20 sm:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
              Our Academic Programmes
            </p>

            <h2 className="text-3xl font-extrabold text-[#101A44] sm:text-4xl lg:text-5xl">
              Explore Our
              <span className="text-[#542080]"> Learning Pathways</span>
            </h2>

            <div className="mx-auto my-5 h-1 w-14 rounded-full bg-[#F5BE20]" />

            <p className="text-sm leading-8 text-slate-600 sm:text-base">
              Four stages of learning, designed to support academic development
              from early childhood through international secondary education.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {pathways.map((pathway) => {
              const Icon = pathway.icon;

              return (
                <article
                  key={pathway.id}
                  id={pathway.id}
                  className="group scroll-mt-28 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:transform-none"
                >
                  {/* Card header */}
                  <div
                    className={`relative flex min-h-[190px] flex-col justify-between overflow-hidden p-7 ${pathway.background}`}
                  >
                    <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full border-[22px] border-white/40" />

                    <div className="relative z-10 flex items-start justify-between gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                        <Icon size={34} className={pathway.iconColor} />
                      </div>

                      <span
                        className={`rounded-full px-4 py-2 text-[10px] font-extrabold uppercase tracking-wide text-white ${pathway.badge}`}
                      >
                        {pathway.years}
                      </span>
                    </div>

                    <div className="relative z-10 mt-7">
                      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-600">
                        {pathway.stage}
                      </p>

                      <h3 className="text-2xl font-extrabold text-[#101A44]">
                        {pathway.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-7">
                    <p className="mb-6 min-h-[80px] text-sm leading-7 text-slate-600">
                      {pathway.description}
                    </p>

                    <div className="mb-7 grid grid-cols-2 gap-3">
                      {pathway.subjects.map((subject) => (
                        <div
                          key={subject}
                          className="flex items-start gap-2 text-xs font-semibold text-slate-700"
                        >
                          <CheckCircle2
                            size={15}
                            className="mt-0.5 shrink-0 text-[#542080]"
                          />
                          {subject}
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 pt-5">
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#542080] hover:text-[#B8860B]"
                      >
                        Enquire About This Pathway
                        <ArrowRight size={17} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="bg-white px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="rounded-3xl bg-[#092C80] p-8 text-white sm:p-10">
            <Globe2 size={40} className="mb-6 text-[#F5BE20]" />

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#F5BE20]">
              International Education
            </p>

            <h3 className="mb-5 text-2xl font-extrabold sm:text-3xl">
              Cambridge & Pearson Edexcel
            </h3>

            <p className="mb-8 text-sm leading-8 text-white/80">
              Innovar's academic offering includes international curriculum
              pathways that support structured learning and progression towards
              secondary qualifications.
            </p>

            <div className="space-y-4">
              {[
                "International academic pathways",
                "Progressive learning stages",
                "Subject knowledge and practical understanding",
                "Preparation for further education",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={19} className="shrink-0 text-[#F5BE20]" />

                  <span className="text-sm text-white/85">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
              Curriculum & Learning
            </p>

            <h2 className="mb-6 text-3xl font-extrabold text-[#101A44] sm:text-4xl">
              A Foundation for
              <span className="text-[#542080]"> Future Opportunities</span>
            </h2>

            <p className="mb-5 text-sm leading-8 text-slate-600 sm:text-base">
              Our academic programmes aim to support learners in developing
              knowledge, communication, independent thinking and the confidence
              to pursue further educational opportunities.
            </p>

            <p className="mb-8 text-sm leading-8 text-slate-600 sm:text-base">
              Families can enquire about the available curriculum pathway,
              subject combinations, admission requirements and progression
              options for each stage.
            </p>

            <Link
              to="/admissions"
              className="inline-flex items-center gap-3 rounded-lg bg-[#542080] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#3C1461]"
            >
              Explore Admissions
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* Learning approach */}
      <section className="bg-[#F8F9FE] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
              How We Learn
            </p>

            <h2 className="text-3xl font-extrabold text-[#101A44] sm:text-4xl">
              Our Learning Approach
            </h2>

            <div className="mx-auto my-5 h-1 w-14 rounded-full bg-[#F5BE20]" />

            <p className="text-sm leading-8 text-slate-600">
              An educational approach that values curiosity, creativity,
              collaboration and the development of the whole learner.
            </p>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {approaches.map((approach) => {
              const Icon = approach.icon;

              return (
                <article
                  key={approach.title}
                  className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#F1EBFA]">
                    <Icon size={27} className="text-[#542080]" />
                  </div>

                  <h3 className="mb-3 text-lg font-extrabold text-[#101A44]">
                    {approach.title}
                  </h3>

                  <p className="text-sm leading-7 text-slate-600">
                    {approach.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Beyond the classroom */}
      <section className="bg-white px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
              Holistic Education
            </p>

            <h2 className="text-3xl font-extrabold text-[#101A44] sm:text-4xl">
              Beyond the Classroom
            </h2>

            <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-[#F5BE20]" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {experiences.map((experience) => {
              const Icon = experience.icon;

              return (
                <article
                  key={experience.title}
                  className="rounded-2xl border border-slate-100 bg-[#F8F9FE] p-7"
                >
                  <Icon size={29} className="mb-5 text-[#542080]" />

                  <h3 className="mb-3 text-base font-extrabold text-[#101A44]">
                    {experience.title}
                  </h3>

                  <p className="text-sm leading-7 text-slate-600">
                    {experience.text}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/student-life"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#542080] hover:text-[#B8860B]"
            >
              Discover Student Life
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Admissions CTA */}
      <section className="bg-[#542080] px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#F5BE20]">
            Join Innovar International School
          </p>

          <h2 className="mb-6 text-3xl font-extrabold text-white sm:text-4xl">
            Begin Your Academic Journey
          </h2>

          <p className="mx-auto mb-9 max-w-2xl text-sm leading-8 text-white/80 sm:text-base">
            Discover the right learning pathway for your child and speak with
            our team about admissions, curriculum options and school life.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/admissions"
              className="inline-flex items-center gap-2 rounded-lg bg-[#F5BE20] px-7 py-3.5 text-sm font-bold text-[#092C80] transition-colors hover:bg-[#FFD34D]"
            >
              Admissions Information
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-white/60 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#542080]"
            >
              Make an Enquiry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

