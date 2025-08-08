import db from "../../core/utils/db.js";

export default class PortfolioRepository {

    static async create(userId, data){
        return await db.portfolio.create({
            data : {
                userId : userId,
                name : data.name,
                repoUrl : data.repo_url,
                demoUrl : data.demo_url,
                description : data.description
            },
            select : {
                id : true
            }
        })
    }

    static async get_my_portfolio(userId){
        return await db.portfolio.findMany({
            where : {
                userId : userId
            },
            select : {
                id : true,
                name : true,
                repoUrl : true,
                demoUrl : true
            }
        })
    }

    static async get_detail(id, userId){
        return await db.portfolio.findUnique({
            where : {
                id: id,
                userId : userId
            },
            include : {
                portfolioImages : true
            }
        })
    }

    static async find_data(id){
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

    static async update_portfolio(id, data){
        return await db.portfolio.update({
            where : {
                id : id
            },
            data : {
                name : data.name,
                repoUrl : data.repo_url,
                demoUrl : data.demo_url,
                description : data.description
            },
            select : {
                id : true
            }
        })
    }

    static async find_user(userId){
        return await db.user.findUnique({
            where : {
                id : userId
            },
            select : {
                id : true,
                passwordHash : true
            }
        })
    }

    static async delete_portfolio(id){
        return await db.portfolio.delete({
            where : {
                id : id
            },
            select : {
                id : true
            }
        })
    }

}