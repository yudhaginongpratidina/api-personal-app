import PortfolioRepository from "./repository.js";
import ResponseError from "../../core/utils/response-error.js";
import { deletePortfolioImage } from "../../core/middleware/portfolio-image.js";
import bcrypt from "bcrypt";

export default class PortfolioService {

    static async Create(userId, data) {
        const response = await PortfolioRepository.create(userId, data);
        return response;
    }

    static async GetMyPortfolio(userId) {
        const response = await PortfolioRepository.get_my_portfolio(userId);
        return response;
    }

    static async GetDetail(id, userId) {
        const response = await PortfolioRepository.get_detail(id, userId);
        if (!response) throw new ResponseError(404, "portfolio not found");
        return response;
    }

    static async Update(id, userId, data) {
        const find_data = await PortfolioRepository.find_data(id);
        if (!find_data) throw new ResponseError(404, "portfolio not found");
        if (find_data.userId !== userId) throw new ResponseError(401, "unauthorized");

        const response = await PortfolioRepository.update_portfolio(id, data);
        return response;
    }

    static async Delete(id, userId, data) {
        const find_data = await PortfolioRepository.find_data(id);
        if (!find_data) throw new ResponseError(404, "portfolio not found");
        if (find_data.userId !== userId) throw new ResponseError(401, "unauthorized");

        const find_user = await PortfolioRepository.find_user(userId);
        const is_match = await bcrypt.compare(data.password, find_user.passwordHash);
        if (!is_match) throw new ResponseError(401, "wrong password");

        if (find_data.portfolioImages.length > 0) {
            for (let i = 0; i < find_data.portfolioImages.length; i++) {
                const delete_image = deletePortfolioImage(find_data.portfolioImages[i].fileName);
                if (!delete_image) throw new ResponseError(500, delete_image.message);
                await PortfolioRepository.delete_image(find_data.portfolioImages[i].id);
            }
        }

        const response = await PortfolioRepository.delete_portfolio(id);
        return response;
    }

}