import type { Request, Response, NextFunction } from "express";
import { UAParser } from "ua-parser-js";

import Validation from "@/utils/validation";
import { RegisterSchema, LoginSchema } from "@/schema/auth-schema";

import AuthService from "@/service/auth-service";
import cookieOptions from "@/config/cookie";
import ResponseError from "@/utils/response-error";
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
            const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const userAgent = req.headers['user-agent'] || "unknown";

            const parser = new (UAParser as any)();
            parser.setUA(userAgent);
            const deviceType = parser.getDevice().type || "desktop";

            const { data } = Validation(LoginSchema, req.body);
            const dataWithIpAddress: any = { ...data, ipAddress, userAgent, deviceType };

            const { accessToken, refreshToken } = await AuthService.login(dataWithIpAddress);

            res.cookie('refresh_token', refreshToken, cookieOptions);
            res.cookie('authenticated', true, cookieOptions);

            return new ResponseSuccess({
                status: 200,
                code: "SUCCESS_USER_LOGGED_IN",
                message: "User logged in successfully",
                data: {
                    token: accessToken,
                }
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    static async refreshToken(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies.refresh_token;

        try {
            if (!token) {
                throw new ResponseError({
                    status: 401,
                    code: "NOT_LOGGED_IN",
                    message: "You are not logged in. Please login first."
                });
            }

            const newAccessToken = await AuthService.refreshToken(token);

            return new ResponseSuccess({
                status: 200,
                code: "SUCCESS_TOKEN_REFRESHED",
                message: "Token refreshed successfully",
                data: {
                    token: newAccessToken
                }
            }).send(res);
        } catch (error: any) {
            if (["REFRESH_TOKEN_EXPIRED", "ALREADY_LOGGED_OUT"].includes(error?.code)) {
                res.clearCookie("refresh_token", cookieOptions);
                res.clearCookie("authenticated", cookieOptions);
            }
            return next(error);
        }
    }



    static async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies.refresh_token;
            await AuthService.logout(token);

            res.clearCookie('refresh_token', cookieOptions);
            res.clearCookie('authenticated', cookieOptions);

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