import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, GraduationCap, MapPin } from "lucide-react";

import logo from "../../assets/logo.jpeg";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Admissions", path: "/admissions" },
  { name: "Campus Life", path: "/student-life" },
  { name: "News & Events", path: "/news" },
  { name: "Contact Us", path: "/contact" },
];

const academicLinks = [
  { name: "Academics", path: "/academics" },
  { name: "Kindergarten", path: "/academics" },
  { name: "Primary Education", path: "/academics" },
  { name: "Secondary & IGCSE", path: "/academics" },
  { name: "Innovar Institute", path: "/courses" },
  { name: "Gallery", path: "/gallery" },
];

const resourceLinks = [
  { name: "Admissions", path: "/admissions" },
  { name: "Programmes", path: "/courses" },
  { name: "Downloads", path: "/downloads" },
  { name: "News & Events", path: "/news" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#101A44] text-white">
      {/* Top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-[#092C80] via-[#542080] to-[#F5BE20]" />

      <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 sm:px-8 lg:pt-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link to="/" className="mb-6 inline-flex items-center gap-3">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white p-2">
                <img
                  src={logo}
                  alt="Innovar logo"
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <h3 className="text-xl font-black tracking-wide text-white">
                  INNOVAR
                </h3>

                <p className="max-w-[180px] text-[10px] font-semibold uppercase leading-4 tracking-wide text-white/65">
                  International School & Institute
                </p>
              </div>
            </Link>

            <p className="max-w-sm text-sm leading-8 text-white/65">
              Discover international academic pathways, practical technical
              education and opportunities for personal development in Kakamega,
              Kenya.
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm font-bold italic text-[#F5BE20]">
              <GraduationCap size={18} />
              Aspire. Actualize. Inspire.
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-6 text-sm font-extrabold text-white">
              Quick Links
            </h4>

            <div className="mb-5 h-[3px] w-10 rounded-full bg-[#F5BE20]" />

            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/65 transition-colors hover:text-[#F5BE20]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academics */}
          <div>
            <h4 className="mb-6 text-sm font-extrabold text-white">
              Our Education
            </h4>

            <div className="mb-5 h-[3px] w-10 rounded-full bg-[#F5BE20]" />

            <ul className="space-y-3">
              {academicLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/65 transition-colors hover:text-[#F5BE20]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources and location */}
          <div>
            <h4 className="mb-6 text-sm font-extrabold text-white">
              Resources & Contact
            </h4>

            <div className="mb-5 h-[3px] w-10 rounded-full bg-[#F5BE20]" />

            <ul className="mb-7 space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/65 transition-colors hover:text-[#F5BE20]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-start gap-3">
              <MapPin size={19} className="mt-1 shrink-0 text-[#F5BE20]" />

              <div>
                <p className="mb-1 text-sm font-bold text-white">Visit Us</p>

                <p className="text-sm leading-7 text-white/65">
                  Amalemba, off Kisumu–Kakamega Road
                  <br />
                  Kakamega, Kenya
                </p>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Amalemba%20Kakamega%20Kenya"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#F5BE20] hover:text-white"
            >
              Find Us on Google Maps
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Admissions banner */}
        <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-2xl border border-white/10 bg-white/5 p-7 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h4 className="mb-2 text-xl font-extrabold text-white">
              Begin Your Innovar Journey
            </h4>

            <p className="text-sm leading-7 text-white/65">
              Explore international education and practical training
              opportunities at Innovar.
            </p>
          </div>

          <Link
            to="/admissions"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#F5BE20] px-6 py-3.5 text-sm font-extrabold text-[#092C80] transition-colors hover:bg-[#FFD34D]"
          >
            Apply Now
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-center sm:px-8 md:flex-row md:text-left">
          <p className="text-xs text-white/45">
            © {year} Innovar International School & Institute. All rights
            reserved.
          </p>

          <p className="text-xs text-white/45">Aspire. Actualize. Inspire.</p>
        </div>
      </div>
    </footer>
  );
}
