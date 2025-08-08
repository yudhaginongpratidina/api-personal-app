import { z } from "zod";

export const PortfolioSchema = z.object({
    name: z
        .string()
        .min(3, { message: "name must be at least 3 characters long" }),
    repo_url: z
        .url({ message: "invalid repo url" }),
    demo_url: z
        .url({ message: "invalid demo url" }),
    description: z
        .string()
        .min(3, { message: "description must be at least 3 characters long" }),
})

export const DeletePortfolioSchema = z.object({
    password: z
        .string()
        .min(3, { message: "password must be at least 3 characters long" })
        .max(16, { message: "password must be at most 16 characters long" }),
});