import Validation from "../../core/utils/validation.js";
import { RegisterSchema } from "./model.js";
import AuthService from "./service.js";


const validate = Validation.validate;


export default class AuthController {

    static async Register(req, res, next) {
        try {
            const data = await validate(RegisterSchema, req.body);
            const response = await AuthService.Register(data);
            res.status(201).json({
                message : "register success",
                data : response
            });
        } catch (error) {
            next(error);
        }
    }

}