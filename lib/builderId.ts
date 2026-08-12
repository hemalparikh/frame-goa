function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function createBuilderId(name: string, stack: string) {
  const seed = hash(`${name.trim().toLowerCase()}|${stack.trim().toLowerCase()}`);
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let n = seed;
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += alphabet[n % alphabet.length];
    n = Math.floor(n / alphabet.length) || hash(`${n}-${i}-${seed}`);
  }
  return `HH26-${code}`;
}
