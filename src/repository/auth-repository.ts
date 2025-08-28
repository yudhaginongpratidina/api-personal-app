import { eq, and } from "drizzle-orm";
import ms from "ms";

import db from "@/utils/db";
import { users, sessions } from "@/config/schema";
import { JWT_CONFIG } from "@/config/jwt";

export default class AuthRepository {

    static async findUser(email: string) {
        const [user] = await db
            .select({
                email: users.email
            })
            .from(users)
            .where(eq(users.email, email));

        return user
    }

    static async createUser(data: {
        email: string,
        password: string
    }) {
        const [user] = await db
            .insert(users)
            .values({
                email: data.email,
                passwordHash: data.password
            })
            .returning({
                id: users.id,
                email: users.email,
                created_at: users.createdAt
            });

        return user
    }

    static async getUserWithPasswordByEmail(email: string) {
        const [user] = await db
            .select({
                id: users.id,
                email: users.email,
                passwordHash: users.passwordHash
            })
            .from(users)
            .where(eq(users.email, email));

        return user;
    }



    static async checkSession(
        userId: string,
        ipAddress: string,
        userAgent: string,
        deviceType: string
    ) {
        const [session] = await db
            .select({
                id: sessions.id,
                userId: sessions.userId,
                refreshTokenHash: sessions.refreshTokenHash,
                expiredAt: sessions.expiredAt,
                createdAt: sessions.createdAt
            })
            .from(sessions)
            .where(
                and(
                    eq(sessions.userId, userId),
                    eq(sessions.ipAddress, ipAddress),
                    eq(sessions.userAgent, userAgent),
                    eq(sessions.deviceType, deviceType)
                )
            );

        return session;
    }

    static async createSession(
        userId: string,
        refreshTokenHash: string,
        ipAddress: string,
        userAgent: string,
        deviceType: string,
    ) {
        const [session] = await db
            .insert(sessions)
            .values({
                userId,
                refreshTokenHash,
                ipAddress,
                userAgent,
                deviceType,
                expiredAt: new Date(Date.now() + ms(JWT_CONFIG.REFRESH_TOKEN_EXPIRY))
            })
            .returning({
                id: sessions.id,
                userId: sessions.userId,
                refreshTokenHash: sessions.refreshTokenHash,
                created_at: sessions.createdAt
            });
        return session
    }

    static async getAllSessions(userId: string) {
        const userSessions = await db
            .select({
                id: sessions.id,
                userId: sessions.userId,
                refreshTokenHash: sessions.refreshTokenHash,
                expiredAt: sessions.expiredAt
            })
            .from(sessions)
            .where(eq(sessions.userId, userId));

        return userSessions;
    }
    
    static async deleteSession(sessionId: string) {
        const [session] = await db
            .delete(sessions)
            .where(eq(sessions.id, sessionId))
            .returning({
                id: sessions.id,
                userId: sessions.userId,
                refreshTokenHash: sessions.refreshTokenHash,
                created_at: sessions.createdAt
            });
        return session
    }

    static async deleteSessionByToken(token: string) {
        const [session] = await db
            .delete(sessions)
            .where(eq(sessions.refreshTokenHash, token))
            .returning({
                id: sessions.id,
                userId: sessions.userId,
                refreshTokenHash: sessions.refreshTokenHash,
                created_at: sessions.createdAt
            });
        return session
    }

}