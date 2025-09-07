import { eq, and } from "drizzle-orm";
import db from "@/utils/db";

import { users, experiences } from "@/config/schema";
import type { ExperienceRequest } from "@/schema/experience-schema";

export default class ExperienceRepository {

    static async userCheck(userId: string) {
        const [user] = await db
            .select({
                id: users.id
            })
            .from(users)
            .where(eq(users.id, userId));
        return user;
    }

    static async experienceCheck(experienceId:string) {
        const [experience] = await db
            .select({
                id: experiences.id,
                userId: experiences.userId
            })
            .from(experiences)
            .where(eq(experiences.id, experienceId));
        return experience;
    }

    static async createExperience(userId: string, data: ExperienceRequest) {
        const [experience] = await db
            .insert(experiences)
            .values({
                userId: userId,
                title: data.title,
                company: data.company,
                position: data.position,
                startDate: data.startDate,
                endDate: data.endDate,
                description: data.description,
            })
            .returning({ id: experiences.id });

        return experience;
    }

    static async getAllExperience() {
        const data = await db
            .select({
                id: experiences.id,
                userId: experiences.userId,
                title: experiences.title,
                company: experiences.company,
                position: experiences.position,
                startDate: experiences.startDate,
                endDate: experiences.endDate
            })
            .from(experiences)
        return data;
    }

    static async getExpericeById(id: string) {
        const [experience] = await db
            .select({
                id: experiences.id,
                userId: experiences.userId,
                title: experiences.title,
                company: experiences.company,
                position: experiences.position,
                startDate: experiences.startDate,
                endDate: experiences.endDate,
                description: experiences.description
            })
            .from(experiences)
            .where(eq(experiences.id, id));
        return experience;
    }

    static async updateExperienceById(userId: string, experienceId: string, data: ExperienceRequest) {
        const [experience] = await db
            .update(experiences)
            .set({
                userId: userId,
                title: data.title,
                company: data.company,
                position: data.position,
                startDate: data.startDate,
                endDate: data.endDate,
                description: data.description,
            })
            .where(and(eq(experiences.id, experienceId), eq(experiences.userId, userId)))
            .returning({ id: experiences.id });
        return experience;
    }

    static async deleteExperienceById(userId: string, experienceId: string) {
        const [experience] = await db
            .delete(experiences)
            .where(and(eq(experiences.id, experienceId), eq(experiences.userId, userId)))
            .returning({ id: experiences.id });
        return experience;
    }

}