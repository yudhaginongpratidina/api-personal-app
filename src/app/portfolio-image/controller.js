import PortfolioImageService from "./service.js";

export default class PortfolioImageController {

    static async Upload(req, res, next) {
        try {
            const id = req.params.id;
            const token = req.token;
            const image = req.image;
            const response = await PortfolioImageService.Upload(id, token.id, image.filename);
            return res.status(201).json({
                message: "upload portfolio image success",
                data: response
            })
        } catch (error) {
            next(error);
        }
    }

    static async GetImage(req, res, next) {
        try {
            const id = req.params.id;
            const token = req.token;
            const imageId = req.params.imageId;
            const response = await PortfolioImageService.GetImage(id, token.id, imageId);

            res.setHeader('Content-Type', 'image/jpeg');
            res.setHeader('Cache-Control', 'public, max-age=31536000');
            res.sendFile(response);
        } catch (error) {
            next(error);
        }
    }

    static async DeleteImage(req, res, next) {
        try {
            const id = req.params.id;
            const token = req.token;
            const imageId = req.params.imageId;
            const response = await PortfolioImageService.DeleteImage(id, token.id, imageId);
            return res.status(200).json({
                message: "delete portfolio image success",
                data: response
            })
        } catch (error) {
            next(error);
        }
    }

}