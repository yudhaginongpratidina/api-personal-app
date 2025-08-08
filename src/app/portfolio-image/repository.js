import db from "../../core/utils/db.js";

export default class PortfolioImageRepository {

    static async find_portfolio(id){
        return await db.portfolio.findUnique({
            where : {
                id : id
            },
            select : {
                id : true,
                userId : true
            }
        })
    }

    static async upload(portfolioId, fileName){
        return await db.portfolioImage.create({
            data : {
                portfolioId : portfolioId,
                fileName : fileName
            },
            select : {
                id : true,
            }
        })
    }

    static async get_image(imageId) {
        return await db.portfolioImage.findUnique({
            where : {
                id : imageId
            },
            select : {
                id : true,
                portfolioId : true,
                fileName : true
            }
        })
    }

    static async delete_image(imageId) {
        return await db.portfolioImage.delete({
            where : {
                id : imageId
            },
            select : {
                id : true,
            }
        })
    }

}