import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  GraduationCap,
  Image as ImageIcon,
  LoaderCircle,
  Mail,
  Newspaper,
  RefreshCw,
  Users,
} from "lucide-react";

import { supabase } from "../../services/supabase";

type Stats = {
  programmes: number;
  schoolProgrammes: number;
  instituteProgrammes: number;
  news: number;
  gallery: number;
  downloads: number;
  applications: number;
  newApplications: number;
  admittedApplications: number;
  messages: number;
};

type Application = {
  id: string;
  full_name: string;
  programme: string | null;
  status: string | null;
  created_at: string;
};

type ContactMessage = {
  id: string;
  full_name: string;
  inquiry_type: string | null;
  created_at: string;
};

const initialStats: Stats = {
  programmes: 0,
  schoolProgrammes: 0,
  instituteProgrammes: 0,
  news: 0,
  gallery: 0,
  downloads: 0,
  applications: 0,
  newApplications: 0,
  admittedApplications: 0,
  messages: 0,
};

const modules = [
  {
    key: "programmes",
    title: "Programmes",
    icon: BookOpen,
    path: "/admin/programmes",
    color: "bg-blue-50 text-blue-700",
  },
  {
    key: "news",
    title: "News & Events",
    icon: Newspaper,
    path: "/admin/news",
    color: "bg-purple-50 text-purple-700",
  },
  {
    key: "gallery",
    title: "Gallery Images",
    icon: ImageIcon,
    path: "/admin/gallery",
    color: "bg-amber-50 text-amber-700",
  },
  {
    key: "downloads",
    title: "Downloads",
    icon: Download,
    path: "/admin/downloads",
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    key: "applications",
    title: "Applications",
    icon: FileText,
    path: "/admin/applications",
    color: "bg-sky-50 text-sky-700",
  },
  {
    key: "messages",
    title: "Enquiries",
    icon: Mail,
    path: "/admin/messages",
    color: "bg-rose-50 text-rose-700",
  },
] as const;

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Nairobi",
  }).format(date);
}

