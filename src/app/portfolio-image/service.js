import PortfolioImageRepository from "./repository.js";
import ResponseError from "../../core/utils/response-error.js";
import { servePortfolioImage, deletePortfolioImage } from "../../core/middleware/portfolio-image.js";

export default class PortfolioImageService {

    static async Upload(id, userId, fileName) {
        const find_portfolio = await PortfolioImageRepository.find_portfolio(id);
        if (!find_portfolio) throw new ResponseError(404, "portfolio not found");
        if (find_portfolio.userId !== userId) throw new ResponseError(401, "unauthorized");

        const response = await PortfolioImageRepository.upload(id, fileName);
        return response;
    }

    static async GetImage(id, userId, imageId) {
        const find_portfolio = await PortfolioImageRepository.find_portfolio(id);
        if (!find_portfolio) throw new ResponseError(404, "portfolio not found");
        if (find_portfolio.userId !== userId) throw new ResponseError(401, "unauthorized");

        const find_image = await PortfolioImageRepository.get_image(imageId);
        if (!find_image) throw new ResponseError(404, "image not found");
        if (find_image.portfolioId !== id) throw new ResponseError(401, "unauthorized");

        const response = await servePortfolioImage(find_image.fileName);
        return response;
    }

    static async DeleteImage(id, userId, imageId) {
        const find_portfolio = await PortfolioImageRepository.find_portfolio(id);
        if (!find_portfolio) throw new ResponseError(404, "portfolio not found");
        if (find_portfolio.userId !== userId) throw new ResponseError(401, "unauthorized");

        const find_image = await PortfolioImageRepository.get_image(imageId);
        if (!find_image) throw new ResponseError(404, "image not found");
        if (find_image.portfolioId !== id) throw new ResponseError(401, "unauthorized");

        const delete_image = deletePortfolioImage(find_image.fileName);
        if (!delete_image) throw new ResponseError(500, delete_image.message);

        const response = await PortfolioImageRepository.delete_image(imageId);
        return response;
    }

}