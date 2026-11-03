import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, ImageIcon, Newspaper } from "lucide-react";

import { supabase } from "../../services/supabase";

type NewsItem = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  event_date: string | null;
  image_url: string | null;
  excerpt: string | null;
};

function formatDate(date: string | null) {
  if (!date) return null;

  // Handle date-only strings without timezone shifts.
  const parsed = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T12:00:00` : date,
  );

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchNews() {
      const { data, error: fetchError } = await supabase
        .from("news_events")
        .select("id,slug,title,category,event_date,image_url,excerpt")
        .eq("status", "published")
        .order("event_date", {
          ascending: false,
          nullsFirst: false,
        })
        .limit(3);

      if (!active) return;

      if (fetchError) {
        console.error("Failed to fetch Innovar news:", fetchError);
        setError(true);
      } else {
        setNews(data || []);
        setError(false);
      }

      setLoading(false);
    }

    fetchNews();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="news"
      className="bg-white px-5 py-20 sm:px-8 lg:py-24"
      aria-labelledby="news-heading"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
            What's Happening at Innovar
          </p>

          <h2
            id="news-heading"
            className="text-3xl font-extrabold tracking-tight text-[#101A44] sm:text-4xl lg:text-5xl"
          >
            Latest News
            <span className="text-[#542080]"> & Events</span>
          </h2>

          <div className="mx-auto my-5 h-1 w-14 rounded-full bg-[#F5BE20]" />

          <p className="text-base leading-8 text-slate-600">
            Stay connected with our school community, academic activities,
            technical programmes and important announcements.
          </p>
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div
            className="grid gap-7 md:grid-cols-3"
            aria-label="Loading news"
            aria-busy="true"
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white"
              >
                <div className="h-52 animate-pulse bg-slate-200 motion-reduce:animate-none" />
                <div className="space-y-4 p-6">
                  <div className="h-5 w-24 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
                  <div className="h-6 w-4/5 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-[#F8F9FE] p-10 text-center">
            <Newspaper size={36} className="mx-auto mb-4 text-[#542080]" />

            <h3 className="mb-2 text-lg font-bold text-[#101A44]">
              News temporarily unavailable
            </h3>

            <p className="text-sm leading-7 text-slate-600">
              We couldn't load the latest updates. Please check again later.
            </p>
          </div>
        ) : news.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-[#F8F9FE] p-10 text-center">
            <Newspaper size={36} className="mx-auto mb-4 text-[#542080]" />

            <h3 className="mb-2 text-lg font-bold text-[#101A44]">
              Stay Tuned
            </h3>

            <p className="text-sm leading-7 text-slate-600">
              News, events and announcements from Innovar will appear here soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-7 md:grid-cols-3">
            {news.map((item) => {
              const displayDate = formatDate(item.event_date);

              return (
                <article
                  key={item.id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_5px_25px_rgba(25,25,65,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(25,25,65,0.12)] motion-reduce:transform-none"
                >
                  {/* News image */}
                  <Link
                    to={`/news/${item.slug}`}
                    className="block overflow-hidden"
                    aria-label={`Read ${item.title}`}
                  >
                    <div className="relative h-52 overflow-hidden bg-[#F0E9FA]">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageIcon size={42} className="text-[#542080]/40" />
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#101A44]/25 to-transparent" />
                    </div>
                  </Link>

                  {/* News content */}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-[#F1EBFA] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-[#542080]">
                        {item.category || "News"}
                      </span>

                      {displayDate && (
                        <span className="flex items-center gap-1.5 text-xs text-slate-500">
                          <CalendarDays size={14} className="text-[#B8860B]" />
                          <time dateTime={item.event_date || undefined}>
                            {displayDate}
                          </time>
                        </span>
                      )}
                    </div>

                    <h3 className="mb-3 text-lg font-extrabold leading-snug text-[#101A44] transition-colors group-hover:text-[#542080]">
                      <Link
                        to={`/news/${item.slug}`}
                        className="hover:underline"
                      >
                        {item.title}
                      </Link>
                    </h3>

                    <p className="mb-6 line-clamp-3 text-sm leading-7 text-slate-600">
                      {item.excerpt ||
                        "Discover the latest updates and activities from Innovar."}
                    </p>

                    <div className="mt-auto border-t border-slate-100 pt-4">
                      <Link
                        to={`/news/${item.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#542080] transition-colors hover:text-[#B8860B]"
                      >
                        Read More
                        <ArrowRight
                          size={16}
                          className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* View all */}
        <div className="mt-12 text-center">
          <Link
            to="/news"
            className="inline-flex items-center justify-center gap-3 rounded-lg bg-[#542080] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-purple-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#3C1461] motion-reduce:transform-none"
          >
            View All News & Events
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
