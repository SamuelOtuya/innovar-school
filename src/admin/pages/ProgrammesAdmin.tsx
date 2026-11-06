import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Edit3,
  ExternalLink,
  Filter,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";

import { supabase } from "../../services/supabase";

type Programme = {
  id: string;
  title: string;
  slug: string;
  institution: string | null;
  category: string | null;
  level: string | null;
  duration: string | null;
  image_url: string | null;
  status: string | null;
  featured: boolean | null;
  created_at: string;
};

type InstitutionFilter = "all" | "school" | "institute";
type StatusFilter = "all" | "published" | "draft";

function institutionLabel(value: string | null) {
  switch (value) {
    case "school":
      return "International School";
    case "institute":
      return "Innovar Institute";
    default:
      return "Not assigned";
  }
}

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function ProgrammesAdmin() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [institutionFilter, setInstitutionFilter] =
    useState<InstitutionFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProgrammes = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: fetchError } = await supabase
        .from("programmes")
        .select(
          "id,title,slug,institution,category,level,duration,image_url,status,featured,created_at",
        )
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setProgrammes((data ?? []) as Programme[]);
    } catch (err) {
      console.error("Failed to load programmes:", err);

      setError(
        err instanceof Error ? err.message : "Unable to load programmes.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProgrammes();
  }, [fetchProgrammes]);

  const stats = useMemo(() => {
    return {
      total: programmes.length,
      school: programmes.filter((item) => item.institution === "school").length,
      institute: programmes.filter((item) => item.institution === "institute")
        .length,
      published: programmes.filter((item) => item.status === "published")
        .length,
      featured: programmes.filter((item) => item.featured === true).length,
    };
  }, [programmes]);

  const filteredProgrammes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return programmes.filter((item) => {
      const searchable = [
        item.title,
        item.slug,
        item.category,
        item.level,
        item.duration,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchable.includes(query);

      const matchesInstitution =
        institutionFilter === "all" || item.institution === institutionFilter;

      const matchesStatus =
        statusFilter === "all" || (item.status ?? "draft") === statusFilter;

      return matchesSearch && matchesInstitution && matchesStatus;
    });
  }, [programmes, search, institutionFilter, statusFilter]);

  const hasFilters =
    search.trim() !== "" ||
    institutionFilter !== "all" ||
    statusFilter !== "all";

  function clearFilters() {
    setSearch("");
    setInstitutionFilter("all");
    setStatusFilter("all");
  }

  async function deleteProgramme(programme: Programme) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${programme.title}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    setDeletingId(programme.id);
    setError("");
    setSuccess("");

    try {
      const { data, error: deleteError } = await supabase
        .from("programmes")
        .delete()
        .eq("id", programme.id)
        .select("id");

      if (deleteError) throw deleteError;

      if (!data || data.length === 0) {
        throw new Error(
          "The programme was not deleted. Check your administrator permissions.",
        );
      }

      setProgrammes((prev) => prev.filter((item) => item.id !== programme.id));

      setSuccess(`"${programme.title}" was deleted successfully.`);
    } catch (err) {
      console.error("Failed to delete programme:", err);

      setError(
        err instanceof Error ? err.message : "Unable to delete programme.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-7">
      {/* Page heading */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
            Innovar Administration
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#101A44] sm:text-4xl">
            Programme Management
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Manage academic pathways and training programmes across Innovar
            institutions.
          </p>
        </div>

        <Link
          to="/admin/programmes/add"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F5BE20] px-6 py-3.5 text-sm font-extrabold text-[#101A44] shadow-sm transition hover:bg-[#E5AB10]"
        >
          <Plus size={19} />
          Add Programme
        </Link>
      </div>

      {/* Feedback */}
      {error && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          <CheckCircle2 size={19} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[
          {
            label: "Total Programmes",
            value: stats.total,
            icon: BookOpen,
            color: "bg-blue-50 text-[#092C80]",
          },
          {
            label: "International School",
            value: stats.school,
            icon: BookOpen,
            color: "bg-purple-50 text-[#542080]",
          },
          {
            label: "Innovar Institute",
            value: stats.institute,
            icon: BookOpen,
            color: "bg-indigo-50 text-indigo-700",
          },
          {
            label: "Published",
            value: stats.published,
            icon: CheckCircle2,
            color: "bg-green-50 text-green-700",
          },
          {
            label: "Featured",
            value: stats.featured,
            icon: Star,
            color: "bg-amber-50 text-amber-700",
          },
        ].map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${card.color}`}
              >
                <Icon size={21} />
              </div>

              <p className="text-3xl font-extrabold text-[#101A44]">
                {loading ? "—" : card.value}
              </p>

              <p className="mt-1 text-xs font-semibold text-slate-500">
                {card.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Programme listing */}
      <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {/* Filters */}
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#101A44]">
                All Programmes
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {loading
                  ? "Loading records..."
                  : `${filteredProgrammes.length} of ${programmes.length} programmes`}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void fetchProgrammes()}
              disabled={loading}
              className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#101A44] hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search programmes..."
                aria-label="Search programmes"
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#542080] focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div className="relative">
              <Filter
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={institutionFilter}
                onChange={(event) =>
                  setInstitutionFilter(event.target.value as InstitutionFilter)
                }
                aria-label="Filter by institution"
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#542080]"
              >
                <option value="all">All Institutions</option>
                <option value="school">Innovar International School</option>
                <option value="institute">Innovar Institute</option>
              </select>
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              aria-label="Filter by publication status"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#542080]"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#542080] hover:underline"
            >
              <X size={14} />
              Clear Filters
            </button>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center gap-3 p-14 text-[#542080]">
            <Loader2 size={24} className="animate-spin" />
            <span className="text-sm font-semibold">Loading programmes...</span>
          </div>
        ) : programmes.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <BookOpen size={46} className="mx-auto mb-4 text-[#542080]" />

            <h3 className="text-lg font-extrabold text-[#101A44]">
              No programmes added yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
              Start by adding an academic pathway or training programme for
              Innovar.
            </p>

            <Link
              to="/admin/programmes/add"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F5BE20] px-6 py-3 font-bold text-[#101A44]"
            >
              <Plus size={17} />
              Add First Programme
            </Link>
          </div>
        ) : filteredProgrammes.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <Search size={40} className="mx-auto mb-4 text-slate-300" />

            <p className="font-bold text-[#101A44]">No matching programmes</p>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 text-sm font-bold text-[#542080] hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-[#101A44] text-white">
                <tr>
                  <th className="px-5 py-4">Programme</th>
                  <th className="px-5 py-4">Institution</th>
                  <th className="px-5 py-4">Category / Level</th>
                  <th className="px-5 py-4">Duration</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Featured</th>
                  <th className="px-5 py-4">Created</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProgrammes.map((programme) => (
                  <tr
                    key={programme.id}
                    className="border-b border-slate-100 transition hover:bg-[#F8F9FE] last:border-b-0"
                  >
                    {/* Programme */}
                    <td className="px-5 py-4">
                      <div className="flex min-w-[220px] items-center gap-3">
                        {programme.image_url ? (
                          <img
                            src={programme.image_url}
                            alt=""
                            loading="lazy"
                            className="h-14 w-16 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-16 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-[#542080]">
                            <BookOpen size={23} />
                          </div>
                        )}

                        <div>
                          <p className="font-bold leading-6 text-[#101A44]">
                            {programme.title}
                          </p>

                          <p className="mt-1 max-w-[220px] truncate text-xs text-slate-400">
                            /programmes/{programme.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Institution */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
                          programme.institution === "school"
                            ? "bg-blue-50 text-[#092C80]"
                            : programme.institution === "institute"
                              ? "bg-purple-50 text-[#542080]"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {institutionLabel(programme.institution)}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-700">
                        {programme.category || "—"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {programme.level || "Level not specified"}
                      </p>
                    </td>

                    {/* Duration */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-2 text-slate-600">
                        <Clock3 size={15} className="text-slate-400" />
                        {programme.duration || "—"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
                          programme.status === "published"
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {programme.status === "published"
                          ? "Published"
                          : "Draft"}
                      </span>
                    </td>

                    {/* Featured */}
                    <td className="px-5 py-4">
                      {programme.featured ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                          <Star size={13} fill="currentColor" />
                          Featured
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">No</span>
                      )}
                    </td>

                    {/* Created */}
                    <td className="px-5 py-4 text-xs text-slate-500">
                      {formatDate(programme.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {programme.status === "published" && (
                          <Link
                            to={`/programmes/${programme.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View programme"
                            aria-label={`View ${programme.title}`}
                            className="rounded-lg bg-slate-100 p-2.5 text-slate-600 transition hover:bg-slate-200"
                          >
                            <ExternalLink size={16} />
                          </Link>
                        )}

                        <Link
                          to={`/admin/programmes/edit/${programme.id}`}
                          title="Edit programme"
                          aria-label={`Edit ${programme.title}`}
                          className="rounded-lg bg-purple-50 p-2.5 text-[#542080] transition hover:bg-purple-100"
                        >
                          <Edit3 size={16} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => void deleteProgramme(programme)}
                          disabled={deletingId !== null}
                          title="Delete programme"
                          aria-label={`Delete ${programme.title}`}
                          className="rounded-lg bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === programme.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
