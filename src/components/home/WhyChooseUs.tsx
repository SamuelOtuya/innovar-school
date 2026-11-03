import {
  ArrowUpRight,
  BookOpenCheck,
  Laptop,
  School,
  Trophy,
} from "lucide-react";

const reasons = [
  {
    icon: BookOpenCheck,
    title: "International Education",
    description:
      "Explore Cambridge and Pearson Edexcel pathways designed to prepare learners for further education and future opportunities.",
  },
  {
    icon: Laptop,
    title: "Practical Skills Training",
    description:
      "Develop technical and digital skills through programmes in computing, programming, networking and related disciplines.",
  },
  {
    icon: School,
    title: "Day & Boarding",
    description:
      "Benefit from a supportive learning environment with day and boarding options for school learners.",
  },
  {
    icon: Trophy,
    title: "Holistic Development",
    description:
      "Discover opportunities beyond the classroom through sports, languages, creativity, chess and other co-curricular activities.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
            The Innovar Advantage
          </p>

          <h2 className="text-3xl font-extrabold tracking-tight text-[#101A44] sm:text-4xl lg:text-5xl">
            Why Choose <span className="text-[#542080]">Innovar?</span>
          </h2>

          <div className="mx-auto my-5 h-1 w-14 rounded-full bg-[#F5BE20]" />

          <p className="text-base leading-8 text-slate-600">
            Discover an educational experience that combines international
            academic pathways, practical learning and opportunities for personal
            growth.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;

            return (
              <article
                key={reason.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-[#FAFAFE] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#542080]/20 hover:bg-white hover:shadow-[0_18px_45px_rgba(35,20,80,0.10)] motion-reduce:transform-none"
              >
                <span className="absolute right-6 top-6 text-xs font-bold text-slate-300">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0E9FA] transition-colors duration-300 group-hover:bg-[#542080]">
                  <Icon
                    size={30}
                    strokeWidth={1.7}
                    className="text-[#542080] transition-colors duration-300 group-hover:text-white"
                  />
                </div>

                <h3 className="mb-4 text-lg font-extrabold leading-snug text-[#101A44]">
                  {reason.title}
                </h3>

                <p className="text-sm leading-7 text-slate-600">
                  {reason.description}
                </p>

                <div className="mt-7 flex items-center gap-2 text-[#542080]">
                  <span className="h-[2px] w-8 bg-[#F5BE20]" />
                  <ArrowUpRight size={18} />
                </div>
              </article>
            );
          })}
        </div>

        {/* Supporting statement */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-center">
          <span className="h-2 w-2 rounded-full bg-[#F5BE20]" />
          <p className="text-sm font-medium text-slate-500">
            Aspire. Actualize. Inspire.
          </p>
          <span className="h-2 w-2 rounded-full bg-[#542080]" />
        </div>
      </div>
    </section>
  );
}
