import Validation from "../../core/utils/validation.js";
import { ChangePasswordSchema, DeleteAccountSchema } from "./model.js";
import AuthService from "./service.js";


const validate = Validation.validate;


export default class AccountController {

    static async GetAccount(req, res, next) {
        try {
            const token = req.token;
            const response = await AuthService.GetAccount(token.id);
            return res.status(200).json({
                message: "get account success",
                data: response
            });
        } catch (error) {
            next(error);
        }
    }

    static async ChangePassword(req, res, next){
        try {
            const token = req.token;
            const data = await validate(ChangePasswordSchema, req.body);
            const response = await AuthService.ChangePassword(token.id, data);
            return res.status(200).json({
                message: "change password success",
                data: response
            })
        } catch (error) {
            next(error);
        }
    }

    static async DeleteAccount(req, res, next){
        try {
            const token = req.token;
            const data = await validate(DeleteAccountSchema, req.body);
            await AuthService.DeleteAccount(token.id, data);
            return res.status(200).json({
                message: "delete account success"
            })
        } catch (error) {
            next(error)
        }
    }

}