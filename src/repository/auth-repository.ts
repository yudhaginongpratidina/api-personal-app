import { eq } from "drizzle-orm";

import db from "@/utils/db";
import { users } from "@/config/schema";

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

    static async createUser(data: { email: string, password: string }) {
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

}