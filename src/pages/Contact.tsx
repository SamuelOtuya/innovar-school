import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Laptop,
  LoaderCircle,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

import PageHeader from "../components/common/PageHeader";
import { supabase } from "../services/supabase";

/*
 * Update these contact details when the institution
 * confirms its permanent contact information.
 */
const CONTACT = {
  phones: [
    { label: "0720 658 818", value: "+254720658818" },
    { label: "0101 400 530", value: "+254101400530" },
    { label: "0795 636 384", value: "+254795636384" },
  ],
  email: "info@innovar.com",
  whatsapp: "254720658818",
  location: "Kisumu–Kakamega Highway, Kakamega, Kenya",
};

const mapQuery = encodeURIComponent(
  "Innovar International School Kakamega Kenya",
);

const mapEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

const whatsappUrl = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
  "Hello Innovar, I would like to enquire about your programmes and admissions.",
)}`;

type Institution = "" | "school" | "institute" | "general";

type ContactForm = {
  full_name: string;
  email: string;
  phone: string;
  institution: Institution;
  inquiry_type: string;
  message: string;
};

const initialForm: ContactForm = {
  full_name: "",
  email: "",
  phone: "",
  institution: "",
  inquiry_type: "",
  message: "",
};

const inquiryOptions: Record<
  Exclude<Institution, "">,
  { value: string; label: string }[]
> = {
  school: [
    {
      value: "School Admissions",
      label: "School Admissions",
    },
    {
      value: "School Academics",
      label: "Academic Programmes",
    },
    {
      value: "School Day and Boarding",
      label: "Day & Boarding",
    },
    {
      value: "School Fees",
      label: "School Fees",
    },
    {
      value: "School General Enquiry",
      label: "Other School Enquiry",
    },
  ],
  institute: [
    {
      value: "Institute Admissions",
      label: "Institute Admissions",
    },
    {
      value: "Institute Courses",
      label: "Training Programmes",
    },
    {
      value: "Institute Fees",
      label: "Institute Fees",
    },
    {
      value: "Institute General Enquiry",
      label: "Other Institute Enquiry",
    },
  ],
  general: [
    {
      value: "General Inquiry",
      label: "General Enquiry",
    },
    {
      value: "Partnerships",
      label: "Partnerships",
    },
    {
      value: "Other Inquiry",
      label: "Other Enquiry",
    },
  ],
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-[#101A44] outline-none transition-colors placeholder:text-slate-400 focus:border-[#542080] focus:ring-2 focus:ring-[#542080]/10";

export default function Contact() {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "institution" ? { inquiry_type: "" } : {}),
    }));

    setErrorMessage("");
    setSuccess(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    if (!form.full_name.trim() || !form.message.trim()) {
      setErrorMessage("Please complete the required fields.");
      return;
    }

    if (!form.email.trim() && !form.phone.trim()) {
      setErrorMessage(
        "Please provide either an email address or phone number.",
      );
      return;
    }

    if (!form.institution || !form.inquiry_type) {
      setErrorMessage("Please select an institution and enquiry type.");
      return;
    }

    setSaving(true);
    setSuccess(false);
    setErrorMessage("");

    try {
      /*
       * The institution selection is encoded into
       * inquiry_type. No database migration is needed.
       *
       * Never insert the institution field unless
       * contact_messages has that column.
       */
      const { error } = await supabase.from("contact_messages").insert({
        full_name: form.full_name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        inquiry_type: form.inquiry_type,
        message: form.message.trim(),
      });

      if (error) throw error;

      if (!mounted.current) return;

      setSuccess(true);
      setForm(initialForm);
    } catch (error) {
      console.error("Contact form submission failed:", error);

      if (!mounted.current) return;

      setErrorMessage(
        "We couldn't submit your message right now. Please try again or contact us directly.",
      );
    } finally {
      if (mounted.current) setSaving(false);
    }
  }

  const availableInquiryOptions = form.institution
    ? inquiryOptions[form.institution]
    : [];

  return (
    <>
      <PageHeader
        title="Contact Us"
        subtitle="Get in touch with Innovar International School and Innovar Institute for admissions, academic programmes and general enquiries."
      />

      {/* Contact details */}
      <section className="bg-white px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
              Get in Touch
            </p>

            <h2 className="text-3xl font-extrabold text-[#101A44] sm:text-4xl">
              We'd Love to Hear
              <span className="text-[#542080]"> From You</span>
            </h2>

            <div className="mx-auto my-5 h-1 w-14 rounded-full bg-[#F5BE20]" />

            <p className="text-sm leading-8 text-slate-600 sm:text-base">
              Whether you are interested in school admissions, institute
              training, or general information, our team is here to assist.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Phone */}
            <ContactCard icon={<Phone size={27} />} title="Call Us">
              <div className="space-y-2">
                {CONTACT.phones.map((phone) => (
                  <a
                    key={phone.value}
                    href={`tel:${phone.value}`}
                    className="block text-sm font-semibold text-slate-600 hover:text-[#542080]"
                  >
                    {phone.label}
                  </a>
                ))}
              </div>
            </ContactCard>

            {/* Email */}
            <ContactCard icon={<Mail size={27} />} title="Email Us">
              <a
                href={`mailto:${CONTACT.email}`}
                className="break-all text-sm font-semibold text-slate-600 hover:text-[#542080]"
              >
                {CONTACT.email}
              </a>

              <p className="mt-4 text-xs leading-6 text-slate-500">
                Send us your questions or programme enquiries.
              </p>
            </ContactCard>

            {/* WhatsApp */}
            <ContactCard icon={<MessageCircle size={27} />} title="WhatsApp">
              <p className="mb-5 text-sm leading-7 text-slate-600">
                Start a conversation with our team.
              </p>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#542080] hover:text-[#B8860B]"
              >
                Chat With Us
                <ExternalLink size={15} />
              </a>
            </ContactCard>

            {/* Location */}
            <ContactCard icon={<MapPin size={27} />} title="Visit Us">
              <p className="text-sm leading-7 text-slate-600">
                {CONTACT.location}
              </p>
            </ContactCard>
          </div>
        </div>
      </section>

      {/* Contact form and map */}
      <section className="bg-[#F8F9FE] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-2">
          {/* Form */}
          <div className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm sm:p-10">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#542080]">
              Send Us a Message
            </p>

            <h2 className="mb-4 text-3xl font-extrabold text-[#101A44]">
              Make an Enquiry
            </h2>

            <div className="mb-6 h-1 w-14 rounded-full bg-[#F5BE20]" />

            <p className="mb-8 text-sm leading-7 text-slate-600">
              Complete the form below and our team will review your enquiry.
            </p>

            {success && (
              <div
                role="status"
                className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-5"
              >
                <CheckCircle2
                  size={23}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />

                <div>
                  <h3 className="font-bold text-emerald-800">
                    Message Submitted Successfully
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-emerald-700">
                    Thank you for contacting Innovar. Your enquiry has been
                    received and is awaiting review.
                  </p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <FormField label="Full Name" htmlFor="full_name" required>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={form.full_name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  maxLength={150}
                  required
                />
              </FormField>

              {/* Contact information */}
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Email Address" htmlFor="email">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Your email"
                    autoComplete="email"
                    maxLength={254}
                  />
                </FormField>

                <FormField label="Phone Number" htmlFor="phone">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. 07XXXXXXXX"
                    autoComplete="tel"
                    maxLength={30}
                  />
                </FormField>
              </div>

              <p className="text-xs text-slate-500">
                Provide at least one contact method: email or phone.
              </p>

              {/* Institution */}
              <FormField label="Enquiry For" htmlFor="institution" required>
                <select
                  id="institution"
                  name="institution"
                  value={form.institution}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Select institution</option>

                  <option value="school">Innovar International School</option>

                  <option value="institute">Innovar Institute</option>

                  <option value="general">General Enquiry</option>
                </select>
              </FormField>

              {/* Enquiry category */}
              <FormField label="Enquiry Type" htmlFor="inquiry_type" required>
                <select
                  id="inquiry_type"
                  name="inquiry_type"
                  value={form.inquiry_type}
                  onChange={handleChange}
                  className={inputClass}
                  disabled={!form.institution}
                  required
                >
                  <option value="">
                    {form.institution
                      ? "Select enquiry type"
                      : "Select institution first"}
                  </option>

                  {availableInquiryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormField>

              {/* Message */}
              <FormField label="Your Message" htmlFor="message" required>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  className={`${inputClass} resize-y`}
                  placeholder="Tell us how we can help..."
                  maxLength={5000}
                  required
                />
              </FormField>

              {/* Submit */}
              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#542080] px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-[#3C1461] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <LoaderCircle size={19} className="animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={18} />
                  </>
                )}
              </button>

              <p className="text-center text-xs leading-6 text-slate-500">
                Your details will be used to respond to your enquiry.
              </p>
            </form>
          </div>

          {/* Map and support */}
          <div className="flex flex-col gap-7">
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <iframe
                title="Innovar International School Kakamega area map"
                src={mapEmbedUrl}
                className="h-[380px] w-full border-0"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />

              <div className="p-7">
                <div className="flex items-start gap-3">
                  <MapPin size={22} className="mt-1 shrink-0 text-[#542080]" />

                  <div>
                    <h3 className="mb-2 text-lg font-extrabold text-[#101A44]">
                      Visit Innovar
                    </h3>

                    <p className="mb-4 text-sm leading-7 text-slate-600">
                      {CONTACT.location}
                    </p>

                    <a
                      href={mapSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#542080] hover:text-[#B8860B]"
                    >
                      Search on Google Maps
                      <ExternalLink size={16} />
                    </a>

                    <p className="mt-3 text-xs text-slate-500">
                      Confirm the exact campus pin before travelling.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="rounded-2xl bg-[#101A44] p-8 text-white sm:p-10">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#F5BE20]">
                Explore Innovar
              </p>

              <h3 className="mb-5 text-2xl font-extrabold">How Can We Help?</h3>

              <p className="mb-7 text-sm leading-8 text-white/75">
                Explore our educational opportunities and admissions
                information.
              </p>

              <div className="space-y-4">
                <QuickLink
                  to="/academics"
                  icon={<GraduationCap size={23} />}
                  label="International School"
                />

                <QuickLink
                  to="/institute"
                  icon={<Laptop size={23} />}
                  label="Innovar Institute"
                />

                <QuickLink
                  to="/admissions"
                  icon={<CheckCircle2 size={23} />}
                  label="Admissions Information"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#542080] px-5 py-16 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F5BE20]">
              Aspire. Actualize. Inspire.
            </p>

            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
              Ready to Begin Your Innovar Journey?
            </h2>

            <p className="mt-3 text-sm leading-7 text-white/75">
              Explore admissions and discover the next step in your education.
            </p>
          </div>

          <Link
            to="/admissions"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#F5BE20] px-7 py-4 text-sm font-bold text-[#092C80] transition-colors hover:bg-[#FFD34D]"
          >
            Explore Admissions
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}

function ContactCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-[#F8F9FE] p-7 transition-shadow hover:shadow-lg">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#F1EBFA] text-[#542080]">
        {icon}
      </div>

      <h3 className="mb-4 text-lg font-extrabold text-[#101A44]">{title}</h3>

      {children}
    </div>
  );
}

function FormField({
  label,
  htmlFor,
  required = false,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-semibold text-[#101A44]"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children}
    </div>
  );
}

function QuickLink({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
    >
      <div className="flex items-center gap-3">
        <span className="text-[#F5BE20]">{icon}</span>

        <span className="text-sm font-bold">{label}</span>
      </div>

      <ArrowRight size={17} />
    </Link>
  );
}
