import type { Request, Response, NextFunction } from "express";

import Validation from "@/utils/validation";
import { RegisterSchema, LoginSchema } from "@/schema/auth-schema";

import AuthService from "@/service/auth-service";
import ResponseSuccess from "@/utils/response-success";


export default class AuthController {

    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { data } = Validation(RegisterSchema, req.body);
            const response = await AuthService.register(data);

            return new ResponseSuccess({
                status: 201,
                code: "SUCCESS_USER_REGISTERED",
                message: "User registered successfully",
                data: response
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { data } = Validation(LoginSchema, req.body);
            const response = await AuthService.login(data);

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

    static async logout(req: Request, res: Response, next: NextFunction) {
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