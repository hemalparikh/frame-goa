import { z } from "zod";
import { MAX_NAME_LENGTH, MAX_STACK_LENGTH } from "./constants";

export const builderSchema = z.object({
  name: z.string().trim().min(1, "Your builder identity needs a name.").max(MAX_NAME_LENGTH, `Keep your name under ${MAX_NAME_LENGTH} characters.`),
  stack: z.string().trim().min(1, "Tell us what you build.").max(MAX_STACK_LENGTH, `Keep your stack under ${MAX_STACK_LENGTH} characters.`),
});

export function validateBuilderInput(name: string, stack: string) {
  const result = builderSchema.safeParse({ name, stack });
  if (result.success) return { success: true as const, data: result.data };
  return { success: false as const, errors: result.error.flatten().fieldErrors };
}
