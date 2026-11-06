import { Link } from "react-router-dom";
import { ArrowUpRight, GraduationCap, MapPin, Phone } from "lucide-react";

export default function TopBar() {
  return (
    <div className="hidden bg-[#092C80] text-white lg:block">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-10 py-2.5">
        {/* Location */}

        {/* Location */}
        <div className="flex items-center gap-2 text-xs text-white/85">
          <MapPin size={14} className="shrink-0 text-[#F5BE20]" />
          <span>Amalemba, off Kisumu–Kakamega Road, Kakamega, Kenya</span>
        </div>

        {/* Phone Numbers */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-white/85">
          <Phone size={14} className="shrink-0 text-[#F5BE20]" />

          <a href="tel:PHONE_1" className="hover:text-[#F5BE20]">
          0720658818
          </a>

          <span className="text-white/40">|</span>

          <a href="tel:PHONE_2" className="hover:text-[#F5BE20]">
            0101400630
          </a>

          <span className="text-white/40">|</span>

          <a href="tel:PHONE_3" className="hover:text-[#F5BE20]">
            0795636384
          </a>
        </div>

        {/* Motto */}
        <div className="flex items-center gap-2">
          <GraduationCap size={15} className="text-[#F5BE20]" />

          <span className="text-xs font-semibold tracking-wide text-white/90">
            Aspire. Actualize. Inspire.
          </span>
        </div>

        {/* Quick link */}
        <Link
          to="/contact"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F5BE20] transition-colors hover:text-white"
        >
          Contact Our Team
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}
