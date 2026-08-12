"use client";

import { useRef, useState } from "react";
import { Camera, ImagePlus, UploadCloud, X, RefreshCw } from "lucide-react";
import { normalizeImage } from "@/lib/imageProcessor";

type PhotoValue = {
  dataUrl: string;
  name: string;
  width: number;
  height: number;
};

export function PhotoUploader({
  value,
  onChange,
  error,
}: {
  value: PhotoValue | null;
  onChange: (v: PhotoValue | null) => void;
  error?: string;
}) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState("");

  async function handle(file?: File) {
    if (!file) return;

    setBusy(true);
    setLocalError("");

    try {
      const result = await normalizeImage(file);
      onChange({
        ...result,
        name: file.name,
      });
    } catch (e) {
      setLocalError(
        e instanceof Error
          ? e.message
          : "That photo couldn’t be processed. Try another image."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="mb-3 block text-xs font-black uppercase tracking-[.18em] text-black/55">
        01 / Your photo
      </label>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void handle(e.dataTransfer.files[0]);
        }}
        className={`relative overflow-hidden rounded-[2rem] border-2 border-dashed border-[var(--green)] bg-white/60 p-4 transition ${
          busy
            ? "cursor-wait opacity-70"
            : "hover:-translate-y-0.5 hover:bg-white"
        }`}
      >
        {/* Camera input */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/jpeg,image/png,image/heic,image/heif,.jpg,.jpeg,.png,.heic,.heif"
          capture="environment"
          className="sr-only"
          onChange={(e) => void handle(e.target.files?.[0])}
        />

        {/* Gallery input */}
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/jpeg,image/png,image/heic,image/heif,.jpg,.jpeg,.png,.heic,.heif"
          className="sr-only"
          onChange={(e) => void handle(e.target.files?.[0])}
        />

        {value ? (
          <div className="relative overflow-hidden rounded-[1.4rem] bg-[var(--green)]">
            <img
              src={value.dataUrl}
              alt="Selected builder portrait"
              className="h-72 w-full object-cover sm:h-96"
            />

            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 rounded-2xl bg-black/75 p-2 text-white backdrop-blur">
              <span className="min-w-0 truncate px-2 text-xs font-bold">
                {value.name}
              </span>

              <button
                type="button"
                aria-label="Remove photo"
                onClick={() => onChange(null)}
                className="rounded-xl bg-white/15 p-2 hover:bg-white/25"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-[1.4rem] bg-[var(--cream)] px-6 text-center sm:min-h-96">
            <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-[var(--yellow)] text-[var(--green)]">
              <UploadCloud size={30} />
            </div>

            <div className="font-display text-3xl font-black text-[var(--green)]">
              ADD YOUR PHOTO
            </div>

            <div className="mt-2 text-sm font-bold text-black/50">
              Choose how you want to add it
            </div>

            {/* Camera + Gallery buttons */}
            <div className="mt-6 grid w-full max-w-sm grid-cols-2 gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--green)] px-4 py-4 font-black text-[var(--cream)] transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Camera size={20} />
                CAMERA
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={() => galleryInputRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--pink)] px-4 py-4 font-black text-white transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ImagePlus size={20} />
                GALLERY
              </button>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-2 text-[10px] font-black uppercase tracking-wider text-black/40">
              <span>JPG</span>
              <span>PNG</span>
              <span>HEIC</span>
              <span>HEIF</span>
            </div>

            <div className="mt-3 text-xs font-bold text-black/40">
              Or drag & drop a photo here
            </div>
          </div>
        )}

        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-[var(--cream)]/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 rounded-full bg-[var(--green)] px-5 py-3 text-sm font-black text-white">
              <RefreshCw className="animate-spin" size={18} />
              PREPARING PHOTO
            </div>
          </div>
        )}
      </div>

      {(localError || error) && (
        <p
          role="alert"
          className="mt-2 text-sm font-bold text-[var(--pink)]"
        >
          {localError || error}
        </p>
      )}
    </div>
  );
}