function statusLabel(status: string | null) {
  if (!status || status === "new") return "New";

  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>(initialStats);
  const [recentApplications, setRecentApplications] = useState<Application[]>(
    [],
  );
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function fetchDashboard() {
      setLoading(true);
      setError("");

      try {
        const [
          programmes,
          schoolProgrammes,
          instituteProgrammes,
          news,
          gallery,
          downloads,
          applications,
          newApplications,
          admittedApplications,
          messages,
          appsResult,
          messagesResult,
        ] = await Promise.all([
          supabase
            .from("programmes")
            .select("*", { count: "exact", head: true }),

          supabase
            .from("programmes")
            .select("*", { count: "exact", head: true })
            .eq("institution", "school"),

          supabase
            .from("programmes")
            .select("*", { count: "exact", head: true })
            .eq("institution", "institute"),

          supabase
            .from("news_events")
            .select("*", { count: "exact", head: true }),

          supabase
            .from("gallery_images")
            .select("*", { count: "exact", head: true }),

          supabase
            .from("downloads")
            .select("*", { count: "exact", head: true }),

          supabase
            .from("applications")
            .select("*", { count: "exact", head: true }),

          supabase
            .from("applications")
            .select("*", { count: "exact", head: true })
            .or("status.eq.new,status.is.null"),

          supabase
            .from("applications")
            .select("*", { count: "exact", head: true })
            .eq("status", "admitted"),

          supabase
            .from("contact_messages")
            .select("*", { count: "exact", head: true }),

          supabase
            .from("applications")
            .select("id,full_name,programme,status,created_at")
            .order("created_at", { ascending: false })
            .limit(5),

          supabase
            .from("contact_messages")
            .select("id,full_name,inquiry_type,created_at")
            .order("created_at", { ascending: false })
            .limit(5),
        ]);

        const results = [
          programmes,
          schoolProgrammes,
          instituteProgrammes,
          news,
          gallery,
          downloads,
          applications,
          newApplications,
          admittedApplications,
          messages,
          appsResult,
          messagesResult,
        ];

        const failed = results.find((result) => result.error);

        if (failed?.error) {
          throw failed.error;
        }

        if (!active) return;

        setStats({
          programmes: programmes.count ?? 0,
          schoolProgrammes: schoolProgrammes.count ?? 0,
          instituteProgrammes: instituteProgrammes.count ?? 0,
          news: news.count ?? 0,
          gallery: gallery.count ?? 0,
          downloads: downloads.count ?? 0,
          applications: applications.count ?? 0,
          newApplications: newApplications.count ?? 0,
          admittedApplications: admittedApplications.count ?? 0,
          messages: messages.count ?? 0,
        });

        setRecentApplications((appsResult.data ?? []) as Application[]);

        setRecentMessages((messagesResult.data ?? []) as ContactMessage[]);
      } catch (err) {
        if (!active) return;

        console.error("Dashboard loading failed:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load dashboard data. Check your database tables and administrator permissions.",
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    void fetchDashboard();

    return () => {
      active = false;
    };
  }, [retryKey]);

  return (
    <div className="space-y-9">
      {/* Dashboard header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
            Innovar Administration
          </p>

          <h1 className="text-3xl font-extrabold text-[#101A44] sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage Innovar International School and Innovar Institute from one
            place.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRetryKey((value) => value + 1)}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#101A44] hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-[250px] items-center justify-center gap-3 text-[#542080]">
          <LoaderCircle size={24} className="animate-spin" />
          <span className="text-sm font-medium">Loading dashboard...</span>
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700"
        >
          <p className="font-bold">Dashboard data could not be loaded.</p>
          <p className="mt-2">{error}</p>
        </div>
      ) : (
        <>
          {/* Institution overview */}
          <section>
            <h2 className="mb-5 text-xl font-extrabold text-[#101A44]">
              Institution Overview
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <Link
                to="/admin/programmes"
                className="group rounded-2xl border border-purple-100 bg-gradient-to-br from-[#101A44] to-[#542080] p-7 text-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white/70">
                      Innovar International School
                    </p>

                    <h3 className="mt-4 text-4xl font-extrabold">
                      {stats.schoolProgrammes}
                    </h3>

                    <p className="mt-2 text-sm text-white/70">
                      Registered school programmes
                    </p>
                  </div>

                  <GraduationCap size={36} className="text-[#F5BE20]" />
                </div>

                <div className="mt-7 flex items-center gap-2 border-t border-white/20 pt-5 text-sm font-bold text-[#F5BE20]">
                  Manage School Programmes
                  <ArrowRight size={17} />
                </div>
              </Link>

              <Link
                to="/admin/programmes"
                className="group rounded-2xl border border-purple-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      Innovar Institute
                    </p>

                    <h3 className="mt-4 text-4xl font-extrabold text-[#101A44]">
                      {stats.instituteProgrammes}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Registered institute programmes
                    </p>
                  </div>

                  <BookOpen size={36} className="text-[#542080]" />
                </div>

                <div className="mt-7 flex items-center gap-2 border-t border-slate-100 pt-5 text-sm font-bold text-[#542080]">
                  Manage Institute Programmes
                  <ArrowRight size={17} />
                </div>
              </Link>
            </div>
          </section>

          {/* Content statistics */}
          <section>
            <h2 className="mb-5 text-xl font-extrabold text-[#101A44]">
              Website Management
            </h2>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {modules.map((module) => {
                const Icon = module.icon;
                const count = stats[module.key];

                return (
                  <Link
                    key={module.key}
                    to={module.path}
                    className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          {module.title}
                        </p>

                        <h3 className="mt-3 text-4xl font-extrabold text-[#101A44]">
                          {count.toLocaleString("en-KE")}
                        </h3>
                      </div>

                      <div className={`rounded-xl p-4 ${module.color}`}>
                        <Icon size={26} />
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs font-bold text-[#542080]">
                      Manage {module.title}
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Admissions summary */}
          <section>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-extrabold text-[#101A44]">
                Admissions Overview
              </h2>

              <Link
                to="/admin/applications"
                className="text-sm font-bold text-[#542080] hover:underline"
              >
                View Applications
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <SummaryCard
                label="Total Applications"
                value={stats.applications}
                icon={<Users size={24} />}
                color="bg-blue-50 text-blue-700"
              />

              <SummaryCard
                label="New Applications"
                value={stats.newApplications}
                icon={<Clock3 size={24} />}
                color="bg-amber-50 text-amber-700"
              />

              <SummaryCard
                label="Admitted Applicants"
                value={stats.admittedApplications}
                icon={<CheckCircle2 size={24} />}
                color="bg-green-50 text-green-700"
              />
            </div>
          </section>

          {/* Recent activity */}
          <div className="grid gap-7 lg:grid-cols-2">
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between gap-3">
                <h2 className="text-lg font-extrabold text-[#101A44]">
                  Recent Applications
                </h2>

                <Link
                  to="/admin/applications"
                  className="text-xs font-bold text-[#542080] hover:underline"
                >
                  View All
                </Link>
              </div>

              {recentApplications.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  No applications received yet.
                </p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentApplications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-start justify-between gap-3 py-4 first:pt-0"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-[#101A44]">
                          {app.full_name}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {app.programme || "Programme not specified"}
                        </p>

                        <p className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                          <CalendarDays size={13} />
                          {formatDate(app.created_at)}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-[#542080]">
                        {statusLabel(app.status)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between gap-3">
                <h2 className="text-lg font-extrabold text-[#101A44]">
                  Recent Enquiries
                </h2>

                <Link
                  to="/admin/messages"
                  className="text-xs font-bold text-[#542080] hover:underline"
                >
                  View All
                </Link>
              </div>

              {recentMessages.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  No enquiries received yet.
                </p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentMessages.map((message) => (
                    <div key={message.id} className="py-4 first:pt-0">
                      <p className="font-bold text-[#101A44]">
                        {message.full_name}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {message.inquiry_type || "General Enquiry"}
                      </p>

                      <p className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                        <CalendarDays size={13} />
                        {formatDate(message.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div
        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
      >
        {icon}
      </div>

      <h3 className="text-3xl font-extrabold text-[#101A44]">
        {value.toLocaleString("en-KE")}
      </h3>

      <p className="mt-2 text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}
