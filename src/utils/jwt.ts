import jwt, { type JwtPayload, type SignOptions, type Algorithm } from "jsonwebtoken";
import ResponseError from "@/utils/response-error";
import { JWT_CONFIG } from "@/config/jwt";

// Payload type
export interface AccessTokenPayload {
    id: string;
}

export interface RefreshTokenPayload {
    id: string;
}

/**
 * Generate access & refresh tokens
 */
export function generateTokens(userId: string) {
    const accessPayload: AccessTokenPayload = { id: userId };
    const refreshPayload: RefreshTokenPayload = { id: userId };

    const accessToken = jwt.sign(accessPayload, JWT_CONFIG.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRY,
        algorithm: JWT_CONFIG.ALGORITHM,
    } as SignOptions);

    const refreshToken = jwt.sign(refreshPayload, JWT_CONFIG.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRY,
        algorithm: JWT_CONFIG.ALGORITHM,
    } as SignOptions);

    return { accessToken, refreshToken };
}

/**
 * Decode and verify token
 */
export function decodeToken(
    token: string,
    type: "access" | "refresh" = "access"
): JwtPayload & { id: string } {
    try {
        if (!token) {
            throw new ResponseError({
                status: 401,
                code: "TOKEN_REQUIRED",
                message: "Token is required",
            });
        }

        const secret =
            type === "access"
                ? JWT_CONFIG.JWT_ACCESS_TOKEN_SECRET
                : JWT_CONFIG.JWT_REFRESH_TOKEN_SECRET;

        const decoded = jwt.verify(token, secret, {
            algorithms: [JWT_CONFIG.ALGORITHM as Algorithm],
        }) as JwtPayload & { id: string };

        if (!decoded.id) {
            throw new ResponseError({
                status: 401,
                code: "INVALID_TOKEN",
                message: "Token payload invalid",
            });
        }

        return decoded;
    } catch (err: any) {
        if (err instanceof jwt.TokenExpiredError) {
            throw new ResponseError({
                status: 401,
                code: "TOKEN_EXPIRED",
                message: "Token has expired",
            });
        }
        throw new ResponseError({
            status: 401,
            code: "INVALID_TOKEN",
            message: "Token is invalid",
        });
    }
}

/**
 * Refresh access token using a valid refresh token
 */
export function refreshAccessToken(refreshToken: string) {
    try {
        const decoded = decodeToken(refreshToken, "refresh");
        const payload: AccessTokenPayload = { id: decoded.id };

        const newAccessToken = jwt.sign(payload, JWT_CONFIG.JWT_ACCESS_TOKEN_SECRET, {
            expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRY,
            algorithm: JWT_CONFIG.ALGORITHM,
        } as SignOptions);

        return newAccessToken;
    } catch (err: any) {
        throw new ResponseError({
            status: 401,
            code: "INVALID_REFRESH_TOKEN",
            message: "Refresh token is invalid or expired",
        });
    }
}
