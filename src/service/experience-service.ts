import type { ExperienceRequest } from "@/schema/experience-schema";
import ExperienceRepository from "@/repository/experience-repository";
import ResponseError from "@/utils/response-error";

export default class ExperienceService {

    static async createExperience(userId: string, data: ExperienceRequest) {
        const user_check = await ExperienceRepository.userCheck(userId);
        if (!user_check) throw new ResponseError({
            status: 404,
            code: "USER_NOT_FOUND",
            message: `user with id ${userId} not found`
        })

        const response = await ExperienceRepository.createExperience(userId, data);
        return response;
    }

    static async getAllExperience() {
        const response = await ExperienceRepository.getAllExperience();
        return response;
    }

    static async getExperienceById(id: string) {
        const response = await ExperienceRepository.getExpericeById(id);
        if (!response) throw new ResponseError({
            status: 404,
            code: "EXPERIENCE_NOT_FOUND",
            message: `experience with id ${id} not found`
        })
        return response;
    }

    static async updateExperienceById(userId: string, experienceId: string, data: ExperienceRequest) {
        const user_check = await ExperienceRepository.userCheck(userId);
        if (!user_check) throw new ResponseError({
            status: 404,
            code: "USER_NOT_FOUND",
            message: `user with id ${userId} not found`
        })

        const experience_check = await ExperienceRepository.getExpericeById(experienceId);
        if (!experience_check) throw new ResponseError({
            status: 404,
            code: "EXPERIENCE_NOT_FOUND",
            message: `experience with id ${experienceId} not found`
        })

        const data_match_with_user_id = experience_check.userId === userId;
        if (!data_match_with_user_id) throw new ResponseError({
            status: 403,
            code: "FORBIDDEN_ACCESS",
            message: "You do not have permission to modify this experience"
        })

        const response = await ExperienceRepository.updateExperienceById(userId, experienceId, data);
        return response;
    }

    static async deleteExperienceById(userId: string, experienceId: string) {
        const user_check = await ExperienceRepository.userCheck(userId);
        if (!user_check) throw new ResponseError({
            status: 404,
            code: "USER_NOT_FOUND",
            message: `user with id ${userId} not found`
        })

        const experience_check = await ExperienceRepository.getExpericeById(experienceId);
        if (!experience_check) throw new ResponseError({
            status: 404,
            code: "EXPERIENCE_NOT_FOUND",
            message: `experience with id ${experienceId} not found`
        })

        const data_match_with_user_id = experience_check.userId === userId;
        if (!data_match_with_user_id) throw new ResponseError({
            status: 403,
            code: "FORBIDDEN_ACCESS",
            message: "You do not have permission to modify this experience"
        })

        const response = await ExperienceRepository.deleteExperienceById(userId, experienceId);
        return response;
    }

}