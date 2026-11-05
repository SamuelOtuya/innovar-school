import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  ImageIcon,
  Newspaper,
  RefreshCw,
} from "lucide-react";

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

  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(date);

  const parsed = new Date(dateOnly ? `${date}T12:00:00Z` : date);

  if (Number.isNaN(parsed.getTime())) return null;

  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Nairobi",
  }).format(parsed);
}

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function fetchNews() {
      setLoading(true);
      setError(false);

      try {
        const { data, error: fetchError } = await supabase
          .from("news_events")
          .select("id,slug,title,category,event_date,image_url,excerpt")
          .eq("status", "published")
          .order("event_date", {
            ascending: false,
            nullsFirst: false,
          })
          .limit(3);

        if (fetchError) throw fetchError;
        if (!active) return;

        setNews(data ?? []);
      } catch (err) {
        if (!active) return;

        console.error("Failed to load Innovar news:", err);
        setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchNews();

    return () => {
      active = false;
    };
  }, [retryKey]);

  const retry = useCallback(() => {
    setRetryKey((value) => value + 1);
  }, []);

  return (
    <section
      id="news"
      aria-labelledby="news-heading"
      className="bg-white px-5 py-20 sm:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
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
            Discover the latest announcements, school activities, academic
            developments and exciting moments from Innovar International School
            and Innovar Institute.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div
            className="grid gap-7 md:grid-cols-3"
            aria-busy="true"
            aria-label="Loading news and events"
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
          <div
            role="status"
            className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-[#F8F9FE] p-10 text-center"
          >
            <Newspaper size={38} className="mx-auto mb-4 text-[#542080]" />

            <h3 className="mb-3 text-lg font-extrabold text-[#101A44]">
              News Temporarily Unavailable
            </h3>

            <p className="mb-6 text-sm leading-7 text-slate-600">
              We couldn't load the latest updates. Please try again.
            </p>

            <button
              type="button"
              onClick={retry}
              className="inline-flex items-center gap-2 rounded-lg bg-[#542080] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#3C1461]"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        ) : news.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-[#F8F9FE] p-10 text-center">
            <Newspaper size={38} className="mx-auto mb-4 text-[#542080]" />

            <h3 className="mb-3 text-lg font-extrabold text-[#101A44]">
              Stay Tuned
            </h3>

            <p className="text-sm leading-7 text-slate-600">
              News, events and announcements from Innovar will appear here as
              they are published.
            </p>
          </div>
        ) : (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => {
              const displayDate = formatDate(item.event_date);
              const articleUrl = `/news/${encodeURIComponent(item.slug)}`;

              return (
                <article
                  key={item.id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_5px_25px_rgba(25,25,65,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(25,25,65,0.12)] motion-reduce:transform-none"
                >
                  {/* Image */}
                  <Link
                    to={articleUrl}
                    aria-label={`Read ${item.title}`}
                    className="block overflow-hidden"
                  >
                    <div className="relative h-52 overflow-hidden bg-[#F0E9FA]">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageIcon size={42} className="text-[#542080]/40" />
                        </div>
                      )}

                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#101A44]/25 to-transparent" />
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-[#F1EBFA] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-[#542080]">
                        {item.category || "News"}
                      </span>

                      {displayDate && (
                        <span className="flex items-center gap-1.5 text-xs text-slate-500">
                          <CalendarDays size={14} className="text-[#B8860B]" />

                          <time dateTime={item.event_date?.slice(0, 10)}>
                            {displayDate}
                          </time>
                        </span>
                      )}
                    </div>

                    <h3 className="mb-3 text-lg font-extrabold leading-snug text-[#101A44] transition-colors group-hover:text-[#542080]">
                      <Link to={articleUrl} className="hover:underline">
                        {item.title}
                      </Link>
                    </h3>

                    <p className="mb-6 line-clamp-3 text-sm leading-7 text-slate-600">
                      {item.excerpt ||
                        "Read the latest updates and activities from the Innovar community."}
                    </p>

                    <div className="mt-auto border-t border-slate-100 pt-4">
                      <Link
                        to={articleUrl}
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

        {/* View All */}
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
