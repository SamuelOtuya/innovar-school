import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Eye,
  GraduationCap,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { supabase } from "../../services/supabase";

type ApplicationStatus = "new" | "contacted" | "admitted" | "rejected";

type Application = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  programme: string | null;
  qualification: string | null;
  preferred_intake: string | null;
  message: string | null;
  status: string | null;
  created_at: string;
};

type ProgrammeReference = {
  title: string;
  institution: string | null;
};

type InstitutionFilter = "all" | "school" | "institute";

const statusOptions: ApplicationStatus[] = [
  "new",
  "contacted",
  "admitted",
  "rejected",
];

const statusStyles: Record<ApplicationStatus, string> = {
  new: "bg-blue-50 text-blue-700",
  contacted: "bg-amber-50 text-amber-700",
  admitted: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};

function getStatus(value: string | null): ApplicationStatus {
  return statusOptions.includes(value as ApplicationStatus)
    ? (value as ApplicationStatus)
    : "new";
}

function getInstitutionLabel(value: string | null) {
  if (value === "school") return "International School";
  if (value === "institute") return "Innovar Institute";
  return "Not identified";
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function ApplicationsAdmin() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [programmeReferences, setProgrammeReferences] = useState<
    ProgrammeReference[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [institutionFilter, setInstitutionFilter] =
    useState<InstitutionFilter>("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [applicationsResult, programmesResult] = await Promise.all([
        supabase
          .from("applications")
          .select(
            "id,full_name,phone,email,programme,qualification,preferred_intake,message,status,created_at",
          )
          .order("created_at", { ascending: false }),

        supabase.from("programmes").select("title,institution"),
      ]);

      if (applicationsResult.error) {
        throw applicationsResult.error;
      }

      setApplications((applicationsResult.data ?? []) as Application[]);

      if (programmesResult.error) {
        console.error(
          "Unable to load programme references:",
          programmesResult.error,
        );
        setProgrammeReferences([]);
      } else {
        setProgrammeReferences(
          (programmesResult.data ?? []) as ProgrammeReference[],
        );
      }
    } catch (err) {
      console.error("Unable to fetch applications:", err);

      setError(
        err instanceof Error ? err.message : "Unable to load applications.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchApplications();
  }, [fetchApplications]);

  // Institution is inferred from the programme title.
  // If a title exists in both institutions, it is ambiguous.
  const programmeInstitutionMap = useMemo(() => {
    const map = new Map<string, string | null>();

    programmeReferences.forEach((programme) => {
      const key = programme.title.trim().toLowerCase();

      if (!key) return;

      if (!map.has(key)) {
        map.set(key, programme.institution);
      } else if (map.get(key) !== programme.institution) {
        map.set(key, null);
      }
    });

    return map;
  }, [programmeReferences]);

  function getApplicationInstitution(item: Application) {
    const key = item.programme?.trim().toLowerCase();

    if (!key) return null;

    return programmeInstitutionMap.get(key) ?? null;
  }

  const stats = useMemo(() => {
    return {
      total: applications.length,
      new: applications.filter((item) => getStatus(item.status) === "new")
        .length,
      contacted: applications.filter(
        (item) => getStatus(item.status) === "contacted",
      ).length,
      admitted: applications.filter(
        (item) => getStatus(item.status) === "admitted",
      ).length,
      rejected: applications.filter(
        (item) => getStatus(item.status) === "rejected",
      ).length,
    };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications.filter((item) => {
      const searchable = [
        item.full_name,
        item.phone,
        item.email,
        item.programme,
        item.qualification,
        item.preferred_intake,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchable.includes(query);

      const matchesStatus =
        statusFilter === "all" || getStatus(item.status) === statusFilter;

      const matchesInstitution =
        institutionFilter === "all" ||
        getApplicationInstitution(item) === institutionFilter;

      return matchesSearch && matchesStatus && matchesInstitution;
    });
  }, [
    applications,
    search,
    statusFilter,
    institutionFilter,
    programmeInstitutionMap,
  ]);

  async function updateStatus(item: Application, status: ApplicationStatus) {
    if (status === getStatus(item.status)) return;

    setUpdatingId(item.id);
    setError("");
    setSuccess("");

    try {
      const { data, error: updateError } = await supabase
        .from("applications")
        .update({ status })
        .eq("id", item.id)
        .select("id,status")
        .single();

      if (updateError) throw updateError;

      if (!data) {
        throw new Error("Application status was not updated.");
      }

      setApplications((prev) =>
        prev.map((application) =>
          application.id === item.id
            ? { ...application, status: data.status }
            : application,
        ),
      );

      setSelectedApplication((prev) =>
        prev?.id === item.id ? { ...prev, status: data.status } : prev,
      );

      setSuccess(`Application for ${item.full_name} updated to ${status}.`);
    } catch (err) {
      console.error("Unable to update status:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update application status.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteApplication(item: Application) {
    const confirmed = window.confirm(
      `Permanently delete the application submitted by ${item.full_name}?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    setDeletingId(item.id);
    setError("");
    setSuccess("");

    try {
      const { data, error: deleteError } = await supabase
        .from("applications")
        .delete()
        .eq("id", item.id)
        .select("id");

      if (deleteError) throw deleteError;

      if (!data || data.length === 0) {
        throw new Error(
          "The application was not deleted. Check your administrator permissions.",
        );
      }

      setApplications((prev) =>
        prev.filter((application) => application.id !== item.id),
      );

      if (selectedApplication?.id === item.id) {
        setSelectedApplication(null);
      }

      setSuccess("Application deleted successfully.");
    } catch (err) {
      console.error("Unable to delete application:", err);

      setError(
        err instanceof Error ? err.message : "Unable to delete application.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
            Innovar Administration
          </p>

          <h1 className="text-3xl font-extrabold text-[#101A44] sm:text-4xl">
            Applications
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Review and manage applications submitted through the Innovar
            website.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void fetchApplications()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#101A44] hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Feedback */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[
          {
            label: "Total Applications",
            value: stats.total,
            icon: Users,
            color: "bg-blue-50 text-blue-700",
          },
          {
            label: "New",
            value: stats.new,
            icon: Clock3,
            color: "bg-indigo-50 text-indigo-700",
          },
          {
            label: "Contacted",
            value: stats.contacted,
            icon: Phone,
            color: "bg-amber-50 text-amber-700",
          },
          {
            label: "Admitted",
            value: stats.admitted,
            icon: GraduationCap,
            color: "bg-green-50 text-green-700",
          },
          {
            label: "Rejected",
            value: stats.rejected,
            icon: X,
            color: "bg-red-50 text-red-700",
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

      {/* Applications table */}
      <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <h2 className="text-lg font-extrabold text-[#101A44]">
            Submitted Applications
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {filteredApplications.length} application(s) shown
          </p>

          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search applicants or programmes..."
                aria-label="Search applications"
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#542080]"
              />
            </div>

            <select
              value={institutionFilter}
              onChange={(event) =>
                setInstitutionFilter(event.target.value as InstitutionFilter)
              }
              aria-label="Filter applications by institution"
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#542080]"
            >
              <option value="all">All Institutions</option>
              <option value="school">Innovar International School</option>
              <option value="institute">Innovar Institute</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter applications by status"
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#542080]"
            >
              <option value="all">All Statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 p-14 text-sm text-[#542080]">
            <Loader2 size={24} className="animate-spin" />
            Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <BookOpen size={43} className="mx-auto mb-4 text-[#542080]" />
            <p className="font-bold text-[#101A44]">
              No applications submitted yet.
            </p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="px-6 py-14 text-center text-sm text-slate-500">
            No applications match your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-[#101A44] text-white">
                <tr>
                  <th className="px-5 py-4">Applicant</th>
                  <th className="px-5 py-4">Institution</th>
                  <th className="px-5 py-4">Programme</th>
                  <th className="px-5 py-4">Intake</th>
                  <th className="px-5 py-4">Submitted</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredApplications.map((item) => {
                  const currentStatus = getStatus(item.status);

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 hover:bg-[#F8F9FE] last:border-b-0"
                    >
                      <td className="px-5 py-4">
                        <p className="font-bold text-[#101A44]">
                          {item.full_name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {item.phone}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-purple-50 px-3 py-1.5 text-xs font-bold text-[#542080]">
                          {getInstitutionLabel(getApplicationInstitution(item))}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-700">
                        {item.programme || "—"}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {item.preferred_intake || "—"}
                      </td>

                      <td className="px-5 py-4 text-xs text-slate-500">
                        {formatDate(item.created_at)}
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={currentStatus}
                          onChange={(event) =>
                            void updateStatus(
                              item,
                              event.target.value as ApplicationStatus,
                            )
                          }
                          disabled={updatingId === item.id}
                          aria-label={`Status for ${item.full_name}`}
                          className={`rounded-lg border-0 px-3 py-2 text-xs font-bold outline-none disabled:opacity-50 ${statusStyles[currentStatus]}`}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedApplication(item)}
                            title="View application"
                            aria-label={`View ${item.full_name}`}
                            className="rounded-lg bg-blue-50 p-2.5 text-blue-700 hover:bg-blue-100"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => void deleteApplication(item)}
                            disabled={deletingId !== null}
                            title="Delete application"
                            aria-label={`Delete ${item.full_name}`}
                            className="rounded-lg bg-red-50 p-2.5 text-red-600 hover:bg-red-100 disabled:opacity-50"
                          >
                            {deletingId === item.id ? (
                              <Loader2 size={17} className="animate-spin" />
                            ) : (
                              <Trash2 size={17} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Application details modal */}
      {selectedApplication && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#101A44]/70 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedApplication(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Application details"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#542080]">
                  Application Details
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-[#101A44]">
                  {selectedApplication.full_name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
                aria-label="Close application details"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={21} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <Detail
                  label="Institution"
                  value={getInstitutionLabel(
                    getApplicationInstitution(selectedApplication),
                  )}
                />

                <Detail
                  label="Programme"
                  value={selectedApplication.programme}
                />

                <Detail
                  label="Qualification"
                  value={selectedApplication.qualification}
                />

                <Detail
                  label="Preferred Intake"
                  value={selectedApplication.preferred_intake}
                />

                <Detail
                  label="Submitted"
                  value={formatDate(selectedApplication.created_at)}
                />

                <Detail
                  label="Status"
                  value={getStatus(selectedApplication.status)}
                />
              </div>

              <div className="border-t border-slate-100 pt-5">
                <h3 className="mb-4 font-extrabold text-[#101A44]">
                  Contact Information
                </h3>

                <div className="space-y-3 text-sm">
                  <a
                    href={`tel:${selectedApplication.phone}`}
                    className="flex items-center gap-3 text-[#542080] hover:underline"
                  >
                    <Phone size={17} />
                    {selectedApplication.phone}
                  </a>

                  {selectedApplication.email && (
                    <a
                      href={`mailto:${selectedApplication.email}`}
                      className="flex items-center gap-3 text-[#542080] hover:underline"
                    >
                      <Mail size={17} />
                      {selectedApplication.email}
                    </a>
                  )}
                </div>
              </div>

              {selectedApplication.message && (
                <div className="border-t border-slate-100 pt-5">
                  <h3 className="mb-3 font-extrabold text-[#101A44]">
                    Additional Information
                  </h3>

                  <p className="whitespace-pre-line rounded-xl bg-[#F8F9FE] p-5 text-sm leading-7 text-slate-600">
                    {selectedApplication.message}
                  </p>
                </div>
              )}

              <div className="border-t border-slate-100 pt-5">
                <label
                  htmlFor="application-modal-status"
                  className="mb-2 block text-sm font-bold text-[#101A44]"
                >
                  Update Application Status
                </label>

                <select
                  id="application-modal-status"
                  value={getStatus(selectedApplication.status)}
                  onChange={(event) =>
                    void updateStatus(
                      selectedApplication,
                      event.target.value as ApplicationStatus,
                    )
                  }
                  disabled={updatingId === selectedApplication.id}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#542080]"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="break-words text-sm font-semibold text-[#101A44]">
        {value || "—"}
      </p>
    </div>
  );
}
