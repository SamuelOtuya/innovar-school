import { GraduationCap, Laptop, School, Trophy } from "lucide-react";

const highlights = [
  {
    icon: GraduationCap,
    title: "Cambridge",
    subtitle: "International Education",
  },
  {
    icon: Laptop,
    title: "TVET",
    subtitle: "Technical & Digital Skills",
  },
  {
    icon: School,
    title: "Day & Boarding",
    subtitle: "Flexible Learning Options",
  },
  {
    icon: Trophy,
    title: "Holistic",
    subtitle: "Student Development",
  },
];

export default function StatsBar() {
  return (
    <section
      className="relative z-30 -mt-12 px-4 sm:px-8 lg:-mt-16"
      aria-label="Innovar educational highlights"
    >
      <div className="mx-auto max-w-7xl rounded-2xl border border-slate-100 bg-white px-5 py-6 shadow-[0_12px_45px_rgba(25,25,65,0.10)] sm:px-8 lg:py-8">
        <div className="grid grid-cols-2 gap-y-7 md:grid-cols-4 md:gap-y-0">
          {highlights.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={`flex items-center gap-3 px-2 sm:gap-4 sm:px-5 ${
                  index > 0 ? "md:border-l md:border-slate-200" : ""
                }`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F3EDFA] sm:h-12 sm:w-12">
                  <Icon
                    size={25}
                    strokeWidth={1.8}
                    className="text-[#542080]"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-extrabold leading-tight text-[#101A44] sm:text-base">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
