import type { Request, Response, NextFunction } from "express";
import Validation from "@/utils/validation";
import ResponseSuccess from "@/utils/response-success";

import { ProjectSchema, FilterPorjectSchema, DeletePorjectSchema } from "@/schema/project-schema";
import ProjectService from "@/service/project-service";

export default class ProjectController {

    static async createProject(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as any).user;
            const { data } = Validation(ProjectSchema, req.body);
            const response = await ProjectService.createProject(user.id, data);
            return new ResponseSuccess({
                status: 201,
                code: "PROJECT_CREATED",
                message: "Project created successfully",
                data: response
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    static async getProjects(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await ProjectService.getProjects();
            return new ResponseSuccess({
                status: 200,
                code: "PROJECTS_FETCHED",
                message: "Projects fetched successfully",
                data: response
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    static async getProject(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const response = await ProjectService.getProject(id as string);
            return new ResponseSuccess({
                status: 200,
                code: "PROJECT_FETCHED",
                message: "Project fetched successfully",
                data: response
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    static async getProjecstMe(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as any).user;
            const reponse = await ProjectService.getProjectstMe(user.id as string);
            return new ResponseSuccess({
                status: 200,
                code: "PROJECTS_FETCHED",
                message: "Projects fetched successfully",
                data: reponse
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    static async filterProjects(req: Request, res: Response, next: NextFunction) {
        try {
            const { data } = Validation(FilterPorjectSchema, req.body);
            const response = await ProjectService.filterPojects(data);
            return new ResponseSuccess({
                status: 200,
                code: "PROJECTS_FETCHED",
                message: "Projects fetched successfully",
                data: response
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    static async filterProjectMe(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as any).user;
            const { data } = Validation(FilterPorjectSchema, req.body);
            const response = await ProjectService.filterProjectsMe(user.id as string, data);
            return new ResponseSuccess({
                status: 200,
                code: "PROJECTS_FETCHED",
                message: "Projects fetched successfully",
                data: response
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    static async updateProject(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as any).user;
            const { id } = req.params;
            const { data } = Validation(ProjectSchema, req.body);
            const response = await ProjectService.updateProject(user.id as string, id as string, data);

            return new ResponseSuccess({
                status: 200,
                code: "PROJECT_UPDATED",
                message: "Project updated successfully",
                data: response
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    static async deleteProject(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as any).user;
            const { id } = req.params;
            const { data } = await Validation(DeletePorjectSchema, req.body);
            const response = await ProjectService.deleteProject(user.id as string, id as string);

            return new ResponseSuccess({
                status: 200,
                code: "PROJECT_DELETED",
                message: "Project deleted successfully",
                data: response
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}