import { eq } from "drizzle-orm";

import db from "@/utils/db";
import { users, sessions } from "@/config/schema";

export default class AccountRepository {

    static async getConnectedDevice(userId: string) {
        const userSession = await db
            .select({
                id: sessions.id,
                userId: sessions.userId,
                userAgent: sessions.userAgent,
                deviceType: sessions.deviceType
            })
            .from(sessions)
            .where(eq(sessions.userId, userId));
        return userSession;
    }

    static async findUserById(id: string) {
        const [user] = await db
            .select({
                id: users.id,
                passwordHash: users.passwordHash
            })
            .from(users)
            .where(eq(users.id, id));
        return user;
    }

    static async updatePasswordByUserId(id: string, password: string) {
        const [user] = await db
            .update(users)
            .set({ passwordHash: password })
            .where(eq(users.id, id))
            .returning({ id: users.id });
        return user;
    }

    static async deleteByUserId(id: string) {
        const [user] = await db
            .delete(users)
            .where(eq(users.id, id))
            .returning({ id: users.id });
        return user;
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

}