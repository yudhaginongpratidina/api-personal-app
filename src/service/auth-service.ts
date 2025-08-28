import bcrypt from "bcrypt";

import AuthRepository from "@/repository/auth-repository";
import ResponseError from "@/utils/response-error";
import { generateTokens, decodeToken, refreshAccessToken } from "@/utils/jwt";

export default class AuthService {

    static async register(data: { email: string, password: string }) {
        const find_user_by_email = await AuthRepository.findUser(data.email);

        if (find_user_by_email) throw new ResponseError({
            status: 409,
            code: "USER_ALREADY_EXISTS",
            message: "User with this email already exists",
            details: {
                field: "email",
                value: data.email,
                suggestion: "Try with another email"
            }
        });

        data.password = await bcrypt.hash(data.password, 10);
        const response = await AuthRepository.createUser(data);
        return response
    }

    static async login(data: { email: string, password: string, ipAddress: string, userAgent: string, deviceType: string }) {
        const user = await AuthRepository.getUserWithPasswordByEmail(data.email);

        if (!user) {
            throw new ResponseError({
                status: 401,
                code: "INVALID_CREDENTIALS",
                message: "Invalid email or password"
            });
        }

        const password_match = await bcrypt.compare(data.password, user.passwordHash);
        if (!password_match) {
            throw new ResponseError({
                status: 401,
                code: "INVALID_CREDENTIALS",
                message: "Invalid email or password"
            });
        }

        const session: any = await AuthRepository.checkSession(user.id, data.ipAddress, data.userAgent, data.deviceType);

        if (session) {
            const now = new Date();
            const expiredAt = new Date(session.expiredAt);

            if (expiredAt > now) {
                throw new ResponseError({
                    status: 401,
                    code: "USER_ALREADY_LOGGED_IN",
                    message: "You are already logged in on this device",
                });
            } else {
                await AuthRepository.deleteSession(session.id);
            }
        }

        const token = generateTokens(user.id);
        const refreshTokenHash = await bcrypt.hash(token.refreshToken, 10);
        await AuthRepository.createSession(
            user.id,
            refreshTokenHash,
            data.ipAddress,
            data.userAgent,
            data.deviceType
        );

        return token
    }

    static async refreshToken(refreshToken: string) {
        if (!refreshToken) {
            throw new ResponseError({
                status: 401,
                code: "NOT_LOGGED_IN",
                message: "You are not logged in. Please login first."
            });
        }

        const decoded = decodeToken(refreshToken, "refresh");
        const sessions = await AuthRepository.getAllSessions(decoded.id);

        let matchedSession = null;

        for (const session of sessions) {
            const now = new Date();
            const expiredAt = new Date(session.expiredAt);

            if (expiredAt <= now) {
                await AuthRepository.deleteSession(session.id);

                throw new ResponseError({
                    status: 401,
                    code: "REFRESH_TOKEN_EXPIRED",
                    message: "Your refresh token has expired. Please login again."
                });
            }

            const match = await bcrypt.compare(refreshToken, session.refreshTokenHash);
            if (match) {
                matchedSession = session;
                break;
            }
        }

        if (!matchedSession) {
            throw new ResponseError({
                status: 401,
                code: "ALREADY_LOGGED_OUT",
                message: "You are already logged out or the session is invalid."
            });
        }

        const token = refreshAccessToken(refreshToken);
        return token;
    }


    static async logout(refreshToken: string) {
        if (!refreshToken) {
            throw new ResponseError({
                status: 400,
                code: "NOT_LOGGED_IN",
                message: "You are not logged in. Please login first."
            });
        }

        const decoded = decodeToken(refreshToken, "refresh");
        const sessions = await AuthRepository.getAllSessions(decoded.id);

        const matchedSession = await Promise.all(
            sessions.map(async (session) => {
                const now = new Date();
                const expiredAt = new Date(session.expiredAt);

                if (expiredAt <= now) {
                    await AuthRepository.deleteSession(session.id);
                    return null;
                }

                const match = await bcrypt.compare(refreshToken, session.refreshTokenHash);
                return match ? session : null;
            })
        ).then(results => results.find(Boolean));

        if (!matchedSession) {
            throw new ResponseError({
                status: 400,
                code: "ALREADY_LOGGED_OUT",
                message: "You are already logged out or the session has expired."
            });
        }

        await AuthRepository.deleteSession(matchedSession.id);
    }

}