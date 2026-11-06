import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type InputHTMLAttributes,
} from "react";

import { Link, useSearchParams } from "react-router-dom";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Send,
} from "lucide-react";

import PageHeader from "../components/common/PageHeader";
import { supabase } from "../services/supabase";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type Institution = "school" | "institute";

type Programme = {
  id: string;
  title: string;
  slug: string;
  institution: Institution;
  intake: string[];
};

type ApplicationForm = {
  full_name: string;
  phone: string;
  email: string;
  programme: string;
  qualification: string;
  preferred_intake: string;
  message: string;
};

// --------------------------------------------------
// HARDCODED INTERNATIONAL SCHOOL PROGRAMMES
// --------------------------------------------------

const schoolProgrammes: Programme[] = [
  {
    id: "school-kindergarten",
    title: "Kindergarten / Early Years",
    slug: "kindergarten",
    institution: "school",
    intake: [],
  },
  {
    id: "school-primary",
    title: "Primary School (Years 1–6)",
    slug: "primary-school",
    institution: "school",
    intake: [],
  },
  {
    id: "school-lower-secondary",
    title: "Lower Secondary (Years 7–9)",
    slug: "lower-secondary",
    institution: "school",
    intake: [],
  },
  {
    id: "school-igcse",
    title: "IGCSE (Years 10–11)",
    slug: "igcse",
    institution: "school",
    intake: [],
  },
];

// --------------------------------------------------
// INITIAL FORM VALUES
// --------------------------------------------------

const initialForm: ApplicationForm = {
  full_name: "",
  phone: "",
  email: "",
  programme: "",
  qualification: "",
  preferred_intake: "",
  message: "",
};

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-[#101A44] outline-none transition focus:border-[#542080] focus:ring-2 focus:ring-purple-100";

// --------------------------------------------------
// ERROR HELPER
// --------------------------------------------------

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;

    if (typeof message === "string") {
      return message;
    }
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unexpected error occurred. Please try again.";
}

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

