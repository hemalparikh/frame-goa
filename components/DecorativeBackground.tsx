export function DecorativeBackground() {
  return <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"><div className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-[var(--pink)] opacity-20 blur-2xl"/><div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[var(--yellow)] opacity-20 blur-3xl"/><div className="absolute left-[8%] top-[30%] h-28 w-28 rounded-full border-4 border-dashed border-[var(--green)] opacity-20"/></div>;
}
