
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BookOpen,
  Camera,
  CheckCircle2,
  ChevronRight,
  Drama,
  Globe2,
  HeartHandshake,
  ImageIcon,
  Lightbulb,
  LoaderCircle,
  School,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";

import PageHeader from "../components/common/PageHeader";
import ImageGallery from "../components/common/ImageGallery";
import { supabase } from "../services/supabase";

// Replace this import with an authentic Innovar photo.
// Do not reuse the previous KSVTI studentlife.jpeg.
import studentLifeImage from "../assets/images/about-preview.jpg";

type GalleryImage = {
  id: string;
  title: string;
  image_url: string;
};

const activities = [
  {
    icon: Trophy,
    title: "Sports & Recreation",
    description:
      "Opportunities to participate in soccer, basketball, skating, karate and other physical activities.",
  },
  {
    icon: BookOpen,
    title: "Chess & Academic Clubs",
    description:
      "Activities that encourage strategic thinking, concentration, teamwork and academic curiosity.",
  },
  {
    icon: Globe2,
    title: "Global Citizenship",
    description:
      "Model United Nations and World Scholars activities encourage awareness of global issues and different perspectives.",
  },
  {
    icon: Award,
    title: "Leadership Development",
    description:
      "Scouting and the Presidential Award programme provide opportunities for responsibility, teamwork and personal growth.",
  },
  {
    icon: Lightbulb,
    title: "Innovation & Discovery",
    description:
      "Creative projects and problem-solving activities help learners explore ideas beyond their regular lessons.",
  },
  {
    icon: Drama,
    title: "Creativity & Expression",
    description:
      "Creative activities encourage imagination, self-expression and confidence.",
  },
  {
    icon: Users,
    title: "Friendship & Community",
    description:
      "Shared experiences help learners build positive relationships, cooperation and a sense of belonging.",
  },
  {
    icon: HeartHandshake,
    title: "Character Development",
    description:
      "Learning experiences encourage respect, responsibility, confidence and consideration for others.",
  },
];

const galleryCategories = [
  "Student Activities",
  "Campus Life",
  "Practical Training",
  "Sports",
  "Clubs",
  "School Events",
];

