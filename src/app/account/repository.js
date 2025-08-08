import db from "../../core/utils/db.js";

export default class AccountRepository {

    static async get_account(id){
        return await db.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                fullName: true,
                avatar: true
            }
        });
    }

    static async find_user(id){
        return await db.user.findUnique({
            where: { id },
            select: {
                id: true,
                passwordHash: true,
                avatar: true
            }
        });
    }

    static async update_avater(id, fileName){
        return await db.user.update({
            where: { id },
            data: {
                avatar: fileName
            },
            select: {
                id: true,
            }
        });
    }

    static async update_password(id, data){
        return await db.user.update({
            where: { id },
            data: {
                passwordHash: data.password
            },
            select: {
                id: true,
            }
        });
    }

    static async delete_account(id){
        return await db.user.delete({
            where: { id },
            select: {
                id: true,
            }
        });
    }

}