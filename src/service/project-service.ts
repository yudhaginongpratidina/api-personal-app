import ProjectRepository from "@/repository/project-repository"
import ResponseError from "@/utils/response-error";

import type { ProjectRequest, FilterProject } from "@/schema/project-schema";

export default class ProjectService {

    static async createProject(userId: string, data: ProjectRequest) {
        const user_check = await ProjectRepository.userCheck(userId);
        if (!user_check) throw new ResponseError({
            status: 404,
            code: "USER_NOT_FOUND",
            message: "User not found"
        });

        const projectCheck = await ProjectRepository.projectExistByName(data.name);
        if (projectCheck) throw new ResponseError({
            status: 409,
            code: "PROJECT_ALREADY_EXISTS",
            message: "Project already exists"
        });

        const response = await ProjectRepository.createNewProject(userId, data);
        return response;
    }

    static async getProjects() {
        const response = await ProjectRepository.getProjects();
        return response;
    }

    static async getProject(id: string) {
        const response = await ProjectRepository.getProjectById(id);
        if (!response) throw new ResponseError({
            status: 404,
            code: "PROJECT_NOT_FOUND",
            message: "Project not found"
        });
        return response;
    }

    static async getProjectstMe(userId: string) {
        const response = await ProjectRepository.getProjectsByMe(userId);
        return response;
    }

    static async filterPojects(data: FilterProject) {
        const response = await ProjectRepository.filterProject(data);
        if (!response) throw new ResponseError({
            status: 404,
            code: "PROJECT_NOT_FOUND",
            message: "Project not found"
        });
        return response;
    }

    static async filterProjectsMe(userId: string, data: FilterProject) {
        const response = await ProjectRepository.filterProjectByMe(userId, data);
        if (!response) throw new ResponseError({
            status: 404,
            code: "PROJECT_NOT_FOUND",
            message: "Project not found"
        });
        return response;
    }

    static async updateProject(userId: string, projectid: string, data: ProjectRequest) {
        const user_check = await ProjectRepository.userCheck(userId);
        if (!user_check) throw new ResponseError({
            status: 404,
            code: "USER_NOT_FOUND",
            message: "User not found"
        });

        const project_check = await ProjectRepository.porjectCheck(projectid);
        if (!project_check) throw new ResponseError({
            status: 404,
            code: "PROJECT_NOT_FOUND",
            message: "Project not found"
        });

        const data_project_match_with_user_id = project_check.userId === userId;
        if (!data_project_match_with_user_id) throw new ResponseError({
            status: 403,
            code: "FORBIDDEN_ACCESS",
            message: "You do not have permission to modify this project"
        });

        const response = await ProjectRepository.updateProject(projectid, data);
        return response;
    }

    static async deleteProject(userId: string, projectId: string) {
        const user_check = await ProjectRepository.userCheck(userId);
        if (!user_check) throw new ResponseError({
            status: 404,
            code: "USER_NOT_FOUND",
            message: "User not found"
        });

        const project_check = await ProjectRepository.porjectCheck(projectId);
        if (!project_check) throw new ResponseError({
            status: 404,
            code: "PROJECT_NOT_FOUND",
            message: "Project not found"
        });

        const response = await ProjectRepository.deleteProjectById(projectId);
        return response;
    }

}