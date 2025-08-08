import { z } from "zod";

export const RegisterSchema = z.object({
    full_name: z
        .string()
        .min(3, { message: "full_name must be at least 3 characters long" }),
    email: z
        .email({ message: "invalid email" }),
    password: z
        .string()
        .min(6, { message: "password must be at least 6 characters long" })
        .max(16, { message: "password must be at most 16 characters long" }),
    confirm_password: z
        .string()
        .min(6, { message: "confirm password must be at least 6 characters long" })
        .max(16, { message: "confirm password must be at most 16 characters long" }),
}).refine((data) => data.password === data.confirm_password, {
    message: "passwords do not match",
    path: ["confirm_password"],
})