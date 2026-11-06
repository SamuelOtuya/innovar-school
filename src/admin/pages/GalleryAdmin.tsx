import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  CheckCircle2,
  Edit3,
  Image as ImageIcon,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
} from "lucide-react";

import ImageUploadField from "../components/ImageUploadField";
import { supabase } from "../../services/supabase";

type GalleryStatus = "draft" | "published" | "archived";
type Institution = "school" | "institute";

type GalleryImage = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  image_url: string;
  institution: Institution;
  featured: boolean;
  status: GalleryStatus;
  created_at: string;
};

type GalleryForm = {
  title: string;
  category: string;
  description: string;
  image_url: string;
  institution: Institution;
  featured: boolean;
  status: GalleryStatus;
};

const emptyForm: GalleryForm = {
  title: "",
  category: "Campus Life",
  description: "",
  image_url: "",
  institution: "school",
  featured: false,
  status: "published",
};

const categories = [
  "Campus Life",
  "Student Activities",
  "Practical Training",
  "Graduation",
  "Events",
  "Workshops",
  "Sports",
  "Academic Activities",
  "Competitions",
];

export default function GalleryAdmin() {
  const [items, setItems] = useState<GalleryImage[]>([]);
  const [form, setForm] = useState<GalleryForm>({ ...emptyForm });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [filter, setFilter] = useState("all");

  const fetchGallery = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: fetchError } = await supabase
        .from("gallery_images")
        .select(
          "id,title,category,description,image_url,institution,featured,status,created_at",
        )
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setItems((data ?? []) as GalleryImage[]);
    } catch (err) {
      console.error("Failed to load gallery:", err);
      setError(
        err instanceof Error ? err.message : "Unable to load gallery images.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchGallery();
  }, [fetchGallery]);

  function resetForm() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setError("");
  }

  function editImage(item: GalleryImage) {
    setEditingId(item.id);

    setForm({
      title: item.title,
      category: item.category,
      description: item.description ?? "",
      image_url: item.image_url,
      institution: item.institution,
      featured: item.featured,
      status: item.status,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Please enter an image title.");
      return;
    }

    if (!form.image_url) {
      setError("Please upload a gallery image.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        category: form.category,
        description: form.description.trim() || null,
        image_url: form.image_url,
        institution: form.institution,
        featured: form.featured,
        status: form.status,
      };

      if (editingId) {
        const { error: updateError } = await supabase
          .from("gallery_images")
          .update(payload)
          .eq("id", editingId);

        if (updateError) throw updateError;

        setSuccess("Gallery image updated successfully.");
      } else {
        const { error: insertError } = await supabase
          .from("gallery_images")
          .insert(payload);

        if (insertError) throw insertError;

        setSuccess("Gallery image added successfully.");
      }

      setForm({ ...emptyForm });
      setEditingId(null);

      await fetchGallery();
    } catch (err) {
      console.error("Failed to save gallery image:", err);

      setError(
        err instanceof Error ? err.message : "Unable to save gallery image.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteImage(item: GalleryImage) {
    const confirmed = window.confirm(
      `Delete "${item.title}" from the gallery?`,
    );

    if (!confirmed) return;

    setDeletingId(item.id);
    setError("");
    setSuccess("");

    try {
      const { error: deleteError } = await supabase
        .from("gallery_images")
        .delete()
        .eq("id", item.id);

      if (deleteError) throw deleteError;

      setSuccess("Gallery record deleted successfully.");

      if (editingId === item.id) {
        resetForm();
      }

      await fetchGallery();
    } catch (err) {
      console.error("Failed to delete gallery image:", err);

      setError(
        err instanceof Error ? err.message : "Unable to delete gallery image.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function toggleStatus(item: GalleryImage) {
    setError("");
    setSuccess("");

    const nextStatus: GalleryStatus =
      item.status === "published" ? "draft" : "published";

    try {
      const { error: updateError } = await supabase
        .from("gallery_images")
        .update({ status: nextStatus })
        .eq("id", item.id);

      if (updateError) throw updateError;

      setSuccess(
        nextStatus === "published"
          ? "Image published successfully."
          : "Image moved to drafts.",
      );

      await fetchGallery();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update image status.",
      );
    }
  }

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true;
    if (filter === "featured") return item.featured;
    return item.institution === filter;
  });

  const publishedCount = items.filter(
    (item) => item.status === "published",
  ).length;

  const featuredCount = items.filter((item) => item.featured).length;

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
            Innovar Content Management
          </p>

          <h1 className="text-3xl font-extrabold text-[#101A44]">
            Gallery Management
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage photographs for Innovar International School and Innovar
            Institute.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void fetchGallery()}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#101A44] hover:bg-slate-50"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Images", value: items.length },
          { label: "Published", value: publishedCount },
          { label: "Featured", value: featuredCount },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{stat.label}</p>

            <p className="mt-2 text-3xl font-extrabold text-[#101A44]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Notifications */}
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

      {/* Add / Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="mb-7 flex items-center justify-between gap-3">
          <h2 className="text-xl font-extrabold text-[#101A44]">
            {editingId ? "Edit Gallery Image" : "Add Gallery Image"}
          </h2>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-red-600"
            >
              <X size={17} />
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-5">
            <div>
              <label
                htmlFor="gallery-title"
                className="mb-2 block text-sm font-bold text-[#101A44]"
              >
                Image Title
              </label>

              <input
                id="gallery-title"
                type="text"
                required
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    title: event.target.value,
                  }))
                }
                placeholder="Enter image title"
                className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-[#542080]"
              />
            </div>

            <div>
              <label
                htmlFor="gallery-institution"
                className="mb-2 block text-sm font-bold text-[#101A44]"
              >
                Institution
              </label>

              <select
                id="gallery-institution"
                value={form.institution}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    institution: event.target.value as Institution,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-[#542080]"
              >
                <option value="school">Innovar International School</option>
                <option value="institute">Innovar Institute</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="gallery-category"
                className="mb-2 block text-sm font-bold text-[#101A44]"
              >
                Category
              </label>

              <select
                id="gallery-category"
                value={form.category}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    category: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-[#542080]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="gallery-description"
                className="mb-2 block text-sm font-bold text-[#101A44]"
              >
                Description
              </label>

              <textarea
                id="gallery-description"
                rows={4}
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder="Describe the image"
                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-[#542080]"
              />
            </div>

            <div className="flex flex-wrap gap-6">
              <label className="flex cursor-pointer items-center gap-3 text-sm font-bold text-[#101A44]">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      featured: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-[#542080]"
                />
                Mark as Featured
              </label>
            </div>

            <div>
              <label
                htmlFor="gallery-status"
                className="mb-2 block text-sm font-bold text-[#101A44]"
              >
                Publishing Status
              </label>

              <select
                id="gallery-status"
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    status: event.target.value as GalleryStatus,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-[#542080]"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving || !form.image_url}
              className="inline-flex items-center gap-2 rounded-xl bg-[#F5BE20] px-7 py-3.5 text-sm font-extrabold text-[#101A44] transition hover:bg-[#E5AB10] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : editingId ? (
                <Save size={18} />
              ) : (
                <Plus size={18} />
              )}

              {saving ? "Saving..." : editingId ? "Save Changes" : "Add Image"}
            </button>
          </div>

          <ImageUploadField
            label="Gallery Image"
            folder="gallery"
            value={form.image_url}
            onChange={(url) =>
              setForm((prev) => ({
                ...prev,
                image_url: url,
              }))
            }
          />
        </div>
      </form>

      {/* Gallery Listing */}
      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-[#101A44]">
              Uploaded Images
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredItems.length} image(s) displayed
            </p>
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter gallery images"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#542080]"
          >
            <option value="all">All Images</option>
            <option value="school">International School</option>
            <option value="institute">Innovar Institute</option>
            <option value="featured">Featured Images</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-14 text-[#542080]">
            <Loader2 size={23} className="animate-spin" />
            <span className="text-sm">Loading gallery...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-xl bg-[#F8F9FE] py-14 text-center">
            <ImageIcon size={40} className="mx-auto mb-4 text-[#542080]" />

            <p className="font-semibold text-[#101A44]">
              No gallery images found
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Add an image or change your filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="relative h-48 bg-slate-100">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />

                  {item.featured && (
                    <span className="absolute left-3 top-3 rounded-full bg-[#F5BE20] px-3 py-1 text-xs font-bold text-[#101A44]">
                      Featured
                    </span>
                  )}
                </div>

                <div className="space-y-3 p-4">
                  <h3 className="font-extrabold text-[#101A44]">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500">{item.category}</p>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-[#542080]">
                      {item.institution === "school" ? "School" : "Institute"}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === "published"
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => editImage(item)}
                      className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-3 py-2 text-xs font-bold text-[#542080] hover:bg-purple-100"
                    >
                      <Edit3 size={14} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => void toggleStatus(item)}
                      className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-[#101A44] hover:bg-slate-200"
                    >
                      {item.status === "published" ? "Unpublish" : "Publish"}
                    </button>

                    <button
                      type="button"
                      disabled={deletingId === item.id}
                      onClick={() => void deleteImage(item)}
                      className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