export default function StudentLife() {
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [galleryError, setGalleryError] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchStudentLifeGallery() {
      try {
        const { data, error } = await supabase
          .from("gallery_images")
          .select("id,title,image_url")
          .eq("status", "published")
          .in("category", galleryCategories)
          .order("created_at", { ascending: false })
          .limit(6);

        if (!active) return;

        if (error) throw error;

        setGallery(data ?? []);
        setGalleryError(false);
      } catch (error) {
        if (!active) return;

        console.error(
          "Unable to load student life gallery:",
          error
        );

        setGalleryError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchStudentLifeGallery();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PageHeader
        title="Student Life"
        subtitle="Discover the experiences, friendships and opportunities that make life at Innovar International School special."
      />

      {/* Introduction */}
      <section className="bg-white px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          {/* Image */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(16,26,68,0.12)]">
              <img
                src={studentLifeImage}
                alt="Innovar International School learning environment"
                className="h-[350px] w-full object-cover sm:h-[460px]"
                loading="lazy"
              />
            </div>

            <div className="absolute -bottom-6 left-5 right-5 rounded-2xl bg-[#542080] p-5 text-white shadow-xl sm:left-8 sm:right-auto sm:px-7">
              <p className="text-lg font-extrabold">
                Aspire. Actualize. Inspire.
              </p>

              <p className="mt-1 text-xs text-white/75">
                Learning beyond the classroom
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="pt-7 lg:pt-0">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
              The Innovar Experience
            </p>

            <h2 className="mb-6 text-3xl font-extrabold leading-tight text-[#101A44] sm:text-4xl lg:text-5xl">
              Learn, Grow
              <span className="block text-[#542080]">
                & Thrive
              </span>
            </h2>

            <div className="mb-7 h-1 w-14 rounded-full bg-[#F5BE20]" />

            <p className="mb-5 text-sm leading-8 text-slate-600 sm:text-base">
              At Innovar International School, education
              extends beyond academic lessons. Student
              life includes opportunities to explore
              interests, develop talents, build friendships
              and strengthen essential life skills.
            </p>

            <p className="mb-8 text-sm leading-8 text-slate-600 sm:text-base">
              Through sports, clubs, leadership activities
              and creative experiences, learners can
              discover their strengths and grow in
              confidence within the school community.
            </p>

            <Link
              to="/admissions"
              className="inline-flex items-center gap-3 rounded-lg bg-[#542080] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#3C1461]"
            >
              Explore Admissions
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="bg-[#F8F9FE] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
              Beyond the Classroom
            </p>

            <h2 className="text-3xl font-extrabold text-[#101A44] sm:text-4xl lg:text-5xl">
              Explore Student
              <span className="text-[#542080]">
                {" "}Activities
              </span>
            </h2>

            <div className="mx-auto my-5 h-1 w-14 rounded-full bg-[#F5BE20]" />

            <p className="text-sm leading-8 text-slate-600 sm:text-base">
              Discover opportunities that support
              physical development, creativity,
              leadership and personal growth.
            </p>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {activities.map((activity) => {
              const Icon = activity.icon;

              return (
                <article
                  key={activity.title}
                  className="group rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#F1EBFA] transition-colors group-hover:bg-[#542080]">
                    <Icon
                      size={27}
                      className="text-[#542080] transition-colors group-hover:text-white"
                    />
                  </div>

                  <h3 className="mb-3 text-lg font-extrabold text-[#101A44]">
                    {activity.title}
                  </h3>

                  <p className="text-sm leading-7 text-slate-600">
                    {activity.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Day and boarding */}
      <section className="bg-white px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
              Our School Community
            </p>

            <h2 className="mb-6 text-3xl font-extrabold text-[#101A44] sm:text-4xl">
              A Place to Learn
              <span className="text-[#542080]">
                {" "}& Belong
              </span>
            </h2>

            <p className="mb-6 text-sm leading-8 text-slate-600 sm:text-base">
              Innovar International School provides day
              and boarding options, offering families
              different arrangements for their
              children's education.
            </p>

            <p className="mb-8 text-sm leading-8 text-slate-600 sm:text-base">
              Our student experience encourages learners
              to participate in school activities,
              develop independence and build
              meaningful relationships.
            </p>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#542080] hover:text-[#B8860B]"
            >
              Enquire About School Life
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="rounded-3xl bg-[#101A44] p-8 text-white sm:p-10">
            <School
              size={38}
              className="mb-6 text-[#F5BE20]"
            />

            <h3 className="mb-6 text-2xl font-extrabold">
              The Innovar Community
            </h3>

            <div className="space-y-5">
              {[
                {
                  title: "Day School",
                  text: "A school-day learning experience with access to academic and co-curricular activities.",
                },
                {
                  title: "Boarding",
                  text: "A residential option for families seeking a boarding arrangement.",
                },
                {
                  title: "Co-curricular Activities",
                  text: "Opportunities to participate in sports, clubs and school programmes.",
                },
                {
                  title: "Personal Growth",
                  text: "Experiences that encourage independence, responsibility and teamwork.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 border-b border-white/10 pb-5 last:border-b-0 last:pb-0"
                >
                  <CheckCircle2
                    size={21}
                    className="mt-1 shrink-0 text-[#F5BE20]"
                  />

                  <div>
                    <h4 className="mb-1 text-sm font-bold">
                      {item.title}
                    </h4>

                    <p className="text-sm leading-7 text-white/70">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic gallery */}
      <section className="bg-[#F8F9FE] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
              Moments at Innovar
            </p>

            <h2 className="text-3xl font-extrabold text-[#101A44] sm:text-4xl">
              Student Life Gallery
            </h2>

            <div className="mx-auto my-5 h-1 w-14 rounded-full bg-[#F5BE20]" />

            <p className="text-sm leading-8 text-slate-600">
              Explore photographs of activities,
              learning experiences and events
              from our school community.
            </p>
          </div>

          {loading ? (
            <div
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              aria-busy="true"
              aria-label="Loading student life photographs"
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-200 motion-reduce:animate-none"
                />
              ))}
            </div>
          ) : galleryError ? (
            <div
              role="status"
              className="rounded-2xl border border-slate-100 bg-white p-12 text-center"
            >
              <ImageIcon
                size={38}
                className="mx-auto mb-4 text-[#542080]"
              />

              <h3 className="mb-2 text-lg font-bold text-[#101A44]">
                Gallery Temporarily Unavailable
              </h3>

              <p className="text-sm text-slate-600">
                We couldn't load the photographs right now.
                Please try again later.
              </p>
            </div>
          ) : gallery.length > 0 ? (
            <ImageGallery
              images={gallery.map((item) => ({
                src: item.image_url,
                title: item.title,
              }))}
              columns={3}
            />
          ) : (
            <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center">
              <Camera
                size={38}
                className="mx-auto mb-4 text-[#542080]"
              />

              <h3 className="mb-2 text-lg font-bold text-[#101A44]">
                More Moments Coming Soon
              </h3>

              <p className="text-sm text-slate-600">
                Student life photographs will appear
                here as they are published.
              </p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-3 rounded-lg bg-[#542080] px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-[#3C1461]"
            >
              View Full Gallery
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#542080] px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <ShieldCheck
            size={38}
            className="mx-auto mb-6 text-[#F5BE20]"
          />

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#F5BE20]">
            Aspire. Actualize. Inspire.
          </p>

          <h2 className="mb-6 text-3xl font-extrabold text-white sm:text-4xl">
            Discover Life at Innovar
          </h2>

          <p className="mx-auto mb-9 max-w-2xl text-sm leading-8 text-white/80 sm:text-base">
            Explore an international school experience
            that brings together academic learning,
            student activities and opportunities
            for personal growth.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/admissions"
              className="inline-flex items-center gap-2 rounded-lg bg-[#F5BE20] px-7 py-3.5 text-sm font-bold text-[#092C80] transition-colors hover:bg-[#FFD34D]"
            >
              Explore Admissions
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-white/60 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#542080]"
            >
              Contact Us
              <ChevronRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
