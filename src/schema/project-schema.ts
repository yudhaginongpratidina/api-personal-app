import { z } from "zod";

export const ProjectSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters" }),
    category: z.enum([
        "website",
        "mobile",
        "desktop",
        "backend",
        "internet_of_things",
        "saas",
        "game"
    ]),
    techStack: z
        .string()
        .min(3, { message: "Tech Stack must be at least 3 characters" }),
    description: z
        .string()
        .min(3, { message: "Description must be at least 3 characters" }),
    challenge: z
        .string()
        .min(3, { message: "Challenge must be at least 3 characters" }),
    status: z.enum([
        "development",
        "demo",
        "production",
        "maintenance",
        "archive"
    ]),
    impact: z
        .string()
        .min(3, { message: "Impact must be at least 3 characters" }),
    repositoryUrl: z
        .string()
        .min(3, { message: "Repository URL must be at least 3 characters" }),
    demoUrl: z
        .string()
        .optional(),
});

export const FilterPorjectSchema = z.object({
    category: z.enum([
        "website",
        "mobile",
        "desktop",
        "backend",
        "internet_of_things",
        "saas",
        "game"
    ]),
    status: z.enum([
        "development",
        "demo",
        "production",
        "maintenance",
        "archive"
    ]),
});

export const DeletePorjectSchema = z.object({
    confirmDelete: z.literal("DELETE")
});

export type ProjectRequest = {
    name: string,
    category: "website" | "mobile" | "desktop" | "backend" | "internet_of_things" | "saas" | "game",
    techStack: string,
    description: string,
    challenge: string
    status: "development" | "demo" | "production" | "maintenance" | "archive",
    impact: string
    repositoryUrl: string
    demoUrl?: string
}

export type FilterProject = {
    category: "website" | "mobile" | "desktop" | "backend" | "internet_of_things" | "saas" | "game",
    status: "development" | "demo" | "production" | "maintenance" | "archive",
}