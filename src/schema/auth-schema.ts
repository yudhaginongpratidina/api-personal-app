import { z } from "zod";


export const RegisterSchema = z.object({
    email: z.email({ message: "Invalid email" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirm_password: z.string().min(8, { message: "Password must be at least 8 characters" }),
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});


export const LoginSchema = z.object({
    email: z.string().email({ message: "Invalid email" }).toLowerCase(),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});