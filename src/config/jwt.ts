import type { Algorithm } from "jsonwebtoken";

export const JWT_CONFIG = {
    JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET || "supersecret-access",
    JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET || "supersecret-refresh",
    ACCESS_TOKEN_EXPIRY: "5m" as const,
    REFRESH_TOKEN_EXPIRY: "1d" as const,
    ALGORITHM: "HS256" as Algorithm,
};