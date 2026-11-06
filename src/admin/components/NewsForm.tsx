import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ImageUploadField from "./ImageUploadField";
import { supabase } from "../../services/supabase";

export type NewsFormData = {
  title: string;
  slug: string;
  institution: "school" | "institute";
  category: string;
  event_date: string;
  image_url: string;
  excerpt: string;
  content: string;
  featured: boolean;
  status: "published" | "draft";
};

export const emptyNewsForm: NewsFormData = {
  title: "",
  slug: "",
  institution: "school",
  category: "News",
  event_date: "",
  image_url: "",
  excerpt: "",
  content: "",
  featured: false,
  status: "draft",
};

export function generateNewsSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type Props = {
  initialData?: NewsFormData;
  newsId?: string;
};

export default function NewsForm({ initialData, newsId }: Props) {
  const navigate = useNavigate();
  const editing = Boolean(newsId);

  const [form, setForm] = useState<NewsFormData>(
    initialData ?? { ...emptyNewsForm },
  );

  const [slugEdited, setSlugEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof NewsFormData>(
    field: K,
    value: NewsFormData[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    setError("");

    const title = form.title.trim();
    const slug = generateNewsSlug(form.slug || title);

    if (!title || !slug) {
      setError("Please enter a valid title and slug.");
      return;
    }

    if (!form.content.trim()) {
      setError("Please enter the full article content.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title,
        slug,
        institution: form.institution,
        category: form.category,
        event_date: form.event_date || null,
        image_url: form.image_url || null,
        excerpt: form.excerpt.trim() || null,
        content: form.content.trim(),
        featured: form.featured,
        status: form.status,
      };

      if (newsId) {
        const { error: updateError } = await supabase
          .from("news_events")
          .update({
            ...payload,
            updated_at: new Date().toISOString(),
          })
          .eq("id", newsId);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("news_events")
          .insert(payload);

        if (insertError) throw insertError;
      }

      navigate("/admin/news", { replace: true });
    } catch (err) {
      console.error("Failed to save news:", err);

      const message =
        err instanceof Error ? err.message : "Unable to save news.";

      setError(
        message.includes("23505") ||
          message.toLowerCase().includes("duplicate key")
          ? "This URL slug is already in use. Choose another slug."
          : message,
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-[#101A44] outline-none transition focus:border-[#542080] focus:ring-2 focus:ring-purple-100";

  const labelClass = "mb-2 block text-sm font-bold text-[#101A44]";

  return (
    <div className="space-y-7">
      <button
        type="button"
        onClick={() => navigate("/admin/news")}
        className="inline-flex items-center gap-2 text-sm font-bold text-[#542080] hover:text-[#101A44]"
      >
        <ArrowLeft size={18} />
        Back to News & Events
      </button>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
          Innovar Content Management
        </p>

        <h1 className="text-3xl font-extrabold text-[#101A44]">
          {editing ? "Edit News / Event" : "Add News / Event"}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Publish updates for Innovar International School and Innovar
          Institute.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-7">
        <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-xl font-extrabold text-[#101A44]">
            Basic Information
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="news-title" className={labelClass}>
                Article Title
              </label>

              <input
                id="news-title"
                required
                value={form.title}
                onChange={(event) => {
                  const title = event.target.value;

                  setForm((prev) => ({
                    ...prev,
                    title,
                    slug: slugEdited ? prev.slug : generateNewsSlug(title),
                  }));
                }}
                placeholder="Enter article title"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="news-slug" className={labelClass}>
                URL Slug
              </label>

              <input
                id="news-slug"
                required
                value={form.slug}
                onChange={(event) => {
                  setSlugEdited(true);
                  update("slug", event.target.value);
                }}
                placeholder="article-url-slug"
                className={inputClass}
              />

              <p className="mt-2 text-xs text-slate-500">
                /news/{form.slug || "article-url-slug"}
              </p>
            </div>

            <div>
              <label htmlFor="news-institution" className={labelClass}>
                Institution
              </label>

              <select
                id="news-institution"
                value={form.institution}
                onChange={(event) =>
                  update(
                    "institution",
                    event.target.value as NewsFormData["institution"],
                  )
                }
                className={inputClass}
              >
                <option value="school">Innovar International School</option>
                <option value="institute">Innovar Institute</option>
              </select>
            </div>

            <div>
              <label htmlFor="news-category" className={labelClass}>
                Category
              </label>

              <select
                id="news-category"
                value={form.category}
                onChange={(event) => update("category", event.target.value)}
                className={inputClass}
              >
                <option value="News">News</option>
                <option value="Event">Event</option>
                <option value="Announcement">Announcement</option>
              </select>
            </div>

            <div>
              <label htmlFor="news-date" className={labelClass}>
                Event / Publication Date
              </label>

              <input
                id="news-date"
                type="date"
                value={form.event_date}
                onChange={(event) => update("event_date", event.target.value)}
                className={inputClass}
              />

              <p className="mt-2 text-xs text-slate-500">
                Leave blank if no specific date applies.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-xl font-extrabold text-[#101A44]">
            Featured Image
          </h2>

          <ImageUploadField
            label="News / Event Image"
            folder="news"
            value={form.image_url}
            onChange={(url) => update("image_url", url)}
          />
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-xl font-extrabold text-[#101A44]">
            Article Content
          </h2>

          <div className="space-y-6">
            <div>
              <label htmlFor="news-excerpt" className={labelClass}>
                Short Summary
              </label>

              <textarea
                id="news-excerpt"
                rows={3}
                value={form.excerpt}
                onChange={(event) => update("excerpt", event.target.value)}
                placeholder="Brief description for the news cards"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="news-content" className={labelClass}>
                Full Article
              </label>

              <textarea
                id="news-content"
                required
                rows={12}
                value={form.content}
                onChange={(event) => update("content", event.target.value)}
                placeholder="Write the complete article or event details..."
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-xl font-extrabold text-[#101A44]">
            Publishing Settings
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="news-status" className={labelClass}>
                Publication Status
              </label>

              <select
                id="news-status"
                value={form.status}
                onChange={(event) =>
                  update("status", event.target.value as NewsFormData["status"])
                }
                className={inputClass}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <label className="flex items-center gap-3 self-center text-sm font-bold text-[#101A44]">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => update("featured", event.target.checked)}
                className="h-4 w-4 accent-[#542080]"
              />
              Mark as Featured
            </label>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#F5BE20] px-8 py-4 text-sm font-extrabold text-[#101A44] transition hover:bg-[#E5AB10] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}

            {saving
              ? "Saving..."
              : editing
                ? "Update News / Event"
                : "Save News / Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
