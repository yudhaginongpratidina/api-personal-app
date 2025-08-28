import type { Request, Response, NextFunction } from "express";

import Validation from "@/utils/validation";
import { RegisterSchema, LoginSchema } from "@/schema/auth-schema";
import ResponseSuccess from "@/utils/response-success";


export default class AuthController {

    static async REGISTER(req: Request, res: Response, next: NextFunction) {
        try {
            const { data } = Validation(RegisterSchema, req.body);
            const response = data

            return new ResponseSuccess({
                status: 201,
                code: "SUCCESS_USER_REGISTERED",
                message: "User fetched successfully",
                data: response
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    static async LOGIN(req: Request, res: Response, next: NextFunction) {
        try {
            const { data } = Validation(LoginSchema, req.body);
            const response = data

            console.log(response);

            return new ResponseSuccess({
                status: 200,
                code: "SUCCESS_USER_LOGGED_IN",
                message: "User fetched successfully",
                data: response
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    static async LOGOUT(req: Request, res: Response, next: NextFunction) {
        try {
            return new ResponseSuccess({
                status: 200,
                code: "SUCCESS_USER_LOGGED_OUT",
                message: "User logged out successfully",
                data: null
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

}