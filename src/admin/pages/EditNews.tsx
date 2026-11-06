
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import NewsForm, {
  type NewsFormData,
} from "../components/NewsForm";

import { supabase } from "../../services/supabase";

export default function EditNews() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<NewsFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadNews() {
      if (!id) {
        setError("Missing news identifier.");
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from("news_events")
        .select(
          "title,slug,institution,category,event_date,image_url,excerpt,content,featured,status"
        )
        .eq("id", id)
        .single();

      if (!active) return;

      if (fetchError || !data) {
        setError(fetchError?.message || "News/Event not found.");
      } else {
        setForm({
          title: data.title ?? "",
          slug: data.slug ?? "",
          institution:
            data.institution === "institute" ? "institute" : "school",
          category: data.category ?? "News",
          event_date: data.event_date ?? "",
          image_url: data.image_url ?? "",
          excerpt: data.excerpt ?? "",
          content: data.content ?? "",
          featured: Boolean(data.featured),
          status: data.status === "published" ? "published" : "draft",
        });
      }

      setLoading(false);
    }

    void loadNews();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 rounded-2xl bg-white p-12 text-[#542080]">
        <Loader2 size={22} className="animate-spin" />
        Loading news/event...
      </div>
    );
  }

  if (error || !form || !id) {
    return (
      <div className="rounded-2xl bg-white p-8">
        <h2 className="text-xl font-bold text-[#101A44]">
          Unable to load news
        </h2>

        <p className="mt-3 text-sm text-red-600">
          {error || "The requested record was not found."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/admin/news")}
          className="mt-6 inline-flex items-center gap-2 font-bold text-[#542080]"
        >
          <ArrowLeft size={17} />
          Back to News
        </button>
      </div>
    );
  }

  return <NewsForm key={id} newsId={id} initialData={form} />;
}
