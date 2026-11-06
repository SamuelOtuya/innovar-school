import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Baby,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  FileText,
  GraduationCap,
  Laptop,
  Mail,
  MessageCircle,
  PhoneCall,
  School,
  Send,
  ShieldCheck,

} from "lucide-react";

import PageHeader from "../components/common/PageHeader";

type AdmissionType = "school" | "institute";

const admissionSteps = [
  {
    icon: BookOpen,
    title: "Explore",
    description:
      "Review the available academic pathways or training programmes.",
  },
  {
    icon: MessageCircle,
    title: "Enquire",
    description:
      "Contact the admissions team to confirm availability, fees and entry requirements.",
  },
  {
    icon: FileText,
    title: "Apply",
    description:
      "Complete the applicable application process and provide the requested information.",
  },
  {
    icon: CheckCircle2,
    title: "Confirm",
    description:
      "Receive guidance on the next steps, enrolment arrangements and reporting.",
  },
];

const schoolLevels = [
  {
    icon: Baby,
    name: "Kindergarten",
    description: "Nursery and Reception",
  },
  {
    icon: BookOpen,
    name: "Primary",
    description: "Years 1â€“6",
  },
  {
    icon: School,
    name: "Lower Secondary",
    description: "Years 7â€“9",
  },
  {
    icon: GraduationCap,
    name: "IGCSE",
    description: "Years 10â€“11",
  },
];

const schoolEnquiryItems = [
  "Learner's age and intended year group",
  "Previous school or learning background",
  "Preferred curriculum pathway",
  "Day or boarding preference",
  "Any additional learning support requirements",
];

const instituteEnquiryItems = [
  "Preferred training programme",
  "Previous educational background",
  "Learning objectives or career interests",
  "Preferred training arrangement",
  "Programme entry requirements and availability",
];

const faqs = [
  {
    question: "How do I apply to Innovar International School?",
    answer:
      "Begin by contacting the admissions team with the learner's intended year group. The team can explain the applicable requirements, availability and application process.",
  },
  {
    question: "Does Innovar offer day and boarding options?",
    answer:
      "Innovar International School offers day and boarding arrangements. Contact admissions to confirm availability and arrangements for the relevant year group.",
  },
  {
    question: "Which international academic pathways are offered?",
    answer:
      "Innovar International School describes its academic offering as including Cambridge International Education and Pearson Edexcel pathways. Confirm the available subjects and qualifications directly with the school.",
  },
  {
    question: "Can I apply for Innovar Institute training?",
    answer:
      "You can enquire about Innovar Institute's technical and digital skills programmes. The institute can confirm which courses are currently accepting applications and their specific requirements.",
  },
  {
    question: "Where can I find the fees and intake dates?",
    answer:
      "Fees, payment arrangements and intake dates should be confirmed with the admissions team for the specific school level or institute programme.",
  },
];

