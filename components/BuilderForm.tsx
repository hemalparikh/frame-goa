"use client";
import { ArrowRight } from "lucide-react";
import { validateBuilderInput } from "@/lib/validation";
import { useState } from "react";

export function BuilderForm({ name, stack, setName, setStack, onGenerate, disabled }: {name:string;stack:string;setName:(v:string)=>void;setStack:(v:string)=>void;onGenerate:()=>void;disabled?:boolean}) {
  const [submitted,setSubmitted]=useState(false); const validation=validateBuilderInput(name,stack); const errors=validation.success?{}:validation.errors;
  function submit(e:React.FormEvent){e.preventDefault();setSubmitted(true);if(validation.success)onGenerate();}
  return <form onSubmit={submit} className="mt-8 space-y-5">
    <div><label htmlFor="name" className="mb-2 block text-xs font-black uppercase tracking-[.18em] text-black/55">02 / Name</label><input id="name" maxLength={40} value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" className="field" aria-invalid={submitted&&!!errors.name}/>{submitted&&errors.name?.[0]&&<p className="mt-2 text-sm font-bold text-[var(--pink)]">{errors.name[0]}</p>}</div>
    <div><label htmlFor="stack" className="mb-2 block text-xs font-black uppercase tracking-[.18em] text-black/55">03 / Stack / Role</label><input id="stack" maxLength={70} value={stack} onChange={e=>setStack(e.target.value)} placeholder="Android Developer" className="field" aria-invalid={submitted&&!!errors.stack}/>{submitted&&errors.stack?.[0]&&<p className="mt-2 text-sm font-bold text-[var(--pink)]">{errors.stack[0]}</p>}</div>
    <button disabled={disabled} className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[var(--pink)] px-6 py-4 text-base font-black text-white shadow-[6px_6px_0_var(--green)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">{disabled?"BUILDING YOUR ID…":"GENERATE MY BUILDER ID"}<ArrowRight className="transition group-hover:translate-x-1" size={20}/></button>
  </form>;
}
