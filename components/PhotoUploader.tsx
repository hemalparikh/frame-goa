"use client";

import { useRef, useState } from "react";
import {
  Camera,
  ImagePlus,
  UploadCloud,
  X,
  RefreshCw,
  MoveHorizontal,
  MoveVertical,
  ZoomIn,
  RotateCcw,
} from "lucide-react";
import { normalizeImage } from "@/lib/imageProcessor";

export type PhotoAdjustment = {
  x: number;
  y: number;
  scale: number;
};

export type PhotoValue = {
  dataUrl: string;
  name: string;
  width: number;
  height: number;
  adjustment: PhotoAdjustment;
};

const DEFAULT_ADJUSTMENT: PhotoAdjustment = {
  x: 0,
  y: 0,
  scale: 1,
};

const FRAME_WIDTH = 928;
const FRAME_HEIGHT = 560;

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
        adjustment: { ...DEFAULT_ADJUSTMENT },
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

  function updateAdjustment(
    key: keyof PhotoAdjustment,
    value: number
  ) {
    if (!value) return;

    const current = valueFromPhoto();

    const next: PhotoAdjustment = {
      ...current,
      [key]: value,
    };

    onChange({
      ...value!,
      adjustment: next,
    });
  }

  function valueFromPhoto(): PhotoAdjustment {
    return value?.adjustment ?? DEFAULT_ADJUSTMENT;
  }

  function changeX(amount: number) {
    if (!value) return;

    const current = value.adjustment ?? DEFAULT_ADJUSTMENT;

    const next = {
      ...current,
      x: Math.max(-100, Math.min(100, current.x + amount)),
    };

    onChange({
      ...value,
      adjustment: next,
    });
  }

  function changeY(amount: number) {
    if (!value) return;

    const current = value.adjustment ?? DEFAULT_ADJUSTMENT;

    const next = {
      ...current,
      y: Math.max(-100, Math.min(100, current.y + amount)),
    };

    onChange({
      ...value,
      adjustment: next,
    });
  }

  function changeScale(amount: number) {
    if (!value) return;

    const current = value.adjustment ?? DEFAULT_ADJUSTMENT;

    const next = {
      ...current,
      scale: Math.max(1, Math.min(3, current.scale + amount)),
    };

    onChange({
      ...value,
      adjustment: next,
    });
  }

  function resetAdjustment() {
    if (!value) return;

    onChange({
      ...value,
      adjustment: { ...DEFAULT_ADJUSTMENT },
    });
  }

  function moveByDragging(
    event: React.PointerEvent<HTMLDivElement>
  ) {
    if (!value || busy) return;

    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();

    const startX = event.clientX;
    const startY = event.clientY;

    const original = value.adjustment ?? DEFAULT_ADJUSTMENT;

    target.setPointerCapture(event.pointerId);

    function move(pointerEvent: PointerEvent) {
      const deltaX =
        ((pointerEvent.clientX - startX) / rect.width) * 200;

      const deltaY =
        ((pointerEvent.clientY - startY) / rect.height) * 200;

      const next: PhotoAdjustment = {
        ...original,
        x: Math.max(-100, Math.min(100, original.x + deltaX)),
        y: Math.max(-100, Math.min(100, original.y + deltaY)),
      };

      onChange({
        ...value!,
        adjustment: next,
      });
    }

    function stop() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  }

  const adjustment = value?.adjustment ?? DEFAULT_ADJUSTMENT;

  /*
   * Calculate a reasonable preview scale.
   * The actual PNG generator uses the same adjustment values.
   */
  const previewScale = Math.max(
    1,
    adjustment.scale *
      Math.max(
        FRAME_WIDTH / Math.max(value?.width ?? FRAME_WIDTH, 1),
        FRAME_HEIGHT / Math.max(value?.height ?? FRAME_HEIGHT, 1)
      )
  );

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
        {/* CAMERA INPUT */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/jpeg,image/png,image/heic,image/heif,.jpg,.jpeg,.png,.heic,.heif"
          capture="environment"
          className="sr-only"
          onChange={(e) => void handle(e.target.files?.[0])}
        />

        {/* GALLERY INPUT */}
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/jpeg,image/png,image/heic,image/heif,.jpg,.jpeg,.png,.heic,.heif"
          className="sr-only"
          onChange={(e) => void handle(e.target.files?.[0])}
        />

        {value ? (
          <>
            {/* PHOTO EDITOR */}
            <div
              onPointerDown={moveByDragging}
              className="relative mx-auto aspect-[928/560] w-full max-w-[928px] touch-none cursor-grab select-none overflow-hidden rounded-[1.4rem] bg-[var(--green)] active:cursor-grabbing"
            >
              <img
                src={value.dataUrl}
                alt="Adjustable builder portrait"
                draggable={false}
                className="absolute left-1/2 top-1/2 max-w-none"
                style={{
                  width: `${Math.max(
                    100,
                    previewScale * 100
                  )}%`,
                  height: `${Math.max(
                    100,
                    previewScale * 100
                  )}%`,
                  transform: `
                    translate(
                      calc(-50% + ${adjustment.x}%),
                      calc(-50% + ${adjustment.y}%)
                    )
                  `,
                  objectFit: "cover",
                }}
              />

              {/* FRAME BORDER */}
              <div className="pointer-events-none absolute inset-0 rounded-[1.4rem] border-4 border-[var(--green)]" />

              {/* CENTER GUIDE */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full border-2 border-white/70" />
              </div>

              {/* DRAG LABEL */}
              <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-[10px] font-black tracking-[.15em] text-white backdrop-blur">
                DRAG PHOTO TO POSITION
              </div>

              {/* REMOVE */}
              <button
                type="button"
                aria-label="Remove photo"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
                className="absolute right-3 top-3 rounded-xl bg-black/70 p-2 text-white backdrop-blur transition hover:bg-black"
              >
                <X size={17} />
              </button>
            </div>

            {/* CONTROLS */}
            <div className="mt-5 rounded-[1.5rem] border-2 border-black/10 bg-white/70 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-black text-[var(--green)]">
                    ADJUST YOUR PHOTO
                  </div>

                  <div className="mt-1 text-xs font-bold text-black/45">
                    Drag the photo or use the controls
                  </div>
                </div>

                <button
                  type="button"
                  onClick={resetAdjustment}
                  className="flex items-center gap-1.5 rounded-xl border-2 border-black px-3 py-2 text-xs font-black hover:bg-black hover:text-white"
                >
                  <RotateCcw size={14} />
                  RESET
                </button>
              </div>

              {/* LEFT / RIGHT */}
              <div className="mb-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black/50">
                  <MoveHorizontal size={15} />
                  Left / Right
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => changeX(-5)}
                    className="control-button"
                  >
                    ← MOVE LEFT
                  </button>

                  <button
                    type="button"
                    onClick={() => changeX(5)}
                    className="control-button"
                  >
                    MOVE RIGHT →
                  </button>
                </div>
              </div>

              {/* UP / DOWN */}
              <div className="mb-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black/50">
                  <MoveVertical size={15} />
                  Up / Down
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => changeY(-5)}
                    className="control-button"
                  >
                    ↑ MOVE UP
                  </button>

                  <button
                    type="button"
                    onClick={() => changeY(5)}
                    className="control-button"
                  >
                    ↓ MOVE DOWN
                  </button>
                </div>
              </div>

              {/* ZOOM */}
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black/50">
                  <ZoomIn size={15} />
                  Zoom
                  <span className="ml-auto text-[var(--pink)]">
                    {Math.round(adjustment.scale * 100)}%
                  </span>
                </div>

                <div className="grid grid-cols-[1fr_2fr_1fr] items-center gap-2">
                  <button
                    type="button"
                    onClick={() => changeScale(-0.1)}
                    className="control-button text-xl"
                  >
                    −
                  </button>

                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={adjustment.scale}
                    onChange={(e) =>
                      changeScale(
                        Number(e.target.value) - adjustment.scale
                      )
                    }
                    aria-label="Photo zoom"
                    className="w-full accent-[var(--pink)]"
                  />

                  <button
                    type="button"
                    onClick={() => changeScale(0.1)}
                    className="control-button text-xl"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* FILE NAME */}
            <div className="mt-3 truncate text-center text-xs font-bold text-black/45">
              {value.name}
            </div>
          </>
        ) : (
          /* EMPTY STATE */
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

            <div className="mt-6 grid w-full max-w-sm grid-cols-2 gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--green)] px-4 py-4 font-black text-[var(--cream)] transition hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-50"
              >
                <Camera size={20} />
                CAMERA
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={() => galleryInputRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--pink)] px-4 py-4 font-black text-white transition hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-50"
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