export default function Application() {
  const [searchParams] = useSearchParams();

  const requestedProgramme = searchParams.get("programme");

  const [institution, setInstitution] = useState<Institution>("school");

  const [instituteProgrammes, setInstituteProgrammes] = useState<Programme[]>(
    [],
  );

  const [loadingProgrammes, setLoadingProgrammes] = useState(true);

  const [programmeError, setProgrammeError] = useState("");

  const [form, setForm] = useState<ApplicationForm>(initialForm);

  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState(false);

  const [submitError, setSubmitError] = useState("");

  // --------------------------------------------------
  // LOAD ONLY INSTITUTE PROGRAMMES FROM SUPABASE
  // --------------------------------------------------

  useEffect(() => {
    let active = true;

    async function fetchInstituteProgrammes() {
      setLoadingProgrammes(true);
      setProgrammeError("");

      try {
        const { data, error } = await supabase
          .from("programmes")
          .select("id,title,slug,institution,intake")
          .eq("institution", "institute")
          .eq("status", "published")
          .order("title", { ascending: true });

        if (error) {
          throw error;
        }

        if (!active) {
          return;
        }

        const programmes: Programme[] = (data ?? []).map((item) => ({
          id: String(item.id),
          title: item.title,
          slug: item.slug,
          institution: "institute" as const,
          intake: Array.isArray(item.intake)
            ? item.intake.filter(
                (value): value is string => typeof value === "string",
              )
            : [],
        }));

        setInstituteProgrammes(programmes);
      } catch (error: unknown) {
        console.error("INSTITUTE PROGRAMME LOADING ERROR:", error);

        if (active) {
          setProgrammeError(getErrorMessage(error));
        }
      } finally {
        if (active) {
          setLoadingProgrammes(false);
        }
      }
    }

    void fetchInstituteProgrammes();

    return () => {
      active = false;
    };
  }, []);

  // --------------------------------------------------
  // COMBINE SCHOOL + INSTITUTE PROGRAMMES
  // --------------------------------------------------

  const allProgrammes = useMemo(
    () => [...schoolProgrammes, ...instituteProgrammes],
    [instituteProgrammes],
  );

  // --------------------------------------------------
  // AUTO SELECT PROGRAMME FROM URL
  // --------------------------------------------------

  useEffect(() => {
    if (!requestedProgramme || loadingProgrammes) {
      return;
    }

    const requested = requestedProgramme.trim().toLowerCase();

    const selected = allProgrammes.find(
      (item) =>
        item.slug.toLowerCase() === requested ||
        item.id.toLowerCase() === requested ||
        item.title.toLowerCase() === requested,
    );

    if (!selected) {
      return;
    }

    setInstitution(selected.institution);

    setForm((previous) => ({
      ...previous,
      programme: selected.title,
      preferred_intake: "",
    }));
  }, [requestedProgramme, allProgrammes, loadingProgrammes]);

  // --------------------------------------------------
  // FILTER BY INSTITUTION
  // --------------------------------------------------

  const availableProgrammes = useMemo(() => {
    if (institution === "school") {
      return schoolProgrammes;
    }

    return instituteProgrammes;
  }, [institution, instituteProgrammes]);

  const selectedProgramme = useMemo(
    () => availableProgrammes.find((item) => item.title === form.programme),
    [availableProgrammes, form.programme],
  );

  const intakeOptions = useMemo(
    () =>
      (selectedProgramme?.intake ?? []).filter(
        (value) => value.trim().length > 0,
      ),
    [selectedProgramme],
  );

  // --------------------------------------------------
  // CHANGE INSTITUTION
  // --------------------------------------------------

  function changeInstitution(value: Institution) {
    if (saving) {
      return;
    }

    setInstitution(value);
    setSuccess(false);
    setSubmitError("");

    setForm((previous) => ({
      ...previous,
      programme: "",
      preferred_intake: "",
    }));
  }

  // --------------------------------------------------
  // HANDLE INPUT CHANGES
  // --------------------------------------------------

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target;

    setSubmitError("");

    setForm((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "programme" ? { preferred_intake: "" } : {}),
    }));
  }

  // --------------------------------------------------
  // SUBMIT APPLICATION
  // --------------------------------------------------

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving || success) {
      return;
    }

    setSubmitError("");

    if (!selectedProgramme) {
      setSubmitError("Please select a valid programme.");
      return;
    }

    if (!form.full_name.trim() || !form.phone.trim()) {
      setSubmitError("Please provide your full name and phone number.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        programme: selectedProgramme.title,
        qualification: form.qualification.trim() || null,
        preferred_intake: form.preferred_intake.trim() || null,
        message: form.message.trim() || null,
      };

      const { error } = await supabase.from("applications").insert(payload);

      if (error) {
        throw error;
      }

      setSuccess(true);
      setForm(initialForm);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error: unknown) {
      console.error("APPLICATION SUBMISSION ERROR:", error);

      setSubmitError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <>
      <PageHeader
        title="Online Application"
        subtitle="Begin your learning journey with Innovar International School or Innovar Institute."
      />

      <section className="bg-[#F8F9FE] px-5 py-16 sm:px-8 lg:px-16 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#542080]">
              Aspire. Actualize. Inspire.
            </p>

            <h1 className="text-3xl font-extrabold text-[#101A44] sm:text-4xl">
              Application Form
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              Select your preferred institution and programme, then provide your
              details to submit an application.
            </p>
          </div>

          {/* SUCCESS MESSAGE */}

          {success && (
            <div
              role="status"
              className="mb-8 rounded-2xl border border-green-200 bg-green-50 p-6"
            >
              <div className="flex items-start gap-4">
                <CheckCircle2 size={28} className="shrink-0 text-green-700" />

                <div>
                  <h2 className="text-lg font-extrabold text-green-800">
                    Application Successfully Submitted
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-green-700">
                    Thank you for applying to Innovar. Your application has been
                    received for review.
                  </p>

                  <Link
                    to="/programmes"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-green-800 hover:underline"
                  >
                    Explore Programmes
                    <ArrowRight size={16} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setSuccess(false);
                      setSubmitError("");
                    }}
                    className="ml-5 mt-4 text-sm font-bold text-green-800 underline"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg"
          >
            {/* STEP 1 - INSTITUTION */}

            <div className="border-b border-slate-100 p-6 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-wider text-[#542080]">
                Step 01
              </p>

              <h2 className="mt-2 mb-6 text-xl font-extrabold text-[#101A44]">
                Choose Your Institution
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => changeInstitution("school")}
                  disabled={saving}
                  aria-pressed={institution === "school"}
                  className={`flex items-center gap-4 rounded-xl border-2 p-5 text-left transition ${
                    institution === "school"
                      ? "border-[#542080] bg-purple-50"
                      : "border-slate-200 hover:border-purple-200"
                  }`}
                >
                  <GraduationCap
                    size={29}
                    className="shrink-0 text-[#542080]"
                  />

                  <div>
                    <p className="font-extrabold text-[#101A44]">
                      Innovar International School
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      School academic pathways
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => changeInstitution("institute")}
                  disabled={saving}
                  aria-pressed={institution === "institute"}
                  className={`flex items-center gap-4 rounded-xl border-2 p-5 text-left transition ${
                    institution === "institute"
                      ? "border-[#542080] bg-purple-50"
                      : "border-slate-200 hover:border-purple-200"
                  }`}
                >
                  <BookOpen size={29} className="shrink-0 text-[#542080]" />

                  <div>
                    <p className="font-extrabold text-[#101A44]">
                      Innovar Institute
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Technical and professional skills
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* STEP 2 - APPLICANT INFORMATION */}

            <div className="p-6 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-wider text-[#542080]">
                Step 02
              </p>

              <h2 className="mt-2 mb-7 text-xl font-extrabold text-[#101A44]">
                Applicant Information
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  label="Full Name"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Enter applicant's full name"
                  autoComplete="name"
                  maxLength={150}
                  required
                />

                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g. 07XX XXX XXX"
                  autoComplete="tel"
                  maxLength={30}
                  required
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  autoComplete="email"
                  maxLength={254}
                />

                {/* PROGRAMME */}

                <div>
                  <label
                    htmlFor="application-programme"
                    className="mb-2 block text-sm font-bold text-[#101A44]"
                  >
                    Programme Applying For
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <select
                    id="application-programme"
                    name="programme"
                    value={form.programme}
                    onChange={handleChange}
                    required
                    disabled={
                      saving ||
                      (institution === "institute" && loadingProgrammes)
                    }
                    className={fieldClass}
                  >
                    <option value="">
                      {institution === "institute" && loadingProgrammes
                        ? "Loading Institute programmes..."
                        : "Select Programme"}
                    </option>

                    {availableProgrammes.map((programme) => (
                      <option key={programme.id} value={programme.title}>
                        {programme.title}
                      </option>
                    ))}
                  </select>

                  {institution === "institute" && programmeError && (
                    <p role="alert" className="mt-2 text-xs text-red-600">
                      {programmeError}
                    </p>
                  )}

                  {institution === "institute" &&
                    !loadingProgrammes &&
                    !programmeError &&
                    availableProgrammes.length === 0 && (
                      <p className="mt-2 text-xs text-slate-500">
                        No published Institute programmes are currently
                        available.
                      </p>
                    )}
                </div>

                <Input
                  label="Previous Qualification / Education Level"
                  name="qualification"
                  value={form.qualification}
                  onChange={handleChange}
                  placeholder="Enter previous education or qualification"
                  maxLength={200}
                />

                {/* INTAKE */}

                <div>
                  <label
                    htmlFor="application-intake"
                    className="mb-2 block text-sm font-bold text-[#101A44]"
                  >
                    Preferred Intake
                  </label>

                  {intakeOptions.length > 0 ? (
                    <select
                      id="application-intake"
                      name="preferred_intake"
                      value={form.preferred_intake}
                      onChange={handleChange}
                      disabled={saving}
                      className={fieldClass}
                    >
                      <option value="">Select Preferred Intake</option>

                      {intakeOptions.map((intake) => (
                        <option key={intake} value={intake}>
                          {intake}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id="application-intake"
                      name="preferred_intake"
                      value={form.preferred_intake}
                      onChange={handleChange}
                      disabled={saving}
                      placeholder="Enter preferred intake (if known)"
                      className={fieldClass}
                    />
                  )}
                </div>
              </div>

              {/* ADDITIONAL INFORMATION */}

              <div className="mt-6">
                <label
                  htmlFor="application-message"
                  className="mb-2 block text-sm font-bold text-[#101A44]"
                >
                  Additional Information
                </label>

                <textarea
                  id="application-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  maxLength={5000}
                  placeholder="Provide any additional information relevant to your application..."
                  className={`${fieldClass} resize-y`}
                />
              </div>

              {/* SUBMISSION ERROR */}

              {submitError && (
                <div
                  role="alert"
                  className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5"
                >
                  <p className="text-sm font-bold text-red-800">
                    Application Submission Failed
                  </p>

                  <p className="mt-2 break-words text-sm text-red-700">
                    {submitError}
                  </p>
                </div>
              )}

              <p className="mt-7 text-xs leading-6 text-slate-500">
                By submitting this form, you provide your information to Innovar
                for processing your application and contacting you about
                admissions.
              </p>

              <button
                type="submit"
                disabled={saving || success || availableProgrammes.length === 0}
                className={`mt-6 flex w-full items-center justify-center gap-3 rounded-xl px-7 py-4 text-sm font-extrabold transition ${
                  success
                    ? "bg-green-600 text-white"
                    : "bg-[#542080] text-white hover:bg-[#401663]"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {saving ? (
                  <>
                    <Loader2 size={19} className="animate-spin" />
                    Submitting Application...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 size={19} />
                    Application Submitted
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

// --------------------------------------------------
// REUSABLE INPUT COMPONENT
// --------------------------------------------------

function Input({
  label,
  name,
  required,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
}) {
  return (
    <div>
      <label
        htmlFor={`application-${name}`}
        className="mb-2 block text-sm font-bold text-[#101A44]"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        {...props}
        id={`application-${name}`}
        name={name}
        required={required}
        className={fieldClass}
      />
    </div>
  );
}
