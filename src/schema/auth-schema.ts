import { z } from "zod";


export const RegisterSchema = z.object({
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});


export const LoginSchema = z.object({
    email: z.string().email({ message: "Invalid email" }).toLowerCase(),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});