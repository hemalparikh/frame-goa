"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";

import { DecorativeBackground } from "@/components/DecorativeBackground";
import { Hero } from "@/components/Hero";
import {
  PhotoUploader,
  PhotoValue,
} from "@/components/PhotoUploader";
import { BuilderForm } from "@/components/BuilderForm";
import { LoadingReveal } from "@/components/LoadingReveal";
import { BuilderCard } from "@/components/BuilderCard";
import { ResultActions } from "@/components/ResultActions";

import { createBuilderId } from "@/lib/builderId";
import { getBuilderIdentity } from "@/lib/builderTitles";

import type { BuilderProfile } from "@/types/builder";

export default function Home() {
  const [started, setStarted] = useState(false);

  const [photo, setPhoto] = useState<PhotoValue | null>(null);

  const [name, setName] = useState("");
  const [stack, setStack] = useState("");

  const [loading, setLoading] = useState(false);

  const [profile, setProfile] =
    useState<BuilderProfile | null>(null);

  const [png, setPng] = useState("");

  function generate() {
    if (!photo) return;

    const identity = getBuilderIdentity(stack);

    const newProfile: BuilderProfile = {
      name: name.trim(),
      stack: stack.trim(),

      title: identity.title,
      category: identity.category,

      builderId: createBuilderId(name, stack),

      imageDataUrl: photo.dataUrl,

      adjustment: {
        x: photo.adjustment.x,
        y: photo.adjustment.y,
        scale: photo.adjustment.scale,
      },

      imageWidth: photo.width,
      imageHeight: photo.height,
    };

    setProfile(newProfile);
    setLoading(true);
  }

  const finish = useCallback(() => {
    setLoading(false);
  }, []);

  function reset() {
    setProfile(null);
    setPng("");

    setPhoto(null);
    setName("");
    setStack("");

    setStarted(true);

    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  return (
    <main className="min-h-screen">
      <DecorativeBackground />

      {loading && <LoadingReveal onDone={finish} />}

      {!started && !profile ? (
        <Hero
          onStart={() => {
            setStarted(true);

            setTimeout(() => {
              document
                .getElementById("builder")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }, 50);
          }}
        />
      ) : (
        <div
          id="builder"
          className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16"
        >
          {!profile ? (
            <motion.div
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-start"
            >
              <div>
                <div className="mb-7 font-black tracking-[.18em] text-[var(--green)]">
                  FRAME / GOA{" "}
                  <span className="text-[var(--pink)]">
                    2026
                  </span>
                </div>

                <h2 className="font-display text-5xl font-black leading-[.9] text-[var(--green)] sm:text-7xl">
                  LET&apos;S BUILD
                  <br />
                  <span className="text-[var(--pink)]">
                    YOUR ID.
                  </span>
                </h2>

                <p className="mt-5 max-w-md text-black/60">
                  One photo. Two details. One builder identity
                  worth sharing.
                </p>
              </div>

              <div className="rounded-[2rem] border-2 border-black/10 bg-white/45 p-4 sm:p-6">
                <PhotoUploader
                  value={photo}
                  onChange={setPhoto}
                />

                <BuilderForm
                  name={name}
                  stack={stack}
                  setName={setName}
                  setStack={setStack}
                  onGenerate={generate}
                  disabled={!photo}
                />
              </div>
            </motion.div>
          ) : (
            <section className="mx-auto max-w-5xl py-6">
              <div className="mb-8 text-center">
                <div className="text-xs font-black tracking-[.25em] text-[var(--green)]">
                  IDENTITY GENERATED
                </div>

                <h2 className="mt-2 font-display text-4xl font-black text-[var(--green)] sm:text-6xl">
                  YOUR BUILDER IDENTITY IS READY.
                </h2>

                <p className="mt-3 font-bold text-black/55">
                  Your identity is ready to ship.
                </p>
              </div>

              <BuilderCard
                profile={profile}
                onPngReady={setPng}
              />

              <ResultActions
                profile={profile}
                png={png}
                onReset={reset}
              />
            </section>
          )}
        </div>
      )}
    </main>
  );
}
