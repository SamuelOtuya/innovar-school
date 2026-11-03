import { ArrowRight, GraduationCap, Sparkles } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-[#542080] px-5 py-16 sm:px-8 lg:py-20">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -right-24 -top-36 h-[360px] w-[360px] rounded-full border-[65px] border-white/5" />

      <div className="pointer-events-none absolute -bottom-40 left-[35%] h-[300px] w-[300px] rounded-full border-[50px] border-[#F5BE20]/10" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start justify-between gap-9 lg:flex-row lg:items-center">
        <div className="flex max-w-3xl items-start gap-5">
          <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 sm:flex">
            <GraduationCap size={36} className="text-[#F5BE20]" />
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2 text-[#F5BE20]">
              <Sparkles size={16} />

              <span className="text-xs font-bold uppercase tracking-[0.16em]">
                Your Future Begins Here
              </span>
            </div>

            <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-[42px]">
              Ready to Begin Your
              <span className="text-[#F5BE20]"> Innovar Journey?</span>
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-white/80">
              Whether you're seeking Cambridge International Education or
              practical technical skills, discover a learning pathway that helps
              you aspire, actualize and inspire.
            </p>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-wrap gap-3 lg:w-auto lg:flex-col">
          <a
            href="/admissions"
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-[#F5BE20] px-7 py-3.5 text-sm font-extrabold text-[#101A44] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FFD34D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Apply for Admission
            <ArrowRight size={18} />
          </a>

          <a
            href="/contact"
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/50 px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Talk to Our Team
          </a>
        </div>
      </div>
    </section>
  );
}
