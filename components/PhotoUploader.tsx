"use client";

import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

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

const ACCEPTED_TYPES =
  "image/jpeg,image/png,image/heic,image/heif,.jpg,.jpeg,.png,.heic,.heif";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function PhotoUploader({
  value,
  onChange,
  error,
}: {
  value: PhotoValue | null;
  onChange: (v: PhotoValue | null) => void;
  error?: string;
}) {
  const cameraInputRef =
    useRef<HTMLInputElement>(null);

  const galleryInputRef =
    useRef<HTMLInputElement>(null);

  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originalX: number;
    originalY: number;
    rectWidth: number;
    rectHeight: number;
  } | null>(null);

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
        adjustment: {
          ...DEFAULT_ADJUSTMENT,
        },
      });
    } catch (e) {
      setLocalError(
        e instanceof Error
          ? e.message
          : "That photo couldn’t be processed. Try another image."
      );
    } finally {
      setBusy(false);

      if (cameraInputRef.current) {
        cameraInputRef.current.value = "";
      }

      if (galleryInputRef.current) {
        galleryInputRef.current.value = "";
      }
    }
  }

  function updateAdjustment(
    next: Partial<PhotoAdjustment>
  ) {
    if (!value) return;

    const current =
      value.adjustment ?? DEFAULT_ADJUSTMENT;

    onChange({
      ...value,
      adjustment: {
        ...current,
        ...next,
      },
    });
  }

  function changeX(amount: number) {
    if (!value) return;

    const current =
      value.adjustment ?? DEFAULT_ADJUSTMENT;

    updateAdjustment({
      x: clamp(current.x + amount, -100, 100),
    });
  }

  function changeY(amount: number) {
    if (!value) return;

    const current =
      value.adjustment ?? DEFAULT_ADJUSTMENT;

    updateAdjustment({
      y: clamp(current.y + amount, -100, 100),
    });
  }

  function changeScale(amount: number) {
    if (!value) return;

    const current =
      value.adjustment ?? DEFAULT_ADJUSTMENT;

    updateAdjustment({
      scale: clamp(
        current.scale + amount,
        1,
        3
      ),
    });
  }

  function resetAdjustment() {
    if (!value) return;

    updateAdjustment({
      ...DEFAULT_ADJUSTMENT,
    });
  }

  function startDragging(
    event: ReactPointerEvent<HTMLDivElement>
  ) {
    if (!value || busy) return;

    const rect =
      event.currentTarget.getBoundingClientRect();

    const adjustment =
      value.adjustment ?? DEFAULT_ADJUSTMENT;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originalX: adjustment.x,
      originalY: adjustment.y,
      rectWidth: rect.width,
      rectHeight: rect.height,
    };

    event.currentTarget.setPointerCapture(
      event.pointerId
    );
  }

  function dragPhoto(
    event: ReactPointerEvent<HTMLDivElement>
  ) {
    const drag = dragRef.current;

    if (!drag || !value) return;

    const deltaX =
      ((event.clientX - drag.startX) /
        Math.max(drag.rectWidth, 1)) *
      200;

    const deltaY =
      ((event.clientY - drag.startY) /
        Math.max(drag.rectHeight, 1)) *
      200;

    updateAdjustment({
      x: clamp(
        drag.originalX + deltaX,
        -100,
        100
      ),
      y: clamp(
        drag.originalY + deltaY,
        -100,
        100
      ),
    });
  }

  function stopDragging() {
    dragRef.current = null;
  }

  const adjustment =
    value?.adjustment ?? DEFAULT_ADJUSTMENT;

  /*
   * Calculate the exact same crop geometry used
   * by cardGenerator.ts.
   */
  const imageRatio =
    value && value.width > 0 && value.height > 0
      ? value.width / value.height
      : FRAME_WIDTH / FRAME_HEIGHT;

  let baseWidth = FRAME_WIDTH;
  let baseHeight = FRAME_HEIGHT;

  if (
    imageRatio >
    FRAME_WIDTH / FRAME_HEIGHT
  ) {
    baseHeight = FRAME_HEIGHT;
    baseWidth = FRAME_HEIGHT * imageRatio;
  } else {
    baseWidth = FRAME_WIDTH;
    baseHeight = FRAME_WIDTH / imageRatio;
  }

  const previewWidth =
    baseWidth * adjustment.scale;

  const previewHeight =
    baseHeight * adjustment.scale;

  const extraX = Math.max(
    0,
    previewWidth - FRAME_WIDTH
  );

  const extraY = Math.max(
    0,
    previewHeight - FRAME_HEIGHT
  );

  const left =
    -extraX / 2 +
    (extraX / 2) *
      (adjustment.x / 100);

  const top =
    -extraY / 2 +
    (extraY / 2) *
      (adjustment.y / 100);

  const previewStyle = value
    ? {
        width: `${(previewWidth / FRAME_WIDTH) * 100}%`,
        height: `${(previewHeight / FRAME_HEIGHT) * 100}%`,
        left: `calc(50% + ${
          (left / FRAME_WIDTH) * 100
        }%)`,
        top: `calc(50% + ${
          (top / FRAME_HEIGHT) * 100
        }%)`,
        transform: "translate(-50%, -50%)",
      }
    : undefined;

  return (
    <div>
      <label className="mb-3 block text-xs font-black uppercase tracking-[.18em] text-black/55">
        01 / Your photo
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();

          if (!busy) {
            void handle(
              e.dataTransfer.files?.[0]
            );
          }
        }}
        className={`relative overflow-hidden rounded-[2rem] border-2 border-dashed border-[var(--green)] bg-white/60 p-4 transition ${
          busy
            ? "cursor-wait opacity-70"
            : "hover:-translate-y-0.5 hover:bg-white"
        }`}
      >
        {/* CAMERA */}
        <input
          ref={cameraInputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          capture="environment"
          className="sr-only"
          onChange={(e) => {
            void handle(
              e.target.files?.[0]
            );
          }}
        />

        {/* GALLERY */}
        <input
          ref={galleryInputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          className="sr-only"
          onChange={(e) => {
            void handle(
              e.target.files?.[0]
            );
          }}
        />

        {value ? (
          <>
            {/* PHOTO FRAME */}
            <div
              onPointerDown={startDragging}
              onPointerMove={dragPhoto}
              onPointerUp={stopDragging}
              onPointerCancel={stopDragging}
              onPointerLeave={() => {
                // Pointer capture keeps dragging active.
              }}
              className="relative mx-auto aspect-[928/560] w-full max-w-[928px] touch-none select-none overflow-hidden rounded-[1.4rem] bg-[var(--green)] cursor-grab active:cursor-grabbing"
            >
              <img
                src={value.dataUrl}
                alt="Adjustable builder portrait"
                draggable={false}
                className="absolute max-w-none"
                style={previewStyle}
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
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
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
              <div className="mb-4 flex items-center justify-between gap-3">
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
                  className="flex shrink-0 items-center gap-1.5 rounded-xl border-2 border-black px-3 py-2 text-xs font-black hover:bg-black hover:text-white"
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
                    className="rounded-xl border-2 border-black px-3 py-3 text-xs font-black transition hover:bg-black hover:text-white"
                  >
                    ← MOVE LEFT
                  </button>

                  <button
                    type="button"
                    onClick={() => changeX(5)}
                    className="rounded-xl border-2 border-black px-3 py-3 text-xs font-black transition hover:bg-black hover:text-white"
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
                    className="rounded-xl border-2 border-black px-3 py-3 text-xs font-black transition hover:bg-black hover:text-white"
                  >
                    ↑ MOVE UP
                  </button>

                  <button
                    type="button"
                    onClick={() => changeY(5)}
                    className="rounded-xl border-2 border-black px-3 py-3 text-xs font-black transition hover:bg-black hover:text-white"
                  >
                    ↓ MOVE DOWN
                  </button>
                </div>
              </div>

              {/* ZOOM */}
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black/50">
                  <ZoomIn size={15} />

                  <span>Zoom</span>

                  <span className="ml-auto text-[var(--pink)]">
                    {Math.round(
                      adjustment.scale * 100
                    )}
                    %
                  </span>
                </div>

                <div className="grid grid-cols-[1fr_2fr_1fr] items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      changeScale(-0.1)
                    }
                    className="rounded-xl border-2 border-black px-3 py-2 text-xl font-black transition hover:bg-black hover:text-white"
                  >
                    −
                  </button>

                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={adjustment.scale}
                    onChange={(e) => {
                      updateAdjustment({
                        scale: Number(
                          e.target.value
                        ),
                      });
                    }}
                    aria-label="Photo zoom"
                    className="w-full accent-[var(--pink)]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      changeScale(0.1)
                    }
                    className="rounded-xl border-2 border-black px-3 py-2 text-xl font-black transition hover:bg-black hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

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
                onClick={() =>
                  cameraInputRef.current?.click()
                }
                className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--green)] px-4 py-4 font-black text-[var(--cream)] transition hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-50"
              >
                <Camera size={20} />
                CAMERA
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  galleryInputRef.current?.click()
                }
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
              <RefreshCw
                className="animate-spin"
                size={18}
              />
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
