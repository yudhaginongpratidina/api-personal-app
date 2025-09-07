import { z } from "zod";

export const ExperienceSchema = z.object({
    title : z
        .string()
        .min(3, { message: "Title must be at least 3 characters" }),
    company: z
        .string()
        .min(3, { message: "Company must be at least 3 characters" }),
    position: z
        .string()
        .min(3, { message: "Position must be at least 3 characters" }),
    startDate: z
        .string()
        .min(3, { message: "Start Date must be at least 3 characters" }),
    endDate: z
        .string()
        .optional(),
    description: z
        .string()
        .min(3, { message: "Description must be at least 3 characters" })
})

export const DeleteExperienceSchema = z.object({
    confirmDelete: z.literal("DELETE")
});

export type ExperienceRequest = {
    title : string,
    company: string,
    position: string,
    startDate: string,
    endDate?: string,
    description: string
}