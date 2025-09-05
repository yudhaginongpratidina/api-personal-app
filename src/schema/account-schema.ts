import { z } from "zod";


export const ChangePasswordSchema = z.object({
    oldPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
    newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});


export const DeleteAccountSchema = z.object({
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmDelete: z.literal("DELETE")
});
