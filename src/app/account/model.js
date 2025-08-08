import { z } from "zod";

export const ChangePasswordSchema = z.object({
    old_password: z
        .string()
        .min(6, { message: "password must be at least 6 characters long" })
        .max(16, { message: "password must be at most 16 characters long" }),
    new_password: z
        .string()
        .min(6, { message: "password must be at least 6 characters long" })
        .max(16, { message: "password must be at most 16 characters long" }),
    confirm_password: z
        .string()
        .min(6, { message: "confirm password must be at least 6 characters long" })
        .max(16, { message: "confirm password must be at most 16 characters long" }),
}).refine((data) => data.new_password === data.confirm_password, {
    message: "passwords do not match",
    path: ["confirm_password"],
})

export const DeleteAccountSchema = z.object({
    password: z
        .string()
        .min(6, { message: "password must be at least 6 characters long" })
        .max(16, { message: "password must be at most 16 characters long" }),
});