import type { Request, Response, NextFunction } from "express";
import Validation from "@/utils/validation";
import { ExperienceSchema, DeleteExperienceSchema } from "@/schema/experience-schema";

import ExperienceService from "@/service/experience-service";
import ResponseSuccess from "@/utils/response-success";

export default class ExperienceController {

    static async createExperienc(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as any).user;
            const { data } = Validation(ExperienceSchema, req.body);
            const response = await ExperienceService.createExperience(user.id, data);

            return new ResponseSuccess({
                status: 201,
                code: "EXPERIENCE_CREATED",
                message: "Experience created successfully",
                data: response
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    static async getExperiences(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await ExperienceService.getAllExperience();
            return new ResponseSuccess({
                status: 200,
                code: "EXPERIENCES_FETCHED",
                message: "Experiences fetched successfully",
                data: response
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    static async getExperience(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const response = await ExperienceService.getExperienceById(id as string);
            return new ResponseSuccess({
                status: 200,
                code: "EXPERIENCE_FETCHED",
                message: "Experience fetched successfully",
                data: response
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    static async updateExperience(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const user = (req as any).user;
            const { data } = Validation(ExperienceSchema, req.body);
            const response = await ExperienceService.updateExperienceById(user.id as string, id as string, data);

            return new ResponseSuccess({
                status: 200,
                code: "EXPERIENCE_UPDATED",
                message: "Experience updated successfully",
                data: response
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    static async deleteExperience(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const user = (req as any).user;
            const { data } = await Validation(DeleteExperienceSchema, req.body);
            const response = await ExperienceService.deleteExperienceById(user.id as string, id as string);

            return new ResponseSuccess({
                status: 200,
                code: "EXPERIENCE_DELETED",
                message: "Experience deleted successfully",
                data: response
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}