export default function Admissions() {
  const [admissionType, setAdmissionType] = useState<AdmissionType>("school");

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const isSchool = admissionType === "school";

  const enquiryItems = isSchool ? schoolEnquiryItems : instituteEnquiryItems;

  return (
    <>
      <PageHeader
        title="Admissions"
        subtitle="Begin your learning journey with Innovar International School or Innovar Institute."
      />

      {/* Introduction */}
      <section className="bg-white px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
              Join the Innovar Community
            </p>

            <h2 className="text-3xl font-extrabold text-[#101A44] sm:text-4xl lg:text-5xl">
              Your Journey
              <span className="text-[#542080]"> Begins Here</span>
            </h2>

            <div className="mx-auto my-5 h-1 w-14 rounded-full bg-[#F5BE20]" />

            <p className="text-sm leading-8 text-slate-600 sm:text-base">
              Whether you are exploring international education for your child
              or practical skills training for yourself, our admissions
              information will help you identify the right starting point.
            </p>
          </div>

          {/* Pathway selector */}
          <div className="grid gap-6 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setAdmissionType("school")}
              aria-pressed={isSchool}
              className={`rounded-2xl border-2 p-7 text-left transition-all duration-300 sm:p-8 ${
                isSchool
                  ? "border-[#542080] bg-[#F7F1FC] shadow-lg"
                  : "border-slate-100 bg-white hover:border-[#542080]/40 hover:shadow-md"
              }`}
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#542080] text-white">
                  <GraduationCap size={32} />
                </div>

                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                    isSchool
                      ? "border-[#542080] bg-[#542080] text-white"
                      : "border-slate-300 text-transparent"
                  }`}
                >
                  <CheckCircle2 size={19} />
                </div>
              </div>

              <h3 className="mb-3 text-xl font-extrabold text-[#101A44] sm:text-2xl">
                Innovar International School
              </h3>

              <p className="mb-4 text-sm leading-7 text-slate-600">
                International academic education from Kindergarten through
                IGCSE.
              </p>

              <span className="inline-flex items-center gap-2 text-sm font-bold text-[#542080]">
                School Admissions
                <ArrowRight size={16} />
              </span>
            </button>

            <button
              type="button"
              onClick={() => setAdmissionType("institute")}
              aria-pressed={!isSchool}
              className={`rounded-2xl border-2 p-7 text-left transition-all duration-300 sm:p-8 ${
                !isSchool
                  ? "border-[#542080] bg-[#F7F1FC] shadow-lg"
                  : "border-slate-100 bg-white hover:border-[#542080]/40 hover:shadow-md"
              }`}
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#092C80] text-white">
                  <Laptop size={31} />
                </div>

                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                    !isSchool
                      ? "border-[#542080] bg-[#542080] text-white"
                      : "border-slate-300 text-transparent"
                  }`}
                >
                  <CheckCircle2 size={19} />
                </div>
              </div>

              <h3 className="mb-3 text-xl font-extrabold text-[#101A44] sm:text-2xl">
                Innovar Institute
              </h3>

              <p className="mb-4 text-sm leading-7 text-slate-600">
                Technical, vocational and digital skills training opportunities.
              </p>

              <span className="inline-flex items-center gap-2 text-sm font-bold text-[#542080]">
                Institute Admissions
                <ArrowRight size={16} />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Admissions process */}
      <section className="bg-[#F8F9FE] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
              Getting Started
            </p>

            <h2 className="text-3xl font-extrabold text-[#101A44] sm:text-4xl">
              Admission Process
            </h2>

            <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-[#F5BE20]" />
          </div>

          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">
            {admissionSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.title}
                  className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#F1EBFA]">
                      <Icon size={27} className="text-[#542080]" />
                    </div>

                    <span className="text-4xl font-black text-[#542080]/20">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mb-3 text-lg font-extrabold text-[#101A44]">
                    {step.title}
                  </h3>

                  <p className="text-sm leading-7 text-slate-600">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Selected pathway details */}
      <section
        aria-live="polite"
        className="bg-white px-5 py-20 sm:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
              Admission Information
            </p>

            <h2 className="text-3xl font-extrabold text-[#101A44] sm:text-4xl">
              {isSchool
                ? "International School Admissions"
                : "Innovar Institute Admissions"}
            </h2>

            <div className="mt-5 h-1 w-14 rounded-full bg-[#F5BE20]" />
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-[#F8F9FE] p-8 sm:p-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#F1EBFA]">
                {isSchool ? (
                  <School size={27} className="text-[#542080]" />
                ) : (
                  <Laptop size={27} className="text-[#542080]" />
                )}
              </div>

              <h3 className="mb-5 text-2xl font-extrabold text-[#101A44]">
                {isSchool
                  ? "Available Academic Pathways"
                  : "Explore Training Programmes"}
              </h3>

              {isSchool ? (
                <div className="space-y-4">
                  {schoolLevels.map((level) => {
                    const Icon = level.icon;

                    return (
                      <div
                        key={level.name}
                        className="flex items-center gap-4 rounded-xl bg-white p-4"
                      >
                        <Icon size={23} className="shrink-0 text-[#542080]" />

                        <div>
                          <p className="text-sm font-bold text-[#101A44]">
                            {level.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            {level.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <>
                  <p className="mb-6 text-sm leading-8 text-slate-600">
                    Innovar Institute focuses on practical technology and
                    digital skills training. Explore the available programme
                    listings and confirm entry requirements directly with the
                    institute.
                  </p>

                  <Link
                    to="/courses"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#542080] hover:text-[#B8860B]"
                  >
                    Browse Institute Programmes
                    <ArrowRight size={17} />
                  </Link>
                </>
              )}
            </div>

            {/* Enquiry preparation */}
            <div className="rounded-2xl bg-[#101A44] p-8 text-white sm:p-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-white/10">
                <ClipboardList size={27} className="text-[#F5BE20]" />
              </div>

              <h3 className="mb-4 text-2xl font-extrabold">
                Before You Enquire
              </h3>

              <p className="mb-7 text-sm leading-8 text-white/75">
                Having the following information ready can help the admissions
                team guide you more effectively.
              </p>

              <ul className="space-y-5">
                {enquiryItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-7 text-white/85"
                  >
                    <CheckCircle2
                      size={19}
                      className="mt-1 shrink-0 text-[#F5BE20]"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-7 border-t border-white/15 pt-5 text-xs leading-6 text-white/60">
                This is an enquiry preparation checklist, not a formal list of
                mandatory admission documents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Support and enquiries */}
      <section className="bg-[#F8F9FE] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm sm:p-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#F1EBFA]">
              <PhoneCall size={27} className="text-[#542080]" />
            </div>

            <h3 className="mb-4 text-2xl font-extrabold text-[#101A44]">
              Need Help Applying?
            </h3>

            <p className="mb-7 text-sm leading-8 text-slate-600">
              Contact the Innovar admissions team for guidance on curriculum
              pathways, programme availability, fees, entry requirements and
              application arrangements.
            </p>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-[#542080] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#3C1461]"
            >
              Contact Admissions
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="rounded-2xl bg-[#542080] p-8 text-white sm:p-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-white/10">
              <Mail size={27} className="text-[#F5BE20]" />
            </div>

            <h3 className="mb-4 text-2xl font-extrabold">
              Make an Admissions Enquiry
            </h3>

            <p className="mb-7 text-sm leading-8 text-white/80">
              Tell us whether you are interested in Innovar International School
              or Innovar Institute. Our contact page is the starting point for
              your enquiry.
            </p>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-[#F5BE20] px-7 py-3.5 text-sm font-bold text-[#092C80] transition-colors hover:bg-[#FFD34D]"
            >
              Send an Enquiry
              <Send size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
              Frequently Asked Questions
            </p>

            <h2 className="text-3xl font-extrabold text-[#101A44] sm:text-4xl">
              Admissions FAQs
            </h2>

            <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-[#F5BE20]" />
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={`admission-faq-${index}`}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-sm font-bold text-[#101A44] sm:text-base">
                      {faq.question}
                    </span>

                    {isOpen ? (
                      <ChevronUp
                        size={20}
                        className="shrink-0 text-[#542080]"
                      />
                    ) : (
                      <ChevronDown
                        size={20}
                        className="shrink-0 text-[#542080]"
                      />
                    )}
                  </button>

                  {isOpen && (
                    <div
                      id={`admission-faq-${index}`}
                      className="border-t border-slate-100 px-6 pb-6 pt-4"
                    >
                      <p className="text-sm leading-8 text-slate-600">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#101A44] px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
            <ShieldCheck size={32} className="text-[#F5BE20]" />
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#F5BE20]">
            Aspire. Actualize. Inspire.
          </p>

          <h2 className="mb-6 text-3xl font-extrabold text-white sm:text-4xl">
            Take the Next Step with Innovar
          </h2>

          <p className="mx-auto mb-9 max-w-2xl text-sm leading-8 text-white/80 sm:text-base">
            Explore our educational opportunities and contact the admissions
            team to discuss the next steps.
          </p>

          <Link
            to="/contact"
            className="inline-flex items-center gap-3 rounded-lg bg-[#F5BE20] px-8 py-4 text-sm font-bold text-[#092C80] transition-colors hover:bg-[#FFD34D]"
          >
            Start Your Enquiry
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}

