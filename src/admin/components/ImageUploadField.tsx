
import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import {
  ImagePlus,
  Loader2,
  Trash2,
  UploadCloud,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { supabase } from "../../services/supabase";

interface Props {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

const BUCKET = "innovar-images";
const MAX_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export default function ImageUploadField({
  value,
  onChange,
  folder = "programmes",
  label = "Upload Image",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function upload(file: File) {
    setError("");
    setSuccess("");

    const extension = ALLOWED_TYPES[file.type];

    if (!extension) {
      setError("Please select a JPG, PNG or WEBP image.");
      return;
    }

    if (file.size > MAX_SIZE) {
      setError("Image size must not exceed 5 MB.");
      return;
    }

    if (file.size === 0) {
      setError("The selected image is empty.");
      return;
    }

    setUploading(true);

    try {
      const safeFolder =
        folder
          .split("/")
          .filter((part) => /^[a-zA-Z0-9_-]+$/.test(part))
          .join("/") || "general";

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

      onChange(data.publicUrl);
      setSuccess("Image uploaded successfully.");
    } catch (err) {
      console.error("Image upload failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload image. Please try again."
      );
    } finally {
      setUploading(false);
    }
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      void upload(file);
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
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={handleFile}
        disabled={uploading}
        aria-label={label}
      />

      {value ? (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <img
              src={value}
              alt="Selected upload preview"
              className="h-64 w-full object-cover"
            />

            <button
              type="button"
              disabled={uploading}
              onClick={() => {
                onChange("");
                setSuccess("");
                setError("");
              }}
              aria-label="Remove selected image"
              title="Remove image from this form"
              className="absolute right-3 top-3 rounded-full bg-red-600 p-2.5 text-white shadow-lg hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <button
            type="button"
            onClick={openPicker}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#542080] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#3C1461] disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <ImagePlus size={18} />
            )}
            {uploading ? "Uploading..." : "Replace Image"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          disabled={uploading}
          className="flex min-h-64 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-[#F8F9FE] p-6 text-center transition hover:border-[#542080] hover:bg-purple-50 disabled:cursor-wait"
        >
          {uploading ? (
            <>
              <Loader2
                size={42}
                className="mb-4 animate-spin text-[#542080]"
              />

              <p className="font-bold text-[#101A44]">
                Uploading image...
              </p>
            </>
          ) : (
            <>
              <UploadCloud
                size={44}
                className="mb-4 text-[#542080]"
              />

              <p className="font-bold text-[#101A44]">
                Click to upload an image
              </p>

              <p className="mt-2 text-sm text-slate-500">
                JPG, PNG or WEBP — maximum 5 MB
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
        Uploads are stored in Innovar's media library.
        Removing an image here clears the form field;
        it does not delete the stored file.
      </p>
    </div>
  );
}
