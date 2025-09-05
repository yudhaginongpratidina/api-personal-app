import bcrypt from "bcrypt";
import { decodeToken } from "@/utils/jwt";
import ResponseError from "@/utils/response-error";
import AccountRepository from "@/repository/account-repository";

export default class AccountService {

    static async changePassword(userId: string, oldPassword: string, newPassword: string) {
        const data = await AccountRepository.findUserById(userId);
        if (!data) throw new ResponseError({
            status: 404,
            code: "USER_NOT_FOUND",
            message: "User not found"
        });

        const password_match = await bcrypt.compare(oldPassword, data.passwordHash);
        if (!password_match) throw new ResponseError({
            status: 401,
            code: "INVALID_PASSWORD",
            message: "Invalid password"
        });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const response = await AccountRepository.updatePasswordByUserId(userId, hashedPassword);
        return response;
    }

    static async deleteAccount(userId: string, password: string, refreshToken: string) {
        if (!refreshToken) {
            throw new ResponseError({
                status: 400,
                code: "NOT_LOGGED_IN",
                message: "You are not logged in. Please login first."
            });
        }

        // Validasi session
        const decoded = decodeToken(refreshToken, "refresh");
        const sessions = await AccountRepository.getAllSessions(decoded.id);

        let matchedSession = null;
        for (const session of sessions) {
            const now = new Date();
            const expiredAt = new Date(session.expiredAt);

            if (expiredAt <= now) {
                await AccountRepository.deleteSession(session.id);
                continue;
            }

            const match = await bcrypt.compare(refreshToken, session.refreshTokenHash);
            if (match) {
                matchedSession = session;
                break;
            }
        }

        if (!matchedSession) {
            throw new ResponseError({
                status: 400,
                code: "ALREADY_LOGGED_OUT",
                message: "You are already logged out or the session has expired."
            });
        }

        // Validasi user
        const user = await AccountRepository.findUserById(userId);
        if (!user) {
            throw new ResponseError({
                status: 404,
                code: "USER_NOT_FOUND",
                message: "User not found"
            });
        }

        // Validasi password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new ResponseError({
                status: 401,
                code: "INVALID_PASSWORD",
                message: "Invalid password"
            });
        }

        // Hapus akun
        const result = await AccountRepository.deleteByUserId(userId);

        // Hapus session (yang match)
        await AccountRepository.deleteSession(matchedSession.id);

        return result;
    }
}