import { eq, and } from "drizzle-orm";

import db from "@/utils/db";
import { users, projects } from "@/config/schema";
import type { ProjectRequest, FilterProject } from "@/schema/project-schema";

export default class ProjectRepository {

    static async userCheck(userId: string) {
        const [user] = await db
            .select({
                id: users.id
            })
            .from(users)
            .where(eq(users.id, userId));
        return user;
    }

    static async projectExistByName(name: string) {
        const [project] = await db
            .select({
                id: projects.id
            })
            .from(projects)
            .where(eq(projects.name, name));
        return project;
    }

    static async createNewProject(userId: string, data: ProjectRequest) {
        const [project] = await db
            .insert(projects)
            .values({
                userId: userId,
                name: data.name,
                category: data.category,
                techStack: data.techStack,
                description: data.description,
                challenge: data.challenge,
                status: data.status,
                impact: data.impact,
                repositoryUrl: data.repositoryUrl,
                demoUrl: data.demoUrl
            })
            .returning({ id: projects.id });
        return project;
    }

    static async getProjects() {
        const data = await db
            .select({
                id: projects.id,
                name: projects.name,
                category: projects.category,
                techStack: projects.techStack,
                status: projects.status,
                repositoryUrl: projects.repositoryUrl,
                demoUrl: projects.demoUrl
            })
            .from(projects);
        return data;
    }

    static async getProjectById(id: string) {
        const [project] = await db
            .select({
                id: projects.id,
                name: projects.name,
                category: projects.category,
                techStack: projects.techStack,
                description: projects.description,
                challenge: projects.challenge,
                status: projects.status,
                impact: projects.impact,
                repositoryUrl: projects.repositoryUrl,
                demoUrl: projects.demoUrl
            })
            .from(projects)
            .where(eq(projects.id, id));
        return project;
    }

    static async getProjectsByMe(userId: string) {
        const data = await db
            .select({
                id: projects.id,
                userId: projects.userId,
                name: projects.name,
                category: projects.category,
                status: projects.status,
                repositoryUrl: projects.repositoryUrl,
                demoUrl: projects.demoUrl
            })
            .from(projects)
            .where(eq(projects.userId, userId));
        return data;
    }

    static async filterProject(filter: FilterProject) {
        const result = await db
            .select({
                id: projects.id,
                name: projects.name,
                category: projects.category,
                status: projects.status,
                repositoryUrl: projects.repositoryUrl,
                demoUrl: projects.demoUrl
            })
            .from(projects)
            .where(
                and(
                    eq(projects.category, filter.category),
                    eq(projects.status, filter.status)
                )
            );

        return result;
    }

    static async filterProjectByMe(userId: string, filter: FilterProject) {
        const result = await db
            .select({
                id: projects.id,
                userId: projects.userId,
                name: projects.name,
                category: projects.category,
                status: projects.status,
                repositoryUrl: projects.repositoryUrl,
                demoUrl: projects.demoUrl
            })
            .from(projects)
            .where(
                and(
                    eq(projects.userId, userId),
                    eq(projects.category, filter.category),
                    eq(projects.status, filter.status)
                )
            );

        return result;
    }

    static async porjectCheck(id: string) {
        const [project] = await db
            .select({
                id: projects.id,
                userId: projects.userId,
            })
            .from(projects)
            .where(eq(projects.id, id));
        return project;
    }

    static async updateProject(projectId: string, data: ProjectRequest) {
        const [project] = await db
            .update(projects)
            .set({
                name: data.name,
                category: data.category,
                techStack: data.techStack,
                description: data.description,
                challenge: data.challenge,
                status: data.status,
                impact: data.impact,
                repositoryUrl: data.repositoryUrl,
                demoUrl: data.demoUrl
            })
            .where(eq(projects.id, projectId))
            .returning({ id: projects.id });
        return project;
    }

    static async deleteProjectById(projectId: string) {
        const [project] = await db
            .delete(projects)
            .where(eq(projects.id, projectId))
            .returning({ id: projects.id });
        return project;
    }
}