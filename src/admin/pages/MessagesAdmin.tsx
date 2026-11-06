
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CheckCircle2,
  Clock3,
  Eye,
  Inbox,
  Loader2,
  Mail,
  MailCheck,
  Phone,
  RefreshCw,
  Search,
  Send,
  Trash2,
  X,
} from "lucide-react";

import { supabase } from "../../services/supabase";

type MessageStatus = "new" | "read" | "replied";

type ContactMessage = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  inquiry_type: string | null;
  message: string;
  status: string | null;
  created_at: string;
};

const statusOptions: MessageStatus[] = [
  "new",
  "read",
  "replied",
];

const statusStyles: Record<MessageStatus, string> = {
  new: "bg-blue-50 text-blue-700",
  read: "bg-amber-50 text-amber-700",
  replied: "bg-green-50 text-green-700",
};

function getStatus(value: string | null): MessageStatus {
  if (value === "read" || value === "replied") return value;
  return "new";
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
    timeZone: "Africa/Nairobi",
  }).format(date);
}

function formatStatus(value: MessageStatus) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [inquiryFilter, setInquiryFilter] = useState("all");

  const [selectedMessage, setSelectedMessage] =
    useState<ContactMessage | null>(null);

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: fetchError } = await supabase
        .from("contact_messages")
        .select(
          "id,full_name,email,phone,inquiry_type,message,status,created_at"
        )
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setMessages((data ?? []) as ContactMessage[]);
    } catch (err) {
      console.error("Unable to load messages:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load contact messages."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMessages();
  }, [fetchMessages]);

  const statistics = useMemo(
    () => ({
      total: messages.length,
      new: messages.filter(
        (item) => getStatus(item.status) === "new"
      ).length,
      read: messages.filter(
        (item) => getStatus(item.status) === "read"
      ).length,
      replied: messages.filter(
        (item) => getStatus(item.status) === "replied"
      ).length,
    }),
    [messages]
  );

  const inquiryTypes = useMemo(() => {
    return Array.from(
      new Set(
        messages
          .map((item) => item.inquiry_type?.trim())
          .filter((value): value is string => Boolean(value))
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [messages]);

  const filteredMessages = useMemo(() => {
    const query = search.trim().toLowerCase();

    return messages.filter((item) => {
      const searchable = [
        item.full_name,
        item.email,
        item.phone,
        item.inquiry_type,
        item.message,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchable.includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        getStatus(item.status) === statusFilter;

      const matchesInquiry =
        inquiryFilter === "all" ||
        item.inquiry_type === inquiryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesInquiry
      );
    });
  }, [messages, search, statusFilter, inquiryFilter]);

  async function updateStatus(
    item: ContactMessage,
    status: MessageStatus
  ) {
    if (status === getStatus(item.status)) return;

    setUpdatingId(item.id);
    setError("");
    setSuccess("");

    try {
      const { data, error: updateError } = await supabase
        .from("contact_messages")
        .update({ status })
        .eq("id", item.id)
        .select("id,status")
        .single();

      if (updateError) throw updateError;

      if (!data) {
        throw new Error(
          "Message status was not updated. Check administrator permissions."
        );
      }

      setMessages((prev) =>
        prev.map((message) =>
          message.id === item.id
            ? { ...message, status: data.status }
            : message
        )
      );

      setSelectedMessage((prev) =>
        prev?.id === item.id
          ? { ...prev, status: data.status }
          : prev
      );

      setSuccess(
        `Message from ${item.full_name} marked as ${status}.`
      );
    } catch (err) {
      console.error("Unable to update message:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update message status."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteMessage(item: ContactMessage) {
    const confirmed = window.confirm(
      `Permanently delete the message from ${item.full_name}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(item.id);
    setError("");
    setSuccess("");

    try {
      const { data, error: deleteError } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", item.id)
        .select("id");

      if (deleteError) throw deleteError;

      if (!data || data.length === 0) {
        throw new Error(
          "The message was not deleted. Check administrator permissions."
        );
      }

      setMessages((prev) =>
        prev.filter((message) => message.id !== item.id)
      );

      setSelectedMessage((prev) =>
        prev?.id === item.id ? null : prev
      );

      setSuccess("Message deleted successfully.");
    } catch (err) {
      console.error("Unable to delete message:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete message."
      );
    } finally {
      setDeletingId(null);
    }
  }

  function openMessage(item: ContactMessage) {
    setSelectedMessage(item);

    // Do not automatically change status.
    // Opening a message is not necessarily a completed review.
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
            Innovar Administration
          </p>

          <h1 className="text-3xl font-extrabold text-[#101A44] sm:text-4xl">
            Contact Enquiries
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage messages submitted through the Innovar website.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void fetchMessages()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#101A44] hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
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

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: "Total Enquiries",
            value: statistics.total,
            icon: Inbox,
            color: "bg-blue-50 text-blue-700",
          },
          {
            label: "New Messages",
            value: statistics.new,
            icon: Clock3,
            color: "bg-indigo-50 text-indigo-700",
          },
          {
            label: "Read Messages",
            value: statistics.read,
            icon: Eye,
            color: "bg-amber-50 text-amber-700",
          },
          {
            label: "Replied",
            value: statistics.replied,
            icon: MailCheck,
            color: "bg-green-50 text-green-700",
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

      {/* Messages table */}
      <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <h2 className="text-lg font-extrabold text-[#101A44]">
            Received Messages
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {filteredMessages.length} message(s) shown
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
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search names, emails or messages..."
                aria-label="Search contact messages"
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#542080]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              aria-label="Filter by message status"
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#542080]"
            >
              <option value="all">All Statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </select>

            <select
              value={inquiryFilter}
              onChange={(event) =>
                setInquiryFilter(event.target.value)
              }
              aria-label="Filter by enquiry type"
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#542080]"
            >
              <option value="all">All Enquiry Types</option>
              {inquiryTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 p-14 text-sm text-[#542080]">
            <Loader2 size={24} className="animate-spin" />
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Inbox
              size={43}
              className="mx-auto mb-4 text-[#542080]"
            />

            <p className="font-bold text-[#101A44]">
              No messages received yet.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              New enquiries will appear here.
            </p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="px-6 py-14 text-center text-sm text-slate-500">
            No messages match your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-[#101A44] text-white">
                <tr>
                  <th className="px-5 py-4">Sender</th>
                  <th className="px-5 py-4">Enquiry Type</th>
                  <th className="px-5 py-4">Message</th>
                  <th className="px-5 py-4">Received</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredMessages.map((item) => {
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

                        {item.email && (
                          <p className="mt-1 max-w-[200px] truncate text-xs text-slate-500">
                            {item.email}
                          </p>
                        )}

                        {item.phone && (
                          <p className="mt-1 text-xs text-slate-500">
                            {item.phone}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {item.inquiry_type || "General Enquiry"}
                      </td>

                      <td className="px-5 py-4">
                        <p className="max-w-[250px] truncate text-slate-600">
                          {item.message}
                        </p>
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
                              event.target.value as MessageStatus
                            )
                          }
                          disabled={updatingId === item.id}
                          aria-label={`Status for ${item.full_name}`}
                          className={`rounded-lg border-0 px-3 py-2 text-xs font-bold outline-none disabled:opacity-50 ${statusStyles[currentStatus]}`}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {formatStatus(status)}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openMessage(item)}
                            title="View message"
                            aria-label={`View message from ${item.full_name}`}
                            className="rounded-lg bg-blue-50 p-2.5 text-blue-700 hover:bg-blue-100"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              void deleteMessage(item)
                            }
                            disabled={deletingId !== null}
                            title="Delete message"
                            aria-label={`Delete message from ${item.full_name}`}
                            className="rounded-lg bg-red-50 p-2.5 text-red-600 hover:bg-red-100 disabled:opacity-50"
                          >
                            {deletingId === item.id ? (
                              <Loader2
                                size={17}
                                className="animate-spin"
                              />
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

      {/* Message details modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#101A44]/70 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedMessage(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Contact message details"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#542080]">
                  Enquiry Details
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-[#101A44]">
                  {selectedMessage.full_name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                aria-label="Close message details"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={21} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <Detail
                  label="Enquiry Type"
                  value={
                    selectedMessage.inquiry_type ||
                    "General Enquiry"
                  }
                />

                <Detail
                  label="Received"
                  value={formatDate(
                    selectedMessage.created_at
                  )}
                />

                <Detail
                  label="Status"
                  value={formatStatus(
                    getStatus(selectedMessage.status)
                  )}
                />
              </div>

              <div className="border-t border-slate-100 pt-5">
                <h3 className="mb-4 font-extrabold text-[#101A44]">
                  Sender Contact Information
                </h3>

                <div className="space-y-3 text-sm">
                  {selectedMessage.email && (
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="flex items-center gap-3 text-[#542080] hover:underline"
                    >
                      <Mail size={17} />
                      {selectedMessage.email}
                    </a>
                  )}

                  {selectedMessage.phone && (
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="flex items-center gap-3 text-[#542080] hover:underline"
                    >
                      <Phone size={17} />
                      {selectedMessage.phone}
                    </a>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <h3 className="mb-3 font-extrabold text-[#101A44]">
                  Message
                </h3>

                <p className="whitespace-pre-wrap break-words rounded-xl bg-[#F8F9FE] p-5 text-sm leading-7 text-slate-700">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <label
                  htmlFor="message-modal-status"
                  className="mb-2 block text-sm font-bold text-[#101A44]"
                >
                  Update Message Status
                </label>

                <select
                  id="message-modal-status"
                  value={getStatus(selectedMessage.status)}
                  onChange={(event) =>
                    void updateStatus(
                      selectedMessage,
                      event.target.value as MessageStatus
                    )
                  }
                  disabled={updatingId === selectedMessage.id}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#542080]"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {formatStatus(status)}
                    </option>
                  ))}
                </select>
              </div>

              {selectedMessage.email && (
                <a
                  href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                    "Re: Your Enquiry to Innovar"
                  )}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#542080] px-6 py-4 text-sm font-extrabold text-white hover:bg-[#401663]"
                >
                  <Send size={18} />
                  Reply by Email
                </a>
              )}

              <p className="text-xs leading-6 text-slate-500">
                Opening your email application does not
                automatically send a reply or update the
                message status. Mark the enquiry as Replied
                after sending your response.
              </p>
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
