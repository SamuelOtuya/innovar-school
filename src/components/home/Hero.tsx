import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import hero1 from "../../assets/images/innovar4.webp";
import hero2 from "../../assets/images/innovar3.webp";
import hero3 from "../../assets/images/innovar1.jpg";

const slides = [
  {
    eyebrow: "WELCOME TO INNOVAR INTERNATIONAL SCHOOL",
    title: "Aspire. Actualize.",
    highlight: "Inspire.",
    subtitle: "Cambridge International Education",
    description:
      "Nurturing confident, creative and globally minded learners through a holistic, future-focused educational experience in Kakamega.",
    image: hero1,
    primary: {
      label: "Explore Our School",
      href: "/academics",
    },
    secondary: {
      label: "Admissions Enquiry",
      href: "/contact",
    },
  },
  {
    eyebrow: "INNOVAR INSTITUTE",
    title: "Skills for Today.",
    highlight: "Success for Tomorrow.",
    subtitle: "Technical & Vocational Education",
    description:
      "Discover practical training in information technology, programming, networking, cybersecurity and other career-focused disciplines.",
    image: hero2,
    primary: {
      label: "Explore Our Programmes",
      href: "/courses",
    },
    secondary: {
      label: "Enquire Now",
      href: "/contact",
    },
  },
  {
    eyebrow: "THE INNOVAR EXPERIENCE",
    title: "Discover Potential.",
    highlight: "Shape the Future.",
    subtitle: "Learning Beyond the Classroom",
    description:
      "From science laboratories and digital learning to sports, creativity and personal development, we inspire every learner to thrive.",
    image: hero3,
    primary: {
      label: "Discover Innovar",
      href: "/about",
    },
    secondary: {
      label: "Get in Touch",
      href: "/contact",
    },
  },
];

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-[#092C80]"
      aria-label="Discover Innovar"
    >
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={900}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        loop
        className="innovar-hero"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative flex min-h-[620px] items-center overflow-hidden sm:min-h-[680px] lg:min-h-[740px]">
              {/* Background image */}
              <img
                src={slide.image}
                alt={slide.subtitle}
                className="absolute inset-0 h-full w-full object-cover object-center"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
              />

              {/* Brand gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#061A4D]/95 via-[#092C80]/85 to-[#092C80]/25" />

              {/* Subtle bottom gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#061A4D]/55 via-transparent to-transparent" />

              {/* Decorative gold line */}
              <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-1.5 bg-[#F5BE20] lg:block" />

              {/* Content */}
              <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-5 py-24 sm:px-8 lg:px-12">
                <div className="max-w-[760px]">
                  {/* Eyebrow */}
                  <div className="mb-6 flex items-center gap-3">
                    <span className="h-[3px] w-9 bg-[#F5BE20]" />
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#F5BE20] sm:text-sm">
                      {slide.eyebrow}
                    </span>
                  </div>

                  {/* Headline */}
                  <h1 className="mb-6 text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-7xl">
                    {slide.title}
                    <span className="mt-2 block text-[#F5BE20]">
                      {slide.highlight}
                    </span>
                  </h1>

                  {/* Subtitle */}
                  <p className="mb-5 text-base font-semibold uppercase tracking-wide text-white/95 sm:text-xl">
                    {slide.subtitle}
                  </p>

                  {/* Description */}
                  <p className="mb-9 max-w-[600px] text-base leading-8 text-slate-100 sm:text-lg">
                    {slide.description}
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <a
                      href={slide.primary.href}
                      className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-[#F5BE20] px-7 py-3.5 text-sm font-bold text-[#092C80] shadow-lg shadow-black/15 transition duration-300 hover:-translate-y-0.5 hover:bg-[#FFD34D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    >
                      {slide.primary.label}
                      <span aria-hidden="true">→</span>
                    </a>

                    <a
                      href={slide.secondary.href}
                      className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/70 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition duration-300 hover:border-white hover:bg-white hover:text-[#092C80] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    >
                      {slide.secondary.label}
                    </a>
                  </div>

                  {/* Brand motto */}
                  <div className="mt-12 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/75">
                    <span className="h-px w-8 bg-[#F5BE20]" />
                    Aspire • Actualize • Inspire
                  </div>
                </div>
              </div>

              {/* Slide number */}
              <div className="absolute bottom-10 right-6 z-10 hidden items-center gap-2 text-sm font-semibold text-white/80 md:flex lg:right-14">
                <span className="text-[#F5BE20]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="h-px w-7 bg-white/50" />
                <span>{String(slides.length).padStart(2, "0")}</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Swiper pagination styling */}
      <style>{`
        .innovar-hero .swiper-pagination {
          bottom: 32px !important;
          left: 50% !important;
          transform: translateX(-50%);
          width: auto !important;
        }

        .innovar-hero .swiper-pagination-bullet {
          width: 9px;
          height: 9px;
          background: #ffffff;
          opacity: 0.6;
          transition: all 0.3s ease;
        }

        .innovar-hero .swiper-pagination-bullet-active {
          width: 30px;
          border-radius: 8px;
          background: #F5BE20;
          opacity: 1;
        }

        @media (prefers-reduced-motion: reduce) {
          .innovar-hero *,
          .innovar-hero *::before,
          .innovar-hero *::after {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
}
