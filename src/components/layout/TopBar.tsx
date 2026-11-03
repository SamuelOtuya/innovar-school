import { Link } from "react-router-dom";
import { ArrowUpRight, GraduationCap, MapPin } from "lucide-react";

export default function TopBar() {
  return (
    <div className="hidden bg-[#092C80] text-white lg:block">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-10 py-2.5">
        {/* Location */}
        <div className="flex items-center gap-2 text-xs text-white/85">
          <MapPin size={14} className="text-[#F5BE20]" />
          <span>Amalemba, off Kisumu–Kakamega Road, Kakamega, Kenya</span>
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
