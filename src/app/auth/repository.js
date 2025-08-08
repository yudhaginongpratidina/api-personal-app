import db from "../../core/utils/db.js";

export default class AuthRepository {

    static async find_email(email) {
        return await db.user.findUnique({
            where: { email },
            select: { email: true }
        });
    }

    static async create(data) {
        return await db.user.create({
            data: {
                fullName: data.full_name,
                email: data.email,
                passwordHash: data.password,
            },
            select: {
                id: true,
            }
        });
    }

}