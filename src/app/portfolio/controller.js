import Validation from "../../core/utils/validation.js";
import { PortfolioSchema, DeletePortfolioSchema } from "./model.js";
import PortfolioService from "./service.js";

const validate = Validation.validate;

export default class PortfolioController {


    static async GetMyPortfolio(req, res, next) {
        try {
            const token = req.token;
            const response = await PortfolioService.GetMyPortfolio(token.id);
            res.status(200).json({
                message: "get my portfolio success",
                data: response
            });
        } catch (error) {
            next(error)
        }
    }

    static async GetDetail(req, res, next) {
        try {
            const id = req.params.id;
            const token = req.token;
            const response = await PortfolioService.GetDetail(id, token.id);
            res.status(200).json({
                message: "get detail portfolio success",
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async Create(req, res, next) {
        try {
            const token = req.token;
            const data = await validate(PortfolioSchema, req.body);
            const response = await PortfolioService.Create(token.id, data);
            res.status(201).json({
                message: "create portfolio success",
                data: response
            });
        } catch (error) {
            next(error)
        }
    }

    static async Update(req, res, next) {
        try {
            const id = req.params.id;
            const token = req.token;
            const data = await validate(PortfolioSchema, req.body);
            const response = await PortfolioService.Update(id, token.id, data);
            res.status(200).json({
                message: "update portfolio success",
                data: response
            });
        } catch (error) {
            next(error)
        }
    }

    static async Delete(req, res, next) {
        try {
            const id = req.params.id;
            const token = req.token;
            const data = await validate(DeletePortfolioSchema, req.body);
            const response = await PortfolioService.Delete(id, token.id, data);
            res.status(200).json({
                message: "delete portfolio success",
                data: response
            });
        } catch (error) {
            next(error)
        }
    }

}