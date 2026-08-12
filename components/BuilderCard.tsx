"use client";
import { motion } from "framer-motion";
import type { BuilderProfile } from "@/types/builder";
import { buildCardSvg, svgToPng } from "@/lib/cardGenerator";
import { useEffect, useState } from "react";

export function BuilderCard({ profile, onPngReady }: {profile:BuilderProfile;onPngReady?:(png:string)=>void}) {
  const [png,setPng]=useState(""); const svg=buildCardSvg(profile); const svgUrl=`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  useEffect(()=>{let active=true;void svgToPng(svg).then((value)=>{if(active){setPng(value);onPngReady?.(value);}}).catch(()=>{});return()=>{active=false;}},[svg,onPngReady]);
  return <motion.div initial={{opacity:0,scale:.94,y:18,rotate:-1}} animate={{opacity:1,scale:1,y:0,rotate:0}} transition={{duration:.65,ease:[.16,1,.3,1]}} whileHover={{rotate:.5,scale:1.01}} className="card-shadow mx-auto w-full max-w-[540px] overflow-hidden rounded-[1.5rem] bg-[var(--cream)]"><img src={png||svgUrl} alt={`Builder ID card for ${profile.name}`} className="block w-full"/>
  </motion.div>;
}
