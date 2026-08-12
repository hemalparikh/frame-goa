import { ArrowDownRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function Hero({ onStart }: { onStart: () => void }) {
  return <section className="mx-auto flex min-h-[92svh] max-w-6xl flex-col justify-center px-5 py-12 sm:px-8">
    <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.55}} className="mb-7 flex items-center gap-3 text-sm font-black tracking-[.22em] text-[var(--green)]"><span className="inline-block h-3 w-3 rounded-full bg-[var(--pink)]"/> HACKER HOUSE GOA <span className="rounded-full bg-[var(--green)] px-3 py-1 text-[var(--cream)]">2026</span></motion.div>
    <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.08,duration:.6}} className="max-w-5xl font-display text-[clamp(4.2rem,13vw,9.5rem)] font-black leading-[.78] tracking-[-.065em] text-[var(--green)]">BUILD YOUR<br/><span className="text-[var(--pink)]">BUILDER ID</span></motion.h1>
    <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.25}} className="mt-9 max-w-xl text-lg font-bold leading-relaxed text-black/70 sm:text-2xl">Don&apos;t just show who you are.<br/>Show what kind of builder you are.</motion.p>
    <motion.button whileTap={{scale:.97}} whileHover={{scale:1.02}} onClick={onStart} className="mt-9 flex w-fit items-center gap-4 rounded-full bg-[var(--green)] px-7 py-4 text-base font-black text-[var(--cream)] shadow-[8px_8px_0_var(--pink)] transition hover:shadow-[5px_5px_0_var(--pink)]"><Sparkles size={19}/> CREATE MY BUILDER ID <ArrowDownRight size={20}/></motion.button>
    <div className="mt-7 text-sm font-bold text-black/50">No signup · Instant · Shareable</div>
  </section>;
}
