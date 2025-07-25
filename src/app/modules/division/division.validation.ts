import z from "zod";

export const createDivisionZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Division name is required!!" })
    .min(1, { message: "Division name must be at least one character." }),
  slug: z.string().optional(),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
});

export const updateDivisionZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Division name is required!!" })
    .min(1, { message: "Division name must be at least one character." })
    .optional(),
  slug: z.string().optional(),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
});
