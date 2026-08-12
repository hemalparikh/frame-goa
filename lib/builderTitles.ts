import type { BuilderCategory } from "@/types/builder";

type Rule = { category: BuilderCategory; title: string; keywords: string[] };

const rules: Rule[] = [
  { category: "fullstack", title: "THE FULL-STACK BUILDER", keywords: ["full stack", "fullstack"] },
  { category: "mobile", title: "THE MOBILE ARCHITECT", keywords: ["android", "kotlin", "mobile", "ios", "flutter", "react native"] },
  { category: "systems", title: "THE SYSTEMS BUILDER", keywords: ["backend", "java", "spring", "node", "express", "api", "distributed", "microservices", "server"] },
  { category: "pixel", title: "THE PIXEL ENGINEER", keywords: ["frontend", "front end", "react", "angular", "vue", "ui", "ux", "css", "web designer"] },
  { category: "model", title: "THE MODEL MAKER", keywords: ["ai", "artificial intelligence", "ml", "machine learning", "deep learning", "tensorflow", "pytorch", "nlp"] },
  { category: "data", title: "THE DATA FORGER", keywords: ["data", "analytics", "data science", "big data", "sql", "power bi", "tableau"] },
  { category: "security", title: "THE DIGITAL SENTINEL", keywords: ["security", "cyber", "cybersecurity", "penetration", "ethical hacking", "infosec"] },
  { category: "infra", title: "THE INFRA BUILDER", keywords: ["devops", "cloud", "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "sre"] },
  { category: "chain", title: "THE CHAIN BUILDER", keywords: ["blockchain", "web3", "solidity", "ethereum", "smart contract"] },
  { category: "game", title: "THE GAME FORGER", keywords: ["game", "unity", "unreal", "godot", "gamedev"] },
];

export function getBuilderIdentity(stack: string) {
  const value = stack.toLowerCase().trim();
  const rule = rules.find((candidate) => candidate.keywords.some((keyword) => value.includes(keyword)));
  return rule ?? { category: "general" as const, title: "THE BUILDING MACHINE" };
}
