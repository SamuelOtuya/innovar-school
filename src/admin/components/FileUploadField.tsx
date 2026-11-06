
import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FilePlus,
  FileText,
  Loader2,
  Trash2,
} from "lucide-react";

import { supabase } from "../../services/supabase";

type Props = {
  value: string;
  onChange: (url: string, file?: File) => void;
  folder?: string;
  label?: string;
};

const BUCKET = "innovar-documents";
const MAX_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
};

export default function FileUploadField({
  value,
  onChange,
  folder = "downloads",
  label = "Upload Document",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function uploadFile(file: File) {
    setError("");
    setSuccess("");

    const extension = ALLOWED_TYPES[file.type];

    if (!extension) {
      setError("Only PDF, DOC and DOCX documents are supported.");
      return;
    }

    if (file.size > MAX_SIZE) {
      setError("Document size must not exceed 5 MB.");
      return;
    }

    if (file.size === 0) {
      setError("The selected document is empty.");
      return;
    }

    setUploading(true);

    try {
      const safeFolder =
        folder
          .split("/")
          .filter((part) => /^[a-zA-Z0-9_-]+$/.test(part))
          .join("/") || "downloads";

      const fileName = `${crypto.randomUUID()}.${extension}`;
      const filePath = `${safeFolder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(filePath);

      onChange(data.publicUrl, file);
      setSuccess("Document uploaded successfully.");
    } catch (err) {
      console.error("Document upload failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload document. Please try again."
      );
    } finally {
      setUploading(false);
    }
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      void uploadFile(file);
    }

    event.target.value = "";
  }

  function openPicker() {
    if (!uploading) inputRef.current?.click();
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold text-[#101A44]">
        {label}
      </label>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleFile}
        disabled={uploading}
        aria-label={label}
      />

      {value ? (
        <div className="rounded-2xl border border-slate-200 bg-[#F8F9FE] p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-purple-100 p-3 text-[#542080]">
              <FileText size={25} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#101A44]">
                Selected Document
              </p>

              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block break-all text-xs text-[#542080] hover:underline"
              >
                View document
              </a>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openPicker}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-xl bg-[#542080] px-5 py-3 text-sm font-bold text-white hover:bg-[#3C1461] disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <FilePlus size={17} />
              )}

              {uploading ? "Uploading..." : "Replace File"}
            </button>

            <button
              type="button"
              onClick={() => {
                onChange("");
                setSuccess("");
                setError("");
              }}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-100 disabled:opacity-50"
            >
              <Trash2 size={17} />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          disabled={uploading}
          className="flex min-h-48 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-[#F8F9FE] p-6 text-center transition hover:border-[#542080] hover:bg-purple-50 disabled:cursor-wait"
        >
          {uploading ? (
            <>
              <Loader2
                size={38}
                className="mb-3 animate-spin text-[#542080]"
              />

              <p className="font-bold text-[#101A44]">
                Uploading document...
              </p>
            </>
          ) : (
            <>
              <FilePlus
                size={42}
                className="mb-3 text-[#542080]"
              />

              <p className="font-bold text-[#101A44]">
                Click to upload a document
              </p>

              <p className="mt-2 text-sm text-slate-500">
                PDF, DOC or DOCX — maximum 10 MB
              </p>
            </>
          )}
        </button>
      )}

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-center gap-2 text-sm text-green-700"
        >
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      <p className="text-xs text-slate-500">
        Documents are stored in Innovar's public
        document library. Removing a file here does
        not delete it from Supabase Storage.
      </p>
    </div>
  );
}
