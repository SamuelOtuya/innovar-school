import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";

import logo from "../../assets/logo.jpeg";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Academics", path: "/academics" },
  { name: "Innovar Institute", path: "/innovar-institute" },
  { name: "Admissions", path: "/admissions" },
  { name: "Campus Life", path: "/student-life" },
  { name: "Gallery", path: "/gallery" },
  { name: "News & Events", path: "/news" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <nav
      className="sticky top-0 z-50 border-b border-slate-100 bg-white shadow-[0_3px_18px_rgba(15,23,42,0.06)]"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-[82px] max-w-[1600px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        {/* Logo and identity */}
        <Link
          to="/"
          className="flex min-w-0 shrink-0 items-center gap-3"
          aria-label="Innovar home"
        >
          <img
            src={logo}
            alt="Innovar logo"
            className="h-14 w-14 shrink-0 object-contain"
          />

          <div className="min-w-0 leading-tight">
            <span className="block text-lg font-black tracking-tight text-[#092C80]">
              INNOVAR
            </span>

            <span className="block max-w-[180px] text-[9px] font-bold uppercase leading-4 tracking-[0.08em] text-[#542080]">
              International School & Institute
            </span>

            <span className="mt-0.5 block text-[10px] font-semibold italic text-[#B8860B]">
              Aspire. Actualize. Inspire.
            </span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-0.5 xl:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                `relative whitespace-nowrap rounded-md px-2.5 py-3 text-[11px] font-bold transition-colors 2xl:px-3 2xl:text-xs ${
                  isActive
                    ? "text-[#542080]"
                    : "text-[#26334A] hover:text-[#542080]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-1 left-2.5 right-2.5 h-[2px] rounded-full bg-[#F5BE20]" />
                  )}
                </>
              )}
            </NavLink>
          ))}

          <Link
            to="/apply"
            className="ml-3 inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-[#542080] px-5 py-3 text-xs font-extrabold text-white transition-colors hover:bg-[#3C1461]"
          >
            Apply Now
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-[#092C80] hover:bg-[#F1EBFA] xl:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="innovar-mobile-menu"
        >
          {isOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {/* Mobile and tablet navigation */}
      {isOpen && (
        <div
          id="innovar-mobile-menu"
          className="max-h-[calc(100dvh-82px)] overflow-y-auto border-t border-slate-100 bg-white px-5 py-5 shadow-lg sm:px-8 xl:hidden"
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-3 text-sm font-bold transition-colors ${
                    isActive
                      ? "bg-[#F1EBFA] text-[#542080]"
                      : "text-[#26334A] hover:bg-slate-50 hover:text-[#542080]"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <Link
            to="/admissions"
            onClick={() => setIsOpen(false)}
            className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-[#542080] px-5 py-3.5 text-sm font-bold text-white"
          >
            Apply Now
            <ArrowRight size={17} />
          </Link>

          <p className="mt-5 text-center text-xs font-semibold italic text-[#B8860B]">
            Aspire. Actualize. Inspire.
          </p>
        </div>
      )}
    </nav>
  );
}
