"use client";
import { Download, ExternalLink, RotateCcw, Copy, Check } from "lucide-react";
import { useState } from "react";
import type { BuilderProfile } from "@/types/builder";
import { makeCaption, makeXIntent } from "@/lib/share";

export function ResultActions({profile,png,onReset}:{profile:BuilderProfile;png:string;onReset:()=>void}){const [copied,setCopied]=useState(false);const [shareUrl,setShareUrl]=useState("");const caption=makeCaption(profile,shareUrl||undefined);
 async function createShare(){try{if(!png)throw new Error();const res=await fetch("/api/share",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({...profile,imageDataUrl:png})});const data=await res.json();if(!res.ok)throw new Error(data.error);setShareUrl(data.shareUrl);window.open(makeXIntent(makeCaption(profile,data.shareUrl)),"_blank","noopener,noreferrer");}catch{window.open(makeXIntent(caption),"_blank","noopener,noreferrer");}}
 function download(){const a=document.createElement("a");a.href=png;a.download=`${profile.builderId}-builder-card.png`;a.click();}
 async function copy(){await navigator.clipboard.writeText(caption);setCopied(true);setTimeout(()=>setCopied(false),1600)}
 return <div className="mt-8 grid gap-3 sm:grid-cols-2"><button onClick={download} disabled={!png} className="action-primary"><Download size={18}/> DOWNLOAD PNG</button><button onClick={createShare} className="action-secondary"><ExternalLink size={18}/> SHARE TO X</button><button onClick={copy} className="action-ghost sm:col-span-2">{copied?<Check size={18}/>:<Copy size={18}/>} {copied?"CAPTION COPIED":"COPY CAPTION"}</button><button onClick={onReset} className="action-ghost sm:col-span-2"><RotateCcw size={18}/> CREATE ANOTHER</button></div>}